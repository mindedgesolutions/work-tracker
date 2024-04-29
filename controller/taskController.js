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
export const updateTask = async (req, res) => {};

// ------
export const deleteTask = async (req, res) => {};

// ------
export const getTaskWithPaginationAdmin = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name
    ? `where tm.short_desc ilike '%${name.trim()}%' or tm.task_id ilike '%${name.trim()}%'`
    : ``;

  const data = await pool.query(
    `select tm.*,
    json_agg(
      json_build_object(
        'assign_name', um.name
      )
    ) as details,
    pr.name as prname,
    prm.name as priorityname
    from task_master as tm
    left join task_details td on td.task_id = tm.id
    left join users um on td.assigned_to = um.id
    left join projects pr on pr.id = tm.project_id
    left join priority_master prm on prm.id = tm.priority
    ${search} group by tm.id, pr.name, prm.name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(
    `select * from task_master tm ${search}`,
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
export const getTaskWithPaginationUser = async (req, res) => {};
