import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { paginationLogic } from "../../utils/pagination.js";
import slug from "slug";

// ------

export const addNewPermission = async (req, res) => {
  const { name } = req.body;
  const nameSlug = slug(name);
  const data = await pool.query(
    `insert into permissions(name, slug) values($1, $2)`,
    [name, nameSlug]
  );

  res.status(StatusCodes.CREATED).json({ data });
};

// ------

export const updatePermission = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const nameSlug = slug(name);
  const data = await pool.query(
    `update permissions set name=$1, slug=$2 where id=$3`,
    [name, nameSlug, id]
  );

  res.status(StatusCodes.ACCEPTED).json({ data });
};

// ------

export const deletePermission = async (req, res) => {};

// ------

export const getAllPermissions = async (req, res) => {
  const data = await pool.query(`select * from permissions`, []);

  res.status(StatusCodes.OK).json({ data });
};

// ------

export const getPermissionWithPagination = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where name ilike '%${name}%'` : ``;

  const data = await pool.query(
    `select * from permissions ${search} group by id order by name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(`select * from permissions ${search}`, []);
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};
