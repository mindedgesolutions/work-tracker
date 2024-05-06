import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { BadRequestError } from "../errors/customErrors.js";
import { currentDate, generateTaskId, getUserId } from "../utils/functions.js";
import { v4 as uuidv4 } from "uuid";
import { paginationLogic } from "../utils/pagination.js";

// ------
export const addNewTask = async (req, res) => {
  const {
    projectId,
    priority,
    allottedTime,
    timeUnit,
    taskDescShort,
    taskDescLong,
    assigns,
  } = req.body;
  const { uuid } = req.user;
  const assignedBy = await getUserId(uuid);

  if (assigns.length === 0) {
    throw new BadRequestError(`Add at least one assignee`);
  }

  const createdAt = currentDate();
  const updatedAt = currentDate();
  const longDesc = taskDescLong ? taskDescLong?.trim() : null;
  const taskUuid = uuidv4();

  try {
    await pool.query(`BEGIN`);

    const data = await pool.query(
      `insert into task_master(short_desc, long_desc, project_id, time_allotted, time_unit, priority, assigned_by, created_at, updated_at, uuid, is_active) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning id`,
      [
        taskDescShort.trim(),
        longDesc,
        Number(projectId),
        Number(allottedTime),
        timeUnit,
        Number(priority),
        Number(assignedBy),
        createdAt,
        updatedAt,
        taskUuid,
        true,
      ]
    );

    const taskId = data.rows[0].id;

    const task = await generateTaskId(Number(projectId), taskId);

    for (const assignee of assigns) {
      const tdesc = assignee.taskDesc ? assignee.taskDesc.trim() : null;
      const details = await pool.query(
        `insert into task_details(task_id, assigned_to, priority, time_allotted, time_unit, task_desc, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
        [
          Number(taskId),
          Number(assignee.userId),
          Number(assignee.priority),
          Number(assignee.time),
          assignee.timeUnit,
          tdesc,
          createdAt,
          updatedAt,
        ]
      );
    }

    await pool.query(`update task_master set task_id=$1 where id=$2`, [
      task,
      taskId,
    ]);

    await pool.query(`COMMIT`);

    res.status(StatusCodes.CREATED).json({ data });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    return error;
  }
};

// ------
export const taskAssignee = async (req, res) => {
  const { userId, priority, time, timeUnit, taskDesc } = req.body;
  const data = {
    userId: userId,
    priority: priority,
    time: time,
    timeUnit: timeUnit,
    taskDesc: taskDesc,
  };
  res.status(StatusCodes.OK).json({ data });
};

// ------
export const editTask = async (req, res) => {
  const { id: uuid } = req.params;
  const data = await pool.query(
    `select tm.*,
    json_agg(
      json_build_object(
        'assigned_to', td.assigned_to,
        'assignee_name', um.name,
        'priority', td.priority,
        'time_allotted', td.time_allotted,
        'time_unit', td.time_unit,
        'task_desc', td.task_desc
      )
    ) as details
    from task_master tm
    left join task_details td on td.task_id = tm.id
    left join users um on td.assigned_to = um.id
    where tm.uuid=$1 group by tm.id`,
    [uuid]
  );

  res.status(StatusCodes.OK).json({ data });
};

// ------
export const updateTask = async (req, res) => {
  const {
    projectId,
    priority,
    allottedTime,
    timeUnit,
    taskDescShort,
    taskDescLong,
    assigns,
  } = req.body;
  const { uuid } = req.params;

  if (assigns.length === 0) {
    throw new BadRequestError(`Add at least one assignee`);
  }

  const long = taskDescLong ? taskDescLong.trim() : null;
  const createdAt = currentDate();
  const updatedAt = currentDate();

  try {
    await pool.query(`BEGIN`);

    const taskId = await pool.query(
      `select id from task_master where uuid=$1`,
      [uuid]
    );
    const tid = taskId.rows[0].id;

    const data = await pool.query(
      `update task_master set short_desc=$1, long_desc=$2, project_id=$3, time_allotted=$4, time_unit=$5, priority=$6, updated_at=$7 where id=$8`,
      [
        taskDescShort.trim(),
        long,
        projectId,
        allottedTime,
        timeUnit,
        priority,
        updatedAt,
        tid,
      ]
    );

    await pool.query(`delete from task_details where task_id=$1`, [tid]);

    for (const assignee of assigns) {
      const tdesc = assignee.taskDesc ? assignee.taskDesc.trim() : null;
      const details = await pool.query(
        `insert into task_details(task_id, assigned_to, priority, time_allotted, time_unit, task_desc, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          Number(tid),
          Number(assignee.userId),
          Number(assignee.priority),
          Number(assignee.time),
          assignee.timeUnit,
          tdesc,
          createdAt,
          updatedAt,
        ]
      );
    }

    await pool.query(`COMMIT`);

    res.status(StatusCodes.ACCEPTED).json({ data });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    return error;
  }
};

