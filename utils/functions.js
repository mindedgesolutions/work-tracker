import dayjs from "dayjs";
import pool from "../db.js";
import slug from "slug";
import jwt from "jsonwebtoken";
import date from "date-and-time";
import { checkIfNum } from "./formatValidation.js";

// ------
export const createUsername = async (name) => {
  let username = slug(name);
  const check = await pool.query(
    `select count(id) from user_master where username=$1`,
    [username]
  );
  let newUsername;
  if (Number(check.rows[0].count) === 0) {
    newUsername = username;
  } else {
    newUsername = username + check.rows[0].count;
  }
  return newUsername;
};

// ------
export const currentDate = () => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
};

// ------
export const formatDate = (value) => {
  const startArray = value.split("-");
  const filterStart = dayjs(
    `${startArray[2]}-${startArray[1]}-${startArray[0]}`,
    "Asia/Kolkata"
  ).format(`YYYY-MM-DD`);

  return filterStart;
};

// ------
export const formatStartDate = (date) => {
  const startArray = date.split("-");
  const filterStart = dayjs(
    `${startArray[2]}-${startArray[1]}-${startArray[0]}`,
    "Asia/Kolkata"
  ).format(`YYYY-MM-DD ${process.env.REPORT_START_TIME}`);

  return filterStart;
};

// ------
export const chartFormatDateAny = (noMonth) => {
  const currentDate = dayjs();

  let allStarts = [],
    allEnds = [];

  for (let i = Number(noMonth); i >= 0; i--) {
    const firstDateOfMonth = currentDate.subtract(i, "month").startOf("month");
    const lastDateOfMonth = currentDate.subtract(i, "month").endOf("month");

    allStarts.push(
      firstDateOfMonth.format(`YYYY-MM-DD ${process.env.REPORT_START_TIME}`)
    );
    allEnds.push(
      lastDateOfMonth.format(`YYYY-MM-DD ${process.env.REPORT_END_TIME}`)
    );
  }

  return [allStarts, allEnds];
};

// ------
export const getUserId = async (uuid) => {
  const data = await pool.query(`select id from users where uuid=$1`, [uuid]);
  return data.rows[0].id;
};

// ------
export const generateTaskId = async (projectId, id) => {
  let concat;
  switch (id.toString().length) {
    case 1:
      concat = `0000` + id;
      break;
    case 2:
      concat = `000` + id;
      break;
    case 3:
      concat = `00` + id;
      break;
    case 4:
      concat = `0` + id;
      break;
    default:
      concat = id;
      break;
  }
  const prName = await pool.query(`select name from projects where id=$1`, [
    projectId,
  ]);
  const wordArr = prName.rows[0].name.split(" ");

  let prefix = "";

  for (let i = 0; i < wordArr.length; i++) {
    const checkNum = checkIfNum(wordArr[i]);
    prefix += checkNum ? wordArr[i] : wordArr[i][0].toUpperCase();
  }

  const taskId = `NICSI/` + prefix + `/` + concat;
  return taskId;
};

// JWT token starts ------
export const createJWT = (uuid, remember) => {
  const payload = { uuid: uuid };
  const token = jwt.sign(payload, process.env.JWT_SECRET_ADMIN, {
    expiresIn: remember
      ? process.env.JWT_EXPIRY_LONG
      : process.env.JWT_EXPIRY_SHORT,
  });
  return token;
};

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
  return decoded;
};
// JWT token ends ------
