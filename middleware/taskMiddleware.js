import { body } from "express-validator";
import { withValidationErrors } from "./withErrorMiddleware.js";
import { BadRequestError } from "../errors/customErrors.js";

export const validateTask = withValidationErrors([
  body("projectId").notEmpty().withMessage(`Select a project`),
  body("priority").notEmpty().withMessage(`Select priority`),
  body("allottedTime").notEmpty().withMessage(`Select allotted time`),
  body("taskDescShort")
    .notEmpty()
    .withMessage(`Short description of the task is required`)
    .isLength({ min: 3, max: 255 })
    .withMessage(`Short description must be between 3 to 255 characters`),
  body("assigns").custom((value, { req }) => {
    const { assigns } = req.body;
    if (assigns.length === 0) {
      throw new BadRequestError(`At least one assignee is required`);
    }
    return true;
  }),
]);

export const validateTaskAssign = withValidationErrors([
  body("userId").notEmpty().withMessage(`Select an assignee`),
  body("priority").notEmpty().withMessage(`Select priority`),
  body("time").notEmpty().withMessage(`Select time allotted`),
  body("taskDesc")
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 255 })
    .withMessage(`Description must be between 3 to 255 characters`),
]);
