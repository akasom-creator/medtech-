const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testLiteAudio() {
    const apiKey = process.env.MEDTECH_GEMINI_KEY;
    if (!apiKey) {
        console.error("No key found.");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Silent chunk
    const base64Audio = "GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwEAAAAAAAWFC0O2AUiBnUu4u4GCAVpApoEDRVVkhYUEWQpAhoEAAAGBfEODZIGEAULygURCh4ECGFOAZwEAAAAAAAWFC0O2AUiBnUu4u4GCAVpApoEDRVVkhYUEWQpAhoEAAAGBfEODZIGEAULygURCh4ECGFOAZwEAAAAAAAWFC0O2AUiBnUu4u4GCAVpApoEDRVVkhYUEWQpAhoEAAA==";

    try {
        console.log("Testing audio on gemini-2.5-flash-lite...");
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

testLiteAudio();
