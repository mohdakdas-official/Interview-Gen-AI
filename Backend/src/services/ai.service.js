import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

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
    ).min(14)
});

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

async function generateWithRetry(payload, retries = 3) {

    let lastError;

    for (let i = 0; i < retries; i++) {

        try {
            return await ai.models.generateContent(payload);
        } catch (error) {

            lastError = error;

            if (
                (error?.status === 503 ||
                    error?.message?.includes("high demand")) &&
                i < retries - 1
            ) {

                console.log(
                    `Gemini busy. Retrying (${i + 1}/${retries})...`
                );

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

{
  "question": "",
  "intention": "",
  "answer": ""
}

4. behaviouralQuestions format:

{
  "question": "",
  "intention": "",
  "answer": ""
}

5. skillGaps format:

{
  "skill": "",
  "severity": "low"
}

Severity can only be:
low, medium, high

6. preparationPlan format:

{
  "day": 1,
  "focus": "",
  "tasks": [
    "",
    "",
    ""
  ]
}

7. Day numbers must be sequential from 1 to 14.

8. Return ONLY JSON.
No markdown.
No explanations.
No code block.
`;

    try {

        const response = await generateWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const responseText =
            response?.text?.trim() || "{}";

        let parsed;

        try {
            parsed = JSON.parse(responseText);
        } catch (error) {

            console.error("Invalid JSON:");
            console.error(responseText);

            throw new Error(
                "AI returned invalid JSON"
            );
        }

        const validated =
            interviewReportSchema.safeParse(parsed);

        if (!validated.success) {

            console.error(
                JSON.stringify(
                    validated.error.format(),
                    null,
                    2
                )
            );

            throw new Error(
                "AI returned invalid schema"
            );
        }

        return validated.data;

    } catch (error) {

        console.error(error);

        if (error?.status === 503) {
            throw new Error(
                "AI service is busy. Please try again after a few seconds."
            );
        }

        throw error;
    }
};