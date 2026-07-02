import * as pdfParse from 'pdf-parse';
import { generateInteviewReport, generateResumePdf } from '../services/ai.service.js';
import { interviewReportModel } from '../models/interviewReport.model.js';
import { success } from 'zod';

/**
 * @description: Generate interview report based on user self description, resume pdf and job description
 */
export const generateInterViewController = async (req, res, next) => {
    try {
        const resumeFile = req.file;
        if (!resumeFile) {
            return res.status(400).json({
                message: "Resume PDF is required",
                success: false
            });
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText();
        const resumeText = resumeContent?.text?.slice(0, 15000);

        if (!resumeText) {
            return res.status(400).json({
                success: false,
                message: "Unable to extract text from PDF"
            });
        }
        const { selfDescription, jobDescription } = req.body;
        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Self description and job description are required"
            });
        }

        console.log("========== REQUEST BODY ==========");
        console.log(req.body);

        console.log("========== RESUME ==========");
        console.log(resumeText?.substring(0, 500));
        const interviewReportByAi = await generateInteviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            success: true,
            interviewReport
        });
    } catch (error) {
        // 🔥 Catch Gemini Rate Limits (429) & Busy Service (503) status
        if (error.status === 429 || error?.message?.includes("quota")) {
            return res.status(429).json({
                success: false,
                message: "AI Rate limit reached or quota exceeded. Please try again after a minute."
            });
        }
        if (error.status === 503) {
            return res.status(503).json({
                success: false,
                message: "AI service is busy. Please try again later."
            });
        }

        next(error);
    }
};

/**
 * @description: Controller to get interview report by ID
 */
export const getInterviewReportByIdController = async (req, res) => {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found",
            success: false,
        });
    }

    res.status(200).json({
        message: "Interview report fetched successfully",
        success: true,
        interviewReport
    });
};

/**
 * @description: Controller to get all interview reports of the logged-in user
 */
export const getAllInterviewReportsController = async (req, res) => {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select('-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan');
    res.status(200).json({
        message: "Interview reports fetched successfully",
        success: true,
        interviewReports
    });
};

/**
 * @description Controller to generate resume PDF based on user self description , resume, and job description.
 */
export const generateResumePdfController = async (req, res) => {
    const { interviewReportId } = req.params
    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReportId) {
        return res.status(404).json({
            message: "Interview report not found.",
            success: false,
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}