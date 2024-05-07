import { body } from "express-validator";
import { withValidationErrors } from "./withErrorMiddleware.js";
import dayjs from "dayjs";
import { BadRequestError } from "../errors/customErrors.js";

export const validateRemark = withValidationErrors([
  body("startTime")
    .notEmpty()
    .withMessage(`Start time is required`)
    .custom((value, { req }) => {
      const { endTime } = req.body;
      if (endTime) {
        const start = dayjs(`2024-01-01 ${value}`);
        const end = dayjs(`2024-01-01 ${endTime}`);
        const difference = end.diff(start, "seconds", true);
        if (difference <= 0) {
          throw new BadRequestError(`Start time cannot be later than end time`);
        }
        return true;
      }
      return true;
    }),
  body("endTime")
    .notEmpty()
    .withMessage(`End time is required`)
    .custom((value, { req }) => {
      const { startTime } = req.body;
      if (startTime) {
        const start = dayjs(`2024-01-01 ${startTime}`);
        const end = dayjs(`2024-01-01 ${value}`);
        const difference = end.diff(start, "seconds", true);
        if (difference <= 0) {
          throw new BadRequestError(
            `End time cannot be earlier than start time`
          );
        }
        return true;
      }
      return true;
    }),
  body("comments")
    .notEmpty()
    .withMessage(`Comment is required`)
    .isLength({ min: 3, max: 255 })
    .withMessage(`Comments must be between 3 to 255 characters`),
]);
