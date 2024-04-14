import { body } from "express-validator";
import { withValidationErrors } from "./withErrorMiddleware.js";
import slug from "slug";
import pool from "../db.js";
import { BadRequestError } from "../errors/customErrors.js";

export const validateRole = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage(`Name is required`)
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const input = slug(value);
      const condition = id ? `slug=$1 and id!=$2` : `slug=$1`;
      const values = id ? [input, id] : [input];
      const check = await pool.query(
        `select count(id) from roles where ${condition}`,
        values
      );
      if (Number(check.rows[0].count) > 0) {
        throw new BadRequestError(`Role exists`);
      }
      return true;
    }),
]);
