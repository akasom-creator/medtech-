import { NextResponse } from "next/server";

const systemPromptTriage = `
You are a medical triage assistant for a maternal health platform called "MedTech". 
Your goal is to analyze symptoms reported by pregnant women and provide a professional, calm, and concise analysis.

RULES:
1. Potential level of urgency (Low, Moderate, High).
2. 2-3 immediate next steps.
3. Suggest labels for relevant health topics from this list: [Nutrition, Pre-natal, Post-natal, Mental Health, Newborn Care]. 

FORMAT:
Provide your analysis first. 
At the very end of your response, you MUST include a line that starts with "SUGGESTIONS:" followed by a comma-separated list of the 2-3 labels you chose.
Example: ... SUGGESTIONS: Nutrition, Pre-natal
`;

const systemPromptInsight = `
You are a maternal health specialist giving non-diagnostic health insights for MedTech. 
Your goal is to provide encouraging, actionable tips based on the user's pregnancy week and vitals.

RULES:
1. Provide 3 short health tips.
2. Tone: Premium, empowering, professional.
3. Not a diagnosis.
`;

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { type, symptoms, week, vitals } = await req.json();

        if (!process.env.MEDTECH_GEMINI_KEY) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        const apiKey = process.env.MEDTECH_GEMINI_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let prompt = "";
        if (type === 'triage') {
            prompt = `${systemPromptTriage}\n\nPatient symptoms: "${symptoms}"`;
        } else {
            prompt = `${systemPromptInsight}\n\nPatient is at Week ${week}. ${vitals ? `Vitals: BP ${vitals.bp}, Weight ${vitals.weight}` : ""}`;
        }

        const result = await Promise.race([
            model.generateContent(prompt),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
        ]) as any;

        const aiText = result.response.text() || "No response generated.";

        return NextResponse.json({ text: aiText });
    } catch (error: any) {
        console.error("Internal AI Error:", error);
        const isRateLimit = error?.status === 429 || error?.message?.includes('429');

        // AUTO-FALLBACK ON NETWORK/QUOTA ERROR
        return NextResponse.json({
            text: "<thought>Connection issues detected.</thought>Hello! I'm Aura. I'm having a bit of trouble connecting to my main cloud right now, but I want to remind you that your wellness is key. Ensure you keep your fluids up and monitor your movements today. Please consult your physician for any clinical concerns.",
            demoMode: true
        }, { status: 200 });
    }
}
