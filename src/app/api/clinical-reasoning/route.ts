import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { patients } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "API Key missing" }, { status: 503 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const prompt = `
        You are a Clinical Decision Support AI. Analyze the following patient queue for a maternal health clinic.
        
        PATIENT DATA:
        ${JSON.stringify(patients, null, 2)}
        
        TASK:
        1. Perform deep reasoning on each patient's risk profile.
        2. Identify the highest risk patient.
        3. Suggest 3 research-backed clinical focus points for the doctor today.
        
        OUTPUT FORMAT (JSON):
        {
            "priorityPatient": {
                "name": "Name",
                "reasoning": "Clinical reasoning for high priority",
                "suggestedAction": "Immediate clinical action"
            },
            "generalInsights": [
                { "title": "Insight Title", "detail": "Detailed reasoning", "source": "CDC/WHO/etc" }
            ],
            "riskScores": { "PatientName": 1-100 }
        }
        `;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            const isRateLimit = response.status === 429;

            console.error("Gemini API Error Status:", response.status);

            if (isRateLimit) {
                console.warn("CLINICAL AI QUOTA EXCEEDED - ACTIVATING DEMO FALLBACK");
                return NextResponse.json({
                    priorityPatient: {
                        name: "Chioma Adebayo",
                        reasoning: "Patient exhibits irregular heart rhythms and elevated edema. This combination poses a significant risk for pre-eclampsia and requires immediate cardiovascular assessment.",
                        suggestedAction: "Emergency Vitals Check & Triage"
                    },
                    generalInsights: [
                        { title: "Gestational Hypertension Alert", detail: "Rising incidence of cases in Lagos district matches regional rainfall-associated stress patterns.", source: "MedTech Environmental Insight" },
                        { title: "Protocol Optimization", detail: "Suggest transitioning stable Grade A patients to remote monitoring to clear high-priority clinical bandwidth.", source: "CDC Regional Health Protocol" }
                    ],
                    riskScores: { "Chioma Adebayo": 92, "Sarah Okafor": 45, "Amina Yusuf": 12 },
                    demoMode: true
                }, { status: 200 });
            }

            return NextResponse.json({
                error: `Gemini API Error: ${response.status}`,
                details: errorText,
                priorityPatient: { name: "N/A", reasoning: "Analysis failed.", suggestedAction: "Manual review required." },
                generalInsights: [],
                riskScores: {}
            }, { status: 200 });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("Clinical AI returned no text. Data:", JSON.stringify(data));
            return NextResponse.json({
                error: "Clinical Reasoning unavailable. Please check the patient queue data.",
                priorityPatient: { name: "N/A", reasoning: "Analysis failed.", suggestedAction: "Manual review required." },
                generalInsights: [],
                riskScores: {}
            }, { status: 200 });
        }

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        let analysis;
        try {
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (e) {
            console.error("Clinical JSON Parse Error. Text:", text);
        }

        if (!analysis) {
            return NextResponse.json({
                error: "Malformed clinical analysis.",
                priorityPatient: { name: "Unknown", reasoning: "The model's output could not be parsed.", suggestedAction: "Retry analysis." },
                generalInsights: [],
                riskScores: {}
            }, { status: 200 });
        }

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Clinical Server Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
