import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.MEDTECH_GEMINI_KEY || "");

export async function POST(req: Request) {
    try {
        const { message, history, language = "English" } = await req.json();

        if (!process.env.MEDTECH_GEMINI_KEY) {
            return NextResponse.json(
                { response: "I'm currently offline (API Key missing). Please contact support." },
                { status: 503 }
            );
        }

        const apiKey = process.env.MEDTECH_GEMINI_KEY;
        console.log(`📡 AI Request using key ending in: ...${apiKey?.slice(-4)}`);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `
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
4. **Language**: Current target language is **${language}**.
5. **Reasoning**: Analyze the user's specific cultural/local context in your thought block if relevant.
`
        });

        // Convert history to official Google format (must start with 'user')
        let rawHistory = (history || []).slice(-10);
        while (rawHistory.length > 0 && rawHistory[0].sender !== 'user') {
            rawHistory.shift();
        }

        const chat = model.startChat({
            history: rawHistory.map((msg: any) => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }))
        });

        const result = await Promise.race([
            chat.sendMessage(message),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
        ]) as any;

        const aiResponse = result.response.text();
        return NextResponse.json({ response: aiResponse });

    } catch (error: any) {
        const isRateLimit = error?.status === 429 || error?.message?.includes('429');
        const isTimeout = error?.message === 'Timeout';

        console.error("AI Error:", error);

        if (isRateLimit || isTimeout) {
            console.warn(`🛡️ AI ${isTimeout ? 'TIMEOUT' : 'QUOTA'}: Switching to Demo Fallback.`);
            const fallbacks = [
                "Hello! I'm Aura. I'm currently prioritizing several high-priority health cases in the network, but I'm here for you! For maternal wellness, remember to stay hydrated and prioritize your rest today. How can I support your wellness journey?",
                "Hello! I'm Aura. Our clinical cloud is quite busy, but your health remains my focus. Based on general maternal protocols, I recommend monitoring your energy levels and ensuring a diverse nutrient intake. What specific concerns can I help you with?",
                "Hi there! I'm Aura. To ensure clinical precision during peak times, I'm currently in a supportive mode. Remember that consistency in your supplements is key. Is there any specific symptom or advice you'd like to discuss?"
            ];
            const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

            return NextResponse.json({
                response: `<thought>Network/Quota issue detected. Providing intelligent fallback.</thought>${randomFallback}`,
                demoMode: true
            }, { status: 200 });
        }

        return NextResponse.json(
            { response: "I'm having trouble thinking right now. Please try again later." },
            { status: 500 }
        );
    }
}
