export async function analyzeSymptoms(symptoms: string) {
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'triage', symptoms })
        });

        if (!response.ok) throw new Error('AI Route Failed');

        const { text } = await response.json();

        // Parsing the suggestions from the response text
        const parts = text.split("SUGGESTIONS:");
        const cleanedText = parts[0].trim();
        const suggestionsPart = parts[1];

        const suggestions = suggestionsPart
            ? suggestionsPart.split(",").map((s: string) => s.trim())
            : ["Pre-natal", "Nutrition"]; // Fallback suggestions

        return { text: cleanedText, suggestions };
    } catch (error) {
        console.error("Triage AI Error:", error);
        return {
            text: "AI analysis is currently unavailable. Please consult a doctor immediately for urgent symptoms.",
            suggestions: ["Nutrition", "Pre-natal"]
        };
    }
}

export async function getMaternalInsights(week: number, vitals?: { bp: string, weight: string }) {
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'insight', week, vitals })
        });

        if (!response.ok) throw new Error('AI Route Failed');

        const { text } = await response.json();
        return text;
    } catch (error) {
        console.error("Insight AI Error:", error);
        return "Ensure you're drinking enough water and tracking your baby's movements daily.";
    }
}
