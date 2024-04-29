import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { BadRequestError } from "../errors/customErrors.js";
import { currentDate, generateTaskId, getUserId } from "../utils/functions.js";
import { v4 as uuidv4 } from "uuid";

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

export const updateTask = async (req, res) => {};

export const deleteTask = async (req, res) => {};

export const getTaskWithPagination = async (req, res) => {};
