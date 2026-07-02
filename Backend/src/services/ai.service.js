import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import puppeteer from 'puppeteer';
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// ==========================================
// 1. ZOD SCHEMAS
// ==========================================

const interviewReportSchema = z.object({
    matchScore: z.number().int().min(0).max(100),
    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ).min(7),
    behaviouralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ).min(4),
    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ).min(1),
    preparationPlan: z.array(
        z.object({
            day: z.number().int(),
            focus: z.string(),
            tasks: z.array(z.string()).min(3)
        })
    ).min(14),
    title: z.string(),
});

const resumePdfSchema = z.object({
    html: z.string()
});

// ==========================================
// 2. HELPER UTILITIES
// ==========================================

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithRetry(payload, retries = 3) {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            return await ai.models.generateContent(payload);
        } catch (error) {
            lastError = error;
            if (
                (error?.status === 503 || error?.message?.includes("high demand")) &&
                i < retries - 1
            ) {
                console.log(`Gemini busy. Retrying (${i + 1}/${retries})...`);
                await sleep(2000);
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

export const generateInteviewReport = async ({
    resume,
    selfDescription,
    jobDescription
}) => {
    const prompt = `
You are an expert technical interviewer and career coach.
Analyze the candidate profile and return ONLY valid JSON.

CANDIDATE RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

STRICT REQUIREMENTS:
1. matchScore must be between 0 and 100.
2. Generate at least:
   - 8 technicalQuestions
   - 5 behaviouralQuestions
   - 1 skillGap
   - 14 preparationPlan days
3. technicalQuestions format:
{ "question": "", "intention": "", "answer": "" }
4. behaviouralQuestions format:
{ "question": "", "intention": "", "answer": "" }
5. skillGaps format:
{ "skill": "", "severity": "low" }
Severity can only be: low, medium, high
6. preparationPlan format:
{ "day": 1, "focus": "", "tasks": ["", "", ""] }
7. Day numbers must be sequential from 1 to 14.
8. title is required.
9. Return ONLY JSON. No markdown. No explanations. No code block.
`;

    try {
        const response = await generateWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const responseText = response?.text?.trim() || "{}";
        let parsed;

        try {
            parsed = JSON.parse(responseText);
        } catch (error) {
            console.error("Invalid JSON:", responseText);
            throw new Error("AI returned invalid JSON");
        }

        const validated = interviewReportSchema.safeParse(parsed);
        if (!validated.success) {
            console.error(JSON.stringify(validated.error.format(), null, 2));
            throw new Error("AI returned invalid schema");
        }

        return validated.data;

    } catch (error) {
        console.error(error);
        if (error?.status === 503) {
            throw new Error("AI service is busy. Please try again after a few seconds.");
        }
        throw error;
    }
};

const generatePdfFromHtml = async (htmlContent) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
            top: '20px',
            bottom: '20px',
            left: '20px',
            right: '20px'
        }
    })

    await browser.close()

    return pdfBuffer
}

export const generateResumePdf = async ({ resume, selfDescription, jobDescription }) => {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate a resume for a candidate with the following details
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                        
                        The response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formated and structured, making it ease to read and visible appealing.
                        The content of resume should be not sound like it's generated by AI and should be close as possible to a real human-written resume.
                        You can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable byy ATS systems without losing important information.
                        The resume should not be so lengthy, it should idealy be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}