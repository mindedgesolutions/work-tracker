import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import slug from "slug";
import { paginationLogic } from "../../utils/pagination.js";

// ------
export const addNewMenu = async (req, res) => {
  const { name, parentId, isParent } = req.body;

  const nameSlug = slug(name);
  const parent = isParent === "true" ? parentId : null;
  const bool = isParent === "true" ? true : false;

  const data = await pool.query(
    `insert into menus(name, is_parent, parent_id, slug) values($1, $2, $3, $4)`,
    [name, bool, parent, nameSlug]
  );

  res.status(StatusCodes.CREATED).json({ data });
};

// ------

export const updateMenu = async (req, res) => {};

// ------

export const getAllMenus = async (req, res) => {
  // const data = await pool.query(
  //   `select json_build_object(
  //       'parent_id', parent.id,
  //       'parent_menu', parent.name,
  //       'child_menus',
  //       json_agg(
  //         json_build_object(
  //           'child_id', child.id,
  //           'child_name', child.name
  //         )
  //       )
  //     ) as menu
  //     from menus parent
  //     left join menus child on child.parent_id = parent.id
  //     where parent.is_parent=false
  //     group by parent.id`,
  //   []
  // );
  // res.status(StatusCodes.OK).json({ data });
};

// ------

export const getMenuWithPagination = async (req, res) => {
  // const { name, page } = req.params;
  // const pagination = paginationLogic(page, null);
  // let search = name
  //   ? `where child.name ilike '%${name}%' or parent.name ilike '%${name}%'`
  //   : ``;
  // const searchMeta = name ? `where name ilike '%${name}%'` : ``;
  // const data = await pool.query(
  //   `select json_build_object(
  //       'parent_id', parent.id,
  //       'parent_menu', parent.name,
  //       'child_menus',
  //       json_agg(
  //         json_build_object(
  //           'child_id', child.id,
  //           'child_name', child.name
  //         )
  //       )
  //     ) as menu
  //     from menus parent
  //     left join menus child on child.parent_id = parent.id
  //     ${search} and parent.is_parent=false
  //     group by parent.id offset $1 limit $2`,
  //   [pagination.offset, pagination.pageLimit]
  // );
  // console.log(data);
  // const records = await pool.query(`select * from menus ${searchMeta}`, []);
  // const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  // const meta = {
  //   totalPages: totalPages,
  //   currentPage: pagination.pageNo,
  //   totalRecords: records.rowCount,
  // };
  // res.status(StatusCodes.OK).json({ data, meta });
};
