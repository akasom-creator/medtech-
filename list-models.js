// Test script to list available Gemini models
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function listAvailableModels() {
    const apiKey = process.env.MEDTECH_GEMINI_KEY;
    if (!apiKey) {
        console.error("Error: MEDTECH_GEMINI_KEY is not defined in .env.local");
        process.exit(1);
    }

    console.log('Fetching available models...\n');

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
        );

        if (!response.ok) {
            const error = await response.json();
            console.error('Error:', JSON.stringify(error, null, 2));
            return;
        }

        const data = await response.json();

        console.log('Available models:');
        console.log('================\n');

        if (data.models && data.models.length > 0) {
            data.models.forEach(model => {
                console.log(`Model: ${model.name}`);
                console.log(`Display Name: ${model.displayName}`);
                console.log(`Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
                console.log('---');
            });
        } else {
            console.log('No models found');
        }
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

listAvailableModels();
