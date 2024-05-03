import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { paginationLogic } from "../../utils/pagination.js";

export const addTeam = async (req, res) => {};

export const updateTeam = async (req, res) => {};

export const getTeamWithPagination = async (req, res) => {
  const { page } = req.query;
  const pagination = paginationLogic(page, null);

  const data = await pool.query(
    `select usr.*,
    roles.name as role,
    json_agg(
      json_build_object(
        'id', teams.member_id,
        'name', usr.name
      )
    ) as members
    from users usr 
    left join roles on usr.role_id = roles.id
    left join teams on teams.manager_id = usr.id
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
