import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { paginationLogic } from "../../utils/pagination.js";
import slug from "slug";

// ------

export const addNewRole = async (req, res) => {
  const { name } = req.body;
  const nameSlug = slug(name);
  const data = await pool.query(
    `insert into roles(name, slug) values($1, $2)`,
    [name, nameSlug]
  );

  res.status(StatusCodes.CREATED).json({ data });
};

// ------

export const updateRole = async (req, res) => {
  const { name } = req.body;
  const nameSlug = slug(name);
  const { id } = req.params;
  const data = await pool.query(
    `update roles set name=$1, slug=$2 where id=$3`,
    [name, nameSlug, id]
  );

  res.status(StatusCodes.ACCEPTED).json({ data });
};

// ------

export const deleteRole = async (req, res) => {};

// ------

export const getAllRoles = async (req, res) => {
  const data = await pool.query(
    `select roles.*,
    json_agg(
      json_build_object(
        'id', pr.id,
        'name', pr.name
      )
    ) as permissions
    from roles
    left join map_role_permission mrp on mrp.role_id = roles.id
    left join permissions pr on pr.id = mrp.permission_id
    group by roles.id order by roles.name`,
    []
  );

  res.status(StatusCodes.OK).json({ data });
};

// ------

export const getRoleWithPagination = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where roles.name ilike '%${name.trim()}%'` : ``;

  const data = await pool.query(
    `select roles.*,
    json_agg(
      json_build_object(
        'id', pr.id,
        'name', pr.name
      )
    ) as permissions
    from roles
    left join map_role_permission mrp on mrp.role_id = roles.id
    left join permissions pr on pr.id = mrp.permission_id
    ${search} group by roles.id order by roles.name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(`select * from roles ${search}`, []);
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};
