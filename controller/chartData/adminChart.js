import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import dayjs from "dayjs";
import { chartFormatDateAny } from "../../utils/functions.js";

export const adminTaskChartBar = async (req, res) => {
  let assigned = [],
    wip = [],
    completed = [];

  const allStarts = chartFormatDateAny(5)[0];
  const allEnds = chartFormatDateAny(5)[1];

  for (let index = 0; index <= 5; index++) {
    const start = allStarts[index];
    const end = allEnds[index];
    const data = await pool.query(
      `select 
        sum(case when task_status = 3 then 1 else 0 end) as completed_count,
        sum(case when task_status = 2 then 1 else 0 end) as started_count,
        sum(case when task_status = 1 then 1 else 0 end) as assigned_count
      from task_master where created_at >= $1 and created_at <= $2`,
      [start, end]
    );
    assigned.push(Number(data.rows[0].assigned_count));
    wip.push(Number(data.rows[0].started_count));
    completed.push(Number(data.rows[0].completed_count));
  }

  const response = [
    { name: "Assigned", data: assigned },
    { name: "W.I.P", data: wip },
    { name: "Completed", data: completed },
  ];

  res.status(StatusCodes.OK).json({ data: response });
};

// ------

export const adminRemarkChartPie = async (req, res) => {
  const { project } = req.params;

  res.status(StatusCodes.OK).json({ data: `Coming from NodeJS: ${project}` });
};