// ------
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(
    `update task_master set is_active=false where id=$1`,
    [id]
  );

  res.status(StatusCodes.NO_CONTENT).json({ data });
};

// ------
export const activateTask = async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(
    `update task_master set is_active=true where id=$1`,
    [id]
  );

  res.status(StatusCodes.ACCEPTED).json({ data });
};

// ------
export const taskAllData = async (req, res) => {
  const { uuid } = req.params;

  const taskId = await pool.query(`select id from task_master where uuid=$1`, [
    uuid,
  ]);
  const tid = taskId.rows[0].id;
  const data = await pool.query(
    `select tm.*,
    json_agg(
      json_build_object(
        'assign_name', um.name
      )
    ) as details,
    uma.name as assignby,
    pr.name as prname,
    prm.name as priorityname
    from task_master tm
    left join task_details td on td.task_id = tm.id
    left join users um on td.assigned_to = um.id
    left join users uma on uma.id = tm.assigned_by
    left join projects pr on pr.id = tm.project_id
    left join priority_master prm on prm.id = tm.priority
    where tm.id is not null and tm.id=$1
    group by tm.id, pr.name, prm.name, uma.name`,
    [tid]
  );

  res.status(StatusCodes.OK).json({ data });
};

// ------
export const taskRemarks = async (req, res) => {
  const { uuid } = req.params;
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);

  const taskId = await pool.query(`select id from task_master where uuid=$1`, [
    uuid,
  ]);
  const tid = taskId.rows[0].id;
  const data = await pool.query(
    `select tr.*,
    json_agg(
      json_build_object(
        'assign_name', um.name
      )
    ) as details
    from task_remarks tr
    left join users um on tr.remark_by = um.id
    where tr.id is not null and tr.id=$1 group by tr.id offset $2 limit $3`,
    [tid, pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(
    `select tr.* from task_remarks tr
    left join users um on tr.remark_by = um.id
    where tr.id is not null group by tr.id`,
    []
  );
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};

// ------
export const getTaskWithPaginationAdmin = async (req, res) => {
  const { page, projectId, priority, taskId, userId } = req.query;
  const pagination = paginationLogic(page, null);

  let filter = "";
  if (projectId) {
    filter += ` and tm.project_id=${projectId}`;
  }
  if (priority) {
    filter += ` and tm.priority=${priority}`;
  }
  if (taskId) {
    filter += ` and tm.task_id ilike '%${taskId.trim()}%'`;
  }
  if (userId) {
    filter += ` and td.assigned_to=${userId}`;
  }

  const data = await pool.query(
    `select tm.*,
    json_agg(
      json_build_object(
        'assign_name', um.name
      )
    ) as details,
    pr.name as prname,
    prm.name as priorityname
    from task_master tm
    left join task_details td on td.task_id = tm.id
    left join users um on td.assigned_to = um.id
    left join projects pr on pr.id = tm.project_id
    left join priority_master prm on prm.id = tm.priority
    where tm.id is not null
    ${filter} group by tm.id, pr.name, prm.name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(
    `select tm.* from task_master tm
    left join task_details td on td.task_id = tm.id
    where tm.id is not null ${filter} group by tm.id`,
    []
  );
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};

// ------
export const getTaskWithPaginationLead = async (req, res) => {};

// ------
export const getTaskWithPaginationUser = async (req, res) => {
  const { uuid } = req.user;
  const { page } = req.query;
  const pagination = paginationLogic(page, null);

  const user = await pool.query(`select id from users where uuid=$1`, [uuid]);
  const id = user.rows[0].id;

  const data = await pool.query(
    `select tm.*,
      json_agg(
        json_build_object(
          'assign_name', um.name
        )
      ) as details,
      pr.name as prname,
      prm.name as priorityname
      from task_master tm
      left join task_details td on td.task_id = tm.id
      left join users um on td.assigned_to = um.id
      left join projects pr on pr.id = tm.project_id
      left join priority_master prm on prm.id = tm.priority
      where tm.id is not null and td.assigned_to = $3
      group by tm.id, pr.name, prm.name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit, id]
  );

  const records = await pool.query(
    `select tm.* from task_master tm
      left join task_details td on td.task_id = tm.id
      where tm.id is not null and td.assigned_to = $1 group by tm.id`,
    [id]
  );
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};
