import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { paginationLogic } from "../../utils/pagination.js";
import { currentDate, formatDate } from "../../utils/functions.js";
import { BadRequestError } from "../../errors/customErrors.js";

// ------

export const projectContact = async (req, res) => {
  const { name, email, mobile } = req.body;
  const data = {
    name: name,
    email: email,
    mobile: mobile,
  };
  res.status(StatusCodes.OK).json({ data });
};

// ------

export const addNewProject = async (req, res) => {
  const { pname, desc, pdept, pmode, startDate, endDate, contacts } = req.body;
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : null;
  const createdAt = currentDate();
  const updatedAt = currentDate();

  if (!contacts || contacts.length === 0) {
    throw new BadRequestError(
      `At least one contact is required for the project`
    );
  }

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

// ------

export const updateProject = async (req, res) => {
  const { pname, desc, pdept, pmode, startDate, endDate, contacts } = req.body;
  const { id } = req.params;
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : null;
  const updatedAt = currentDate();

  if (contacts.length === 0) {
    throw new BadRequestError(
      `At least one contact is required for the project`
    );
  }

  try {
    await pool.query(`BEGIN`);

    const data = await pool.query(
      `update projects set name=$1, description=$2, department=$3, start_date=$4, end_date=$5, mode=$6, updated_at=$7 where id=$8`,
      [pname, desc, pdept, start, end, pmode, updatedAt, id]
    );

    await pool.query(`delete from project_contacts where project_id=$1`, [id]);

    for (const contact of contacts) {
      await pool.query(
        `insert into project_contacts(project_id, name, mobile, email, created_at, updated_at) values($1, $2, $3, $4, $5, $6)`,
        [id, contact.name, contact.mobile, contact.email, updatedAt, updatedAt]
      );
    }

    await pool.query(`COMMIT`);

    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    console.log(error);
    return error;
  }
};

// ------

export const deleteProject = async (req, res) => {};

// ------

export const getAllProjects = async (req, res) => {
  const data = await pool.query(`select * from projects`, []);

  res.status(StatusCodes.OK).json({ data });
};

// ------

export const getAllProjectsLead = async (req, res) => {};

// ------

export const getAllProjectsUser = async (req, res) => {
  const { id } = req.params;

  const data = await pool.query(
    `select distinct tm.project_id, pm.name
    from task_master tm
    left join task_details td on tm.id = td.task_id
    left join projects pm on tm.project_id = pm.id
    where td.assigned_to=$1`,
    [id]
  );

  res.status(StatusCodes.OK).json({ data });
};

// ------

export const getProjectWithPagination = async (req, res) => {
  const { name, page } = req.query;
  const pagination = paginationLogic(page, null);
  let search = name ? `where pr.name ilike '%${name.trim()}%'` : ``;

  const data = await pool.query(
    `select pr.*,
    json_agg(
      json_build_object(
        'id', pc.id,
        'name', pc.name,
        'email', pc.email,
        'mobile', pc.mobile
      )
    ) as contacts,
    dp.name as dept_name,
    pm.name as mode_name
    from projects pr
    left join project_contacts pc on pr.id = pc.project_id
    left join departments dp on dp.id = pr.department
    left join project_mode pm on pm.id = pr.mode
    ${search} group by pr.id, dp.name, pm.name order by pr.name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(
    `select pr.* from projects pr ${search}`,
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
