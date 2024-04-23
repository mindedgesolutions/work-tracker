import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Middlewares
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

// Routes ---
import masterRouter from "./routes/masterRoutes.js";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

// API starts ---
app.use("/api/v1/masters", masterRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
// API ends ---

const port = process.env.APP_PORT || 3001;

app.use("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: `not found` });
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
