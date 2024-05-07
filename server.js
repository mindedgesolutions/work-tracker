import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middleware/protectRouteMiddleware.js";

// Middlewares
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

// Routes ---
import masterRouter from "./routes/masterRoutes.js";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import taskRouter from "./routes/taskRoute.js";
import remarkRouter from "./routes/remarkRoute.js";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());

// API starts ---

app.use("/api/v1/masters", protectRoute, masterRouter);
app.use("/api/v1/user", protectRoute, userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", protectRoute, taskRouter);
app.use("/api/v1/remarks", protectRoute, remarkRouter);

// API ends ---

const port = process.env.APP_PORT || 3001;

app.use("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: `not found` });
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
