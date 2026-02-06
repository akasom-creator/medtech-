const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testLargeLiteAudio() {
    const apiKey = process.env.MEDTECH_GEMINI_KEY;
    if (!apiKey) {
        console.error("No key found.");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Create a larger dummy payload (about 100KB)
    const base64Audio = "GkXfo59" + "A".repeat(100000);

    try {
        console.log("Testing LARGE audio (100KB) on gemini-2.5-flash-lite...");
        const result = await model.generateContent([
            "Transcribe this.",
            {
                inlineData: {
                    mimeType: "audio/webm",
                    data: base64Audio
                }
            }
        ]);
        console.log("SUCCESS: ", result.response.text());
    } catch (e) {
        console.error("FAILED: ", e.message);
    }
}

testLargeLiteAudio();
