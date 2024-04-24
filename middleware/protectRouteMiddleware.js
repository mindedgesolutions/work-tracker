import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/functions.js";

export const protectRoute = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError(`Login required`);
  }
  try {
    const { uuid } = verifyJWT(token);
    req.user = { uuid };
    next();
  } catch (error) {
    throw new UnauthenticatedError(`Login required`);
  }
};
