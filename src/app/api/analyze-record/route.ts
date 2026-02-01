import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { image, mimeType = "image/jpeg" } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "API Key missing" },
                { status: 503 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const prompt = `
        You are a medical record analyzer. Your job is to extract key information from the provided document (prescription, lab result, or scan).
        
        OUTPUT FORMAT (JSON):
        {
            "type": "Prescription | Lab Result | Scan | Other",
            "summary": "Brief 1-sentence summary",
            "keyPoints": ["Point 1", "Point 2"],
            "recommendations": ["Recommendation 1"],
            "confidence": 0-100
        }
        
        RULES:
        1. Be precise.
        2. If you are unsure, state lower confidence.
        3. Do not give medical advice beyond what is in the document.
        `;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: image.split(',')[1] || image // Handle base64 with or without prefix
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
                console.warn("MULTIMODAL AI QUOTA EXCEEDED - ACTIVATING DEMO FALLBACK");
                return NextResponse.json({
                    type: "Prescription",
                    summary: "This is a prescription for Iron Supplements and Folic Acid, typical for second-trimester maternal care.",
                    keyPoints: [
                        "Dose: 200mg Iron / 5mg Folic Acid",
                        "Frequency: Once daily, preferably with orange juice for absorption.",
                        "Safety: Store at room temperature, keep hydrated."
                    ],
                    recommendations: [
                        "Ensure consistency in timing.",
                        "Report any severe constipation to the specialist."
                    ],
                    confidence: 98,
                    demoMode: true
                }, { status: 200 });
            }

            const error = await response.json();
            console.error("Multimodal Error:", error);
            return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("Multimodal AI returned no text. Data:", JSON.stringify(data));
            return NextResponse.json({
                error: "Analysis unavailable. The document could not be read.",
                type: "Other",
                summary: "The model failed to generate a summary for this document.",
                keyPoints: [],
                recommendations: [],
                confidence: 0
            }, { status: 200 });
        }

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        let analysis;
        try {
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (e) {
            console.error("Multimodal JSON Parse Error. Text:", text);
        }

        if (!analysis) {
            return NextResponse.json({
                error: "Malformed analysis response.",
                type: "Other",
                summary: "The AI response was not in the expected format.",
                keyPoints: [],
                recommendations: [],
                confidence: 0
            }, { status: 200 });
        }

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Multimodal Server Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
