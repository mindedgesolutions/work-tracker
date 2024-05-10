import { body } from "express-validator";
import { withValidationErrors } from "./withErrorMiddleware.js";
import slug from "slug";
import pool from "../db.js";
import { BadRequestError } from "../errors/customErrors.js";
import dayjs from "dayjs";
import { formatDate } from "../utils/functions.js";
import { isMobileNumber } from "../utils/formatValidation.js";

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

export const validatePermission = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage(`Permission name is required`)
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const input = slug(value);
      const condition = id ? `slug=$1 and id!=$2` : `slug=$1`;
      const values = id ? [input, id] : [input];
      const check = await pool.query(
        `select count(id) from permissions where ${condition}`,
        values
      );
      if (Number(check.rows[0].count) > 0) {
        throw new BadRequestError(`Permission exists`);
      }
      return true;
    }),
]);

export const validateProject = withValidationErrors([
  body("pname").notEmpty().withMessage(`Project name is required`),
  body("pdept").notEmpty().withMessage(`Select department`),
  body("pmode").notEmpty().withMessage(`Select project mode`),
  body("startDate").notEmpty().withMessage(`Start date is required`),
  body("endDate")
    .optional({ checkFalsy: true })
    .custom(async (value, { req }) => {
      const { startDate } = req.body;
      const start = dayjs(formatDate(startDate));
      const end = dayjs(formatDate(value));
      if (end.diff(start) < 0) {
        throw new BadRequestError(`Start date cannot be greater than end date`);
      }
      return true;
    }),
]);

export const validateProjectContact = withValidationErrors([
  body("name").notEmpty().withMessage(`Name of the contact is required`),
  body("email")
    .notEmpty()
    .withMessage(`Email is required`)
    .isEmail()
    .withMessage(`Invalid email`),
  body("mobile")
    .notEmpty()
    .withMessage(`Mobile no. is required`)
    .custom(isMobileNumber)
    .withMessage(`Invalid mobile no.`),
]);

export const validateMenu = withValidationErrors([
  body("name").notEmpty().withMessage(`Name is required`),
  body("parentId")
    .if(body("isParent").equals("true"))
    .notEmpty()
    .withMessage(`Select parent`),
]);

export const validateTeam = withValidationErrors([
  body("members").custom((value, { req }) => {
    if (value.length === 0) {
      throw new BadRequestError(`Select at least one team member`);
    }
    return true;
  }),
]);
