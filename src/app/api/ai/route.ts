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

export async function POST(req: Request) {
    try {
        const { type, symptoms, week, vitals } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        let prompt = "";
        if (type === 'triage') {
            prompt = `${systemPromptTriage}\n\nPatient symptoms: "${symptoms}"`;
        } else {
            prompt = `${systemPromptInsight}\n\nPatient is at Week ${week}. ${vitals ? `Vitals: BP ${vitals.bp}, Weight ${vitals.weight}` : ""}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

        return NextResponse.json({ text: aiText });
    } catch (error) {
        console.error("Internal AI Error:", error);
        return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 });
    }
}
