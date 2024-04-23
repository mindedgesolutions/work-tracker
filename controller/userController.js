import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/passwordUtils.js";
import { currentDate } from "../utils/functions.js";
import { paginationLogic } from "../utils/pagination.js";

// ------

export const addNewUser = async (req, res) => {
  const { name, email, mobile, roleId } = req.body;
  const uid = uuidv4();
  const password = await hashPassword("welcome123");
  const createdAt = currentDate();
  const updatedAt = currentDate();

  const data = await pool.query(
    `insert into users(name, email, mobile, username, password, role_id, uuid, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [name, email, mobile, email, password, roleId, uid, createdAt, updatedAt]
  );

  res.status(StatusCodes.CREATED).json({ data });
};

// ------

export const editUserDetails = async (req, res) => {
  const { name, email, mobile, roleId } = req.body;
  const { id } = req.params;
  const updatedAt = currentDate();

  const data = await pool.query(
    `update users set name=$1, email=$2, mobile=$3, role_id=$4, updated_at=$5 where id=$6`,
    [name, email, mobile, roleId, updatedAt, id]
  );

  res.status(StatusCodes.OK).json({ data });
};

// ------

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const updatedAt = currentDate();

  const data = await pool.query(
    `update users set is_active=false, updated_at=$1 where id=$2`,
    [updatedAt, id]
  );

  res.status(StatusCodes.OK).json({ data });
};

// ------

export const getUserWithPagination = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where um.name ilike '%${name}%'` : ``;

  const data = await pool.query(
    `select um.*,
    roles.name as role,
    json_agg(
      json_build_object(
        'id', pr.id,
        'name', pr.name
      )
    ) as permissions
    from users as um
    left join roles on roles.id = um.role_id
    left join map_user_permission mup on mup.user_id = um.id
    left join permissions pr on pr.id = mup.permission_id
    ${search} group by um.id, roles.name order by um.name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(`select * from users um ${search}`, []);
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};

// ------
