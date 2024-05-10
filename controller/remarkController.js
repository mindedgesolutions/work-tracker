import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { paginationLogicFive } from "../utils/pagination.js";
import { currentDate } from "../utils/functions.js";

// ------
export const taskRemarks = async (req, res) => {
  const { uuid } = req.params;
  const { name, page } = req.query;
  const pagination = paginationLogicFive(page, null);

  const search = name ? ` and um.name ilike '%${name}%'` : ``;

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
    where tr.id is not null and tr.task_id=$1 ${search} group by tr.id order by tr.id desc offset $2 limit $3`,
    [tid, pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(
    `select tr.* from task_remarks tr
    left join users um on tr.remark_by = um.id
    where tr.id is not null ${search} and tr.task_id=$1 group by tr.id`,
    [tid]
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

export const taskRemarksAll = async (req, res) => {
  const { uuid } = req.params;
  const taskId = await pool.query(`select id from task_master where uuid=$1`, [
    uuid,
  ]);
  const tid = taskId.rows[0].id;
  const data = await pool.query(`select * from task_remarks where task_id=$1`, [
    tid,
  ]);

  res.status(StatusCodes.OK).json({ data });
};

// ------
export const addRemark = async (req, res) => {
  const { uuid: taskUuid } = req.params;
  const { uuid: userUuid } = req.user;
  const { startTime, endTime, comments } = req.body;

  const createdAt = currentDate();
  const updatedAt = currentDate();

  try {
    await pool.query(`BEGIN`);

    const tid = await pool.query(`select id from task_master where uuid=$1`, [
      taskUuid,
    ]);

    const uid = await pool.query(`select id from users where uuid=$1`, [
      userUuid,
    ]);

    await pool.query(`select count(id) from task_remarks where task_id=$1`, [
      tid.rows[0].id,
    ]);

    const status = 2;

    await pool.query(
      `update task_master set task_status=$1 where id=$2 and task_status!=3`,
      [status, tid.rows[0].id]
    );

    const data = await pool.query(
      `insert into task_remarks(task_id, remark_by, remark, created_at, updated_at, start_time, end_time)
      values($1, $2, $3, $4, $5, $6, $7)`,
      [
        tid.rows[0].id,
        uid.rows[0].id,
        comments.trim(),
        createdAt,
        updatedAt,
        startTime,
        endTime,
      ]
    );

    await pool.query(`COMMIT`);

    res.status(StatusCodes.CREATED).json({ data });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    return error;
  }
};

// ------
export const updateRemark = async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, comments } = req.body;

  const updatedAt = currentDate();

  const data = await pool.query(
    `update task_remarks set remark=$1, updated_at=$2, start_time=$3, end_time=$4 where id=$5`,
    [comments.trim(), updatedAt, startTime, endTime, id]
  );

  res.status(StatusCodes.ACCEPTED).json({ data });
};

// ------
export const deleteRemark = async (req, res) => {
  const { id } = req.params;
  await pool.query(`delete from task_remarks where id=$1`, [id]);

  res.status(StatusCodes.NO_CONTENT).json({ data: `success` });
};
