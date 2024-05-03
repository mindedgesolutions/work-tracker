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

  try {
    await pool.query(`BEGIN`);

    const data = await pool.query(
      `insert into users(name, email, mobile, username, password, role_id, uuid, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id`,
      [name, email, mobile, email, password, roleId, uid, createdAt, updatedAt]
    );

    const userId = data.rows[0].id;

    const permissions = await pool.query(
      `select * from map_role_permission where role_id=$1`,
      [roleId]
    );

    for (const permission of permissions.rows) {
      const ins = await pool.query(
        `insert into map_user_permission(user_id, permission_id) values($1, $2)`,
        [userId, permission.permission_id]
      );
    }

    await pool.query(`COMMIT`);

    res.status(StatusCodes.CREATED).json({ data });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    return error;
  }
};

// ------

export const editUserDetails = async (req, res) => {
  const { name, email, mobile, roleId } = req.body;
  const { id } = req.params;
  const updatedAt = currentDate();

  try {
    await pool.query(`BEGIN`);

    const data = await pool.query(
      `update users set name=$1, email=$2, mobile=$3, role_id=$4, updated_at=$5 where id=$6`,
      [name, email, mobile, roleId, updatedAt, id]
    );

    await pool.query(`delete from map_user_permission where user_id=$1`, [id]);

    const permissions = await pool.query(
      `select * from map_role_permission where role_id=$1`,
      [roleId]
    );

    for (const permission of permissions.rows) {
      const ins = await pool.query(
        `insert into map_user_permission(user_id, permission_id) values($1, $2)`,
        [id, permission.permission_id]
      );
    }

    await pool.query(`COMMIT`);

    res.status(StatusCodes.ACCEPTED).json({ data });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    return error;
  }
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
  let search = name ? `where um.name ilike '%${name.trim()}%'` : ``;

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

export const getAllUserId = async (req, res) => {
  const data = await pool.query(`select id, name from users order by name`, []);

  res.status(StatusCodes.OK).json({ data });
};
