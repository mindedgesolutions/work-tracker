import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { BadRequestError } from "../errors/customErrors.js";
import { checkPassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/functions.js";

export const login = async (req, res) => {
  const { username, password, captcha, inputCaptcha, remember } = req.body;

  const user = await pool.query(
    `select id, password, uuid, role_id from users where username=$1`,
    [username]
  );
  if (!user?.rows[0]?.id) {
    throw new BadRequestError(`User doesn't exist`);
  }
  const pass = await checkPassword(password, user?.rows[0]?.password);
  if (!pass) {
    throw new BadRequestError(`Incorrect password`);
  }
  const token = createJWT(user?.rows[0]?.uuid, remember);

  const short = 1000 * 60 * 60 * 24 * 1;
  const long = 1000 * 60 * 60 * 24 * 7;

  res.cookie("token", token, {
    httpOnly: true,
    expiresIn: remember
      ? new Date(Date.now() + long)
      : new Date(Date.now + short),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ data: user?.rows[0]?.role_id });
};
