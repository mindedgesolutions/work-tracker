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

// ------

export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};

// ------

export const loggedInUserInfo = async (req, res) => {
  const { uuid } = req.user;
  const data = await pool.query(
    `select um.*, roles.name as rname,
    json_agg(
      json_build_object(
        'id', pr.id,
        'name', pr.name
      )
    ) as permissions
    from users um
    left join roles on roles.id = um.role_id
    left join map_user_permission mup on mup.user_id = um.id
    left join permissions pr on pr.id = mup.permission_id
    where um.uuid=$1 group by um.id, roles.id`,
    [uuid]
  );

  res.status(StatusCodes.OK).json({ data });
};
