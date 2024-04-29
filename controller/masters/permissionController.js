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

export const activateUser = async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(`update users set is_active=true where id=$1`, [
    id,
  ]);

  res.status(StatusCodes.OK).json({ data });
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
  let search = name ? `where name ilike '%${name.trim()}%'` : ``;

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

// ------

export const assignPermissionToRole = async (req, res) => {
  const { role, permissions } = req.body;

  try {
    await pool.query(`BEGIN`);

    // Role v Permission starts ------
    await pool.query(`delete from map_role_permission where role_id=$1`, [
      role,
    ]);

    for (const permission of permissions) {
      await pool.query(
        `insert into map_role_permission(role_id, permission_id) values($1, $2)`,
        [role, permission.value]
      );
    }
    // Role v Permission ends ------

    // User v Permission starts ------
    const userIds = await pool.query(`select id from users where role_id=$1`, [
      role,
    ]);
    for (const userId of userIds.rows) {
      await pool.query(`delete from map_user_permission where user_id=$1`, [
        userId.id,
      ]);

      for (const permission of permissions) {
        await pool.query(
          `insert into map_user_permission(user_id, permission_id) values($1, $2)`,
          [userId.id, permission.value]
        );
      }
    }
    // User v Permission ends ------

    await pool.query(`COMMIT`);

    res.status(StatusCodes.CREATED).json({ data: `success` });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    return error;
  }
};

// ------

export const assignPermissionToUser = async (req, res) => {
  const { permissions } = req.body;
  const { id } = req.query;

  try {
    await pool.query(`BEGIN`);

    await pool.query(`delete from map_user_permission where user_id=$1`, [id]);

    for (const permission of permissions) {
      await pool.query(
        `insert into map_user_permission(user_id, permission_id) values($1, $2)`,
        [id, permission.value]
      );
    }

    await pool.query(`COMMIT`);

    res.status(StatusCodes.CREATED).json({ data: `success` });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    return error;
  }
};
