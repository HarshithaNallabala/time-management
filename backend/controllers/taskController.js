import Task from "../models/taskModel.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { task, time } = req.body;
  const newTask = await Task.create({ user: req.user._id, task, time });
  res.status(201).json(newTask);
};

