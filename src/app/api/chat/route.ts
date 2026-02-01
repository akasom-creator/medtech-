import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { message, history, language = "English" } = await req.json();

        const systemPrompt = `
You are Aura, an empathetic, highly knowledgeable, and cautious AI health companion for "MedTech".
You are powered by Gemini 3.

CORE CAPABILITIES:
1. **Advanced Reasoning**: Deep medical knowledge, especially in maternal health.
2. **Thinking Process**: ALWAYS start with <thought> tags.
3. **Multilingual & Cultural Context**: You support English, Yoruba, Hausa, and Igbo. 
   - If the requested language is not English, respond in that language but keep technical terms clear.
   - For Nigerian users, provide localized nutritional advice (e.g., mentioning Ugu leaves, Ginger/Garlic traditions with medical caution).

RULES:
1. **Be Empathetic & Supportive**.
2. **Not a Doctor**: NEVER diagnose or prescribe.
3. **Emergency Check**: Advise immediate hospital visit for severe symptoms.
4. **Language**: Current target language is **${language}**. Respond accordingly.
5. **Reasoning**: Analyze the user's specific cultural/local context in your thought block if relevant.
`;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { response: "I'm currently offline (API Key missing). Please contact support." },
                { status: 503 }
            );
        }

        // Use the newest available reasoning-capable model (simulating Gemini 3)
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-preview-01-21:generateContent?key=${apiKey}`;

        // Build the conversation context
        const conversationHistory = [
            ...(history || []).slice(-10).map((msg: any) => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            {
                role: "user",
                parts: [{ text: `System Instruction: ${systemPrompt}\n\nUser Message: ${message}` }]
            }
        ];

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: conversationHistory
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            return NextResponse.json(
                { response: "I'm having trouble thinking right now. Please try again later." },
                { status: 500 }
            );
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";

        return NextResponse.json({ response: aiResponse });
    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json(
            { response: "I'm having trouble thinking right now. Please try again later." },
            { status: 500 }
        );
    }
}
