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

/**
 * Optimized Puppeteer PDF Generator
 */
const generatePdfFromHtml = async (htmlContent) => {
    // Linux/Docker environments ke crash issues se bachne ke liye args dale hain
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    try {
        const page = await browser.newPage();

        // Wait until network and DOM elements are completely ready
        await page.setContent(htmlContent, {
            waitUntil: ["networkidle0", "domcontentloaded"]
        });

        // Makes sure that standard screen media CSS styles apply to the print view
        await page.emulateMediaType('screen');

        // Generate high-quality A4 PDF with background colors turned on
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true, // Crucial: Iske bina colors aur modern styling print nahi hoti
            margin: {
                top: "15mm",
                bottom: "15mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;
    } catch (puppeteerError) {
        console.error("Puppeteer Rendering Error:", puppeteerError);
        throw new Error("Failed to render HTML into a valid PDF buffer.");
    } finally {
        // try...finally ensures browser crashes don't cause server memory leaks
        await browser.close();
    }
};

// ==========================================
// 3. CORE EXPORTS
// ==========================================

/**
 * Generate Interview Report (Working fine as per feedback)
 */
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

/**
 * Fixed & Stable Resume PDF Generator
 */
export const generateResumePdf = async ({ resume, selfDescription, jobDescription }) => {
    // Clean text prompt to completely avoid template literal/interpolation parsing issues
    const prompt = `
Generate a professional resume tailored for the given job description.

Candidate Resume Data: ${resume}
Self Description: ${selfDescription}
Target Job Description: ${jobDescription}

Requirements:
1. Populate the resume contents inside the required JSON "html" root field.
2. Use professional typography (Arial, Helvetica), clean layouts, and nice color accents using standard inline CSS or raw style blocks.
3. Make sure it sounds natural, human-written, and strictly aligned with the target job description.
`;

    try {
        const response = await generateWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are a precise data processing agent. Output the requested resume structured perfectly inside the provided HTML-string schema format.",
                responseMimeType: "application/json",
            }
        });

        const rawText = response?.text?.trim() || "{}";
        const jsonContent = JSON.parse(rawText);

        if (!jsonContent || !jsonContent.html) {
            throw new Error("AI generated the layout, but the 'html' string parameter was empty.");
        }

        // Generate the PDF from the clean, extracted HTML string
        const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
        return pdfBuffer;

    } catch (error) {
        console.error("Error in generateResumePdf workflow:", error);
        throw error;
    }
};