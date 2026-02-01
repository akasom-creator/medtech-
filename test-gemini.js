const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" }); // Placeholder init

    /*
     * Note: The Node SDK doesn't expose listModels directly on the main class easily in all versions,
     * but usually we just try a standard model.
     * Let's try to query a known usually-safe model "gemini-pro" first to check connection,
     * or just print the key presence.
     */

    console.log("Checking API access...");
    if (!process.env.GEMINI_API_KEY) {
        console.error("No API Key found");
        return;
    }

    console.log("API Key present. Attempting to use 'gemini-pro' via simple generate...");
    // We'll just try to hit 'gemini-pro' directly with a simple prompt.
    // If it fails, we know it's the model list issue.

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("Success with 'gemini-pro':", result.response.text());
    } catch (e) {
        console.log("Failed 'gemini-pro':", e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success with 'gemini-1.5-flash':", result.response.text());
    } catch (e) {
        console.log("Failed 'gemini-1.5-flash':", e.message);
    }
}

listModels();
