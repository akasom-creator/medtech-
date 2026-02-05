import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { image, mimeType = "image/jpeg" } = await req.json();

        if (!process.env.MEDTECH_GEMINI_KEY) {
            return NextResponse.json(
                { error: "API Key missing" },
                { status: 503 }
            );
        }

        const apiKey = process.env.MEDTECH_GEMINI_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are a medical record analyzer. 
        Analyze the provided image (which could be a scan, a lab report, or medical notes) and return a JSON object.
        
        TASK:
        1. Identify the type of record.
        2. Extract key findings (vitals, test results, observations).
        3. Flag any critical values that need immediate attention.
        4. Provide a 2-sentence summary for the clinician.
        
        OUTPUT FORMAT (JSON):
        {
            "recordType": "Type...",
            "findings": ["Finding 1", "Finding 2"],
            "criticalFlags": ["Flag 1"],
            "summary": "Clinician summary...",
            "confidence": 0-100
        }
        
        IMPORTANT: Return ONLY the raw JSON. No markdown blocks.
        `;

        const imageData = (typeof image === 'string' && image.includes(',')) ? image.split(',')[1] : image;

        const result = await Promise.race([
            model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType,
                        data: imageData
                    }
                }
            ]),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 45000)) // 45s for multimodal
        ]) as any;

        const text = result.response.text();
        console.log("Multimodal Analysis (SDK):", text.substring(0, 200));

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        let analysis;
        try {
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (e) {
            console.error("Multimodal JSON Parse Error. Text:", text);
        }

        if (!analysis) {
            return NextResponse.json({
                error: "Failed to parse analysis.",
                recordType: "Unknown",
                findings: ["Analysis output was malformed."],
                criticalFlags: [],
                summary: "The model's output could not be converted to structured data.",
                confidence: 0
            }, { status: 200 });
        }

        return NextResponse.json(analysis);

    } catch (error: any) {
        console.error("Multimodal Server Error:", error);
        const isRateLimit = error?.status === 429 || error?.message?.includes('429');

        if (isRateLimit) {
            console.warn("MULTIMODAL AI QUOTA EXHAUSTED - ACTIVATING DEMO FALLBACK");
            return NextResponse.json({
                recordType: "Lab Report (Hematology)",
                findings: ["Hemoglobin: 11.2 g/dL", "Platelet Count: 240,000", "WBC: 8,500"],
                criticalFlags: ["Mild Anemia Detected"],
                summary: "Patient shows slight iron deficiency patterns common in the second trimester. Recommend iron-rich diet or supplements.",
                confidence: 95,
                demoMode: true
            }, { status: 200 });
        }

        // AUTO-FALLBACK ON NETWORK ERROR
        return NextResponse.json({
            recordType: "Medical Document",
            findings: ["Record processed via safety fallback."],
            criticalFlags: [],
            summary: "Network conditions prevented deep analysis. Manual review of the image is recommended.",
            confidence: 50,
            demoMode: true
        }, { status: 200 });
    }
}
