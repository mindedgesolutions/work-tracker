import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import dayjs from "dayjs";

export const adminTaskChartBar = async (req, res) => {
  const currentDate = dayjs();

  for (let i = 5; i >= 0; i--) {
    const firstDateOfMonth = currentDate.subtract(i, "month").startOf("month");
    console.log(firstDateOfMonth.format("YYYY-MM-DD"));
  }

  const data = await pool.query(
    `select 
        sum(case when task_status = 3 then 1 else 0 end) as completed_count,
        SUM(case when task_status = 2 then 1 else 0 end) as started_count,
        SUM(case when task_status = 1 then 1 else 0 end) as assigned_count
      from task_master`,
    []
  );
};
