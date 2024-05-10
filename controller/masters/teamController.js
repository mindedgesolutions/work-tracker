import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { paginationLogic } from "../../utils/pagination.js";
import { currentDate } from "../../utils/functions.js";

// ------
export const addTeam = async (req, res) => {
  const { lead, members } = req.body;
  const createdAt = currentDate();
  const updatedAt = currentDate();

  try {
    await pool.query(`BEGIN`);

    const del = await pool.query(`delete from teams where reporting_to=$1`, [
      lead,
    ]);

    for (const member of members) {
      await pool.query(
        `insert into teams(user_id, reporting_to, created_at, updated_at) values($1, $2, $3, $4)`,
        [member.value, lead, createdAt, updatedAt]
      );
    }

    await pool.query(`COMMIT`);

    res.status(StatusCodes.CREATED).json({ data: `success` });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    return error;
  }
};

// ------
export const getAvailableMembers = async (req, res) => {
  const data = await pool.query(
    `select um.id, um.name
    from users um
    where um.role_id >= 5 and um.id not in (select user_id from teams) order by um.name`,
    []
  );

  res.status(StatusCodes.OK).json({ data });
};

// ------
export const getLeadWithPagination = async (req, res) => {
  const { page } = req.query;
  const pagination = paginationLogic(page, null);

  const data = await pool.query(
    `select usr.*,
    roles.name as role,
    json_agg(
      json_build_object(
        'id', teams.user_id,
        'name', tusr.name
      )
    ) as members
    from users usr 
    left join roles on usr.role_id = roles.id
    left join teams on teams.reporting_to = usr.id
    left join users tusr on tusr.id = teams.user_id
    where usr.role_id in (1, 2, 3, 4) and usr.is_active=true 
    group by usr.id, roles.name
    order by usr.name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(
    `select * from users usr where usr.role_id in (1, 2, 3, 4) and usr.is_active=true`,
    []
  );
  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};
