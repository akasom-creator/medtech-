const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function checkModels() {
    const key = process.env.MEDTECH_GEMINI_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;

    try {
        console.log("Fetching models...");
        const res = await fetch(url);
        const data = await res.json();
        const flashModels = data.models.filter(m => m.name.includes('flash'));
        console.log("Flash Models Found:");
        flashModels.forEach(m => console.log(`- ${m.name}`));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkModels();
