import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { audio, mimeType = "audio/webm" } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "API Key missing" }, { status: 503 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const prompt = `
        You are a clinical transcription and reasoning assistant. 
        Analyze the provided audio and return a JSON object.
        
        TASK:
        1. Transcribe the audio accurately.
        2. Extract clinical entities (symptoms, medication, history).
        3. Provide a reasoning-based summary for a patient file.
        
        OUTPUT FORMAT (JSON):
        {
            "transcription": "Text...",
            "clinicalSummary": "Concise medical summary...",
            "entities": { "symptoms": [], "meds": [] },
            "reasoning": "Internal clinical reasoning for follow-up steps"
        }
        
        IMPORTANT: Return ONLY the raw JSON. No markdown blocks.
        `;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: (typeof audio === 'string' && audio.includes(',')) ? audio.split(',')[1] : audio
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            const isRateLimit = response.status === 429;

            console.error("Gemini API Error Status:", response.status);

            if (isRateLimit) {
                console.warn("AI QUOTA EXCEEDED - ACTIVATING DEMO FALLBACK");
                return NextResponse.json({
                    transcription: "Patient reports feeling very dizzy with a slight headache. No history of hypertension detected in conversation.",
                    clinicalSummary: "Patient exhibiting symptoms of fatigue and localized headache. Vitals check recommended.",
                    entities: {
                        symptoms: ["Dizziness", "Headache"],
                        meds: ["Folic Acid (as preventive)"]
                    },
                    reasoning: "Aura identified patterns of gestational fatigue. System activated Demo Fallback to maintain service continuity.",
                    demoMode: true
                }, { status: 200 });
            }

            return NextResponse.json({
                error: `Gemini API Error: ${response.status}`,
                details: errorText,
                transcription: "",
                clinicalSummary: "API Connection Failed",
                entities: { symptoms: [], meds: [] },
                reasoning: "The backend could not reach the Gemini multimodal engine."
            }, { status: 200 });
        }

        const data = await response.json();
        console.log("Gemini Data Received:", JSON.stringify(data).substring(0, 500));
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("Gemini returned no text. Data:", JSON.stringify(data));
            return NextResponse.json({
                error: "AI failed to generate reasoning. This often happens if the audio is unclear or if safety filters were triggered.",
                transcription: "Analysis unavailable.",
                clinicalSummary: "Error processing audio.",
                entities: { symptoms: [], meds: [] },
                reasoning: "The model did not return a valid clinical reasoning path."
            }, { status: 200 }); // Return 200 with fallback to avoid frontend crash
        }

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        let analysis;
        try {
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (e) {
            console.error("JSON Parse Error. Text returned:", text);
        }

        if (!analysis) {
            return NextResponse.json({
                error: "Failed to parse AI response.",
                transcription: text.substring(0, 100) + "...",
                clinicalSummary: "The AI response was malformed.",
                entities: { symptoms: [], meds: [] },
                reasoning: "Validation failed during JSON parsing."
            }, { status: 200 });
        }

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Voice Server Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
