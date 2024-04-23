import { body } from "express-validator";
import { withValidationErrors } from "./withErrorMiddleware.js";
import { BadRequestError } from "../errors/customErrors.js";

export const validateLogin = withValidationErrors([
  body("username").notEmpty().withMessage(`Enter username`),
  body("password").notEmpty().withMessage(`Enter password`),
  body("inputCaptcha")
    .notEmpty()
    .withMessage(`Enter captcha`)
    .custom((value, { req }) => {
      const { captcha } = req.body;
      if (value !== captcha) {
        throw new BadRequestError(`Incorrect captcha! Try again`);
      }
      return true;
    }),
]);
