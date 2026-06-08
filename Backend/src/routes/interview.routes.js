import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { generateInterViewController } from "../contollers/interview.controller.js";
import upload from "../middlewares/file.middleware.js";

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @desc generate interview report based on user self description, resume pdf and job description
 * @access Private
 */
interviewRouter.post("/", authUser, upload.single("resume"), generateInterViewController)


export default interviewRouter;