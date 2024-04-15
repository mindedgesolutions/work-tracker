import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { paginationLogic } from "../../utils/pagination.js";

export const addNewProject = async (req, res) => {};

export const updateProject = async (req, res) => {};

export const deleteProject = async (req, res) => {};

export const getAllProjects = async (req, res) => {
  const data = await pool.query(`select * from projects`, []);

  res.status(StatusCodes.OK).json({ data });
};

export const getProjectWithPagination = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where name ilike '%${name}%'` : ``;

  const data = await pool.query(
    `select * from projects ${search} group by id order by name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(`select * from projects ${search}`, []);
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};
