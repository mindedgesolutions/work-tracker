import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { paginationLogic } from "../../utils/pagination.js";
import { currentDate, formatDate } from "../../utils/functions.js";

export const addNewProject = async (req, res) => {
  const { pname, desc, pdept, pmode, startDate, endDate, contacts } = req.body;
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : null;
  const createdAt = currentDate();
  const updatedAt = currentDate();

  try {
    await pool.query(`BEGIN`);

    const data = await pool.query(
      `insert into projects(name, description, department, start_date, end_date, mode, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
      [pname, desc, pdept, start, end, pmode, createdAt, updatedAt]
    );

    for (const contact of contacts) {
      await pool.query(
        `insert into project_contacts(project_id, name, mobile, email, created_at, updated_at) values($1, $2, $3, $4, $5, $6)`,
        [
          data.rows[0].id,
          contact.name.trim(),
          contact.mobile,
          contact.email.trim(),
          createdAt,
          updatedAt,
        ]
      );
    }

    await pool.query(`COMMIT`);

    res.status(StatusCodes.CREATED).json({ data });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    console.log(error);
    return error;
  }
};

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
