import { StatusCodes } from "http-status-codes";
import pool from "../db.js";
import { BadRequestError } from "../errors/customErrors.js";

export const addNewTask = async (req, res) => {
  const {
    projectId,
    priority,
    allottedTime,
    timeUnit,
    taskDescShort,
    taskDescLong,
    assigns,
  } = req.body;

  if (assigns.length === 0) {
    throw new BadRequestError(`Add at least one assignee`);
  }
};

export const taskAssignee = async (req, res) => {
  const { userId, priority, time, timeUnit, taskDesc } = req.body;
  const data = {
    userId: userId,
    priority: priority,
    time: time,
    timeUnit: timeUnit,
    taskDesc: taskDesc,
  };
  res.status(StatusCodes.OK).json({ data });
};

export const updateTask = async (req, res) => {};

export const deleteTask = async (req, res) => {};

export const getTaskWithPagination = async (req, res) => {};
