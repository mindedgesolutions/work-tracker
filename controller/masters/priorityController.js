import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";

export const getAllPriority = async (req, res) => {
  const data = await pool.query(`select * from priority_master`, []);

  res.status(StatusCodes.OK).json({ data });
};
