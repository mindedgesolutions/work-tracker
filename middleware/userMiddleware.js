import { body } from "express-validator";
import { withValidationErrors } from "./withErrorMiddleware.js";
import pool from "../db.js";
import { BadRequestError } from "../errors/customErrors.js";
import { isMobileNumber } from "../utils/formatValidation.js";

export const validateUser = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage(`Name is required`)
    .isLength({ min: 3, max: 255 })
    .withMessage(`Name must be between 3 to 255 characters`),
  body("email")
    .notEmpty()
    .withMessage(`Email is required`)
    .isEmail()
    .withMessage(`Invalid email address`)
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const condition = id ? `email=$1 and id!=$2` : `email=$1`;
      const values = id ? [value, id] : [value];
      const check = await pool.query(
        `select count(id) from users where ${condition}`,
        values
      );
      if (Number(check.rows[0].count) > 0) {
        throw new BadRequestError(`Email exists`);
      }
      return true;
    }),
  body("mobile")
    .notEmpty()
    .withMessage(`Mobile no. is required`)
    .custom(isMobileNumber)
    .withMessage(`Invalid mobile no.`)
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const condition = id ? `mobile=$1 and id!=$2` : `mobile=$1`;
      const values = id ? [value, id] : [value];

      const check = await pool.query(
        `select count(id) from users where ${condition}`,
        values
      );
      if (Number(check.rows[0].count) > 0) {
        throw new BadRequestError(`Mobile no. exists`);
      }
      return true;
    }),
  body("roleId").notEmpty().withMessage(`Select a role for the user`),
]);
