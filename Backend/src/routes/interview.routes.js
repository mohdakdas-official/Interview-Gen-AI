import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { generateInterViewController, generateResumePdfController, getAllInterviewReportsController, getInterviewReportByIdController } from "../contollers/interview.controller.js";
import upload from "../middlewares/file.middleware.js";
// import { generateResumePdf } from "../services/ai.service.js";

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @desc generate interview report based on user self description, resume pdf and job description
 * @access private
 */
interviewRouter.post("/", authUser, upload.single("resume"), generateInterViewController)

/**
 * @route GET /api/interview/report/:interviewId
 * @desc get interview report by interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId", authUser, getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @desc get all interview reports of the logged-in user
 * @access private
 */
interviewRouter.get("/", authUser, getAllInterviewReportsController)

/**
 * @route Get /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume, and job description
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authUser, generateResumePdfController)


export default interviewRouter;