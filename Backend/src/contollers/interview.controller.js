import * as pdfParse from 'pdf-parse';
import { generateInteviewReport } from '../services/ai.service.js';
import { interviewReportModel } from '../models/interviewReport.model.js';

export const generateInterViewController = async (req, res, next) => {
    try {

        const resumeFile = req.file;
        if (!resumeFile) {
            return res.status(400).json({
                message: "Resume PDF is required",
                success: false
            })
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText()
        const resumeText = resumeContent?.text?.slice(0, 30000);

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
        })

        return res.status(201).json({
            message: "Interview report generated successfully",
            success: true,
            interviewReport
        })
    } catch (error) {
        if (error.status === 503) {
            return res.status(503).json({
                success: false,
                message: "AI service is busy. Please try again later."
            });
        }

        next(error);
    }
}