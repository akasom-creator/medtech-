import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { patientName, severity, reason, transcription } = await req.json();

        // SIMULATED ESCALATION LOGIC
        // In a real production app, this would trigger:
        // 1. A WhatsApp/SMS alert to the on-call doctor via Twilio
        // 2. An entry in the 'high-priority' table in Supabase
        // 3. A WebSocket push to the Admin Dashboard

        console.log(`🚨 CRITICAL ESCALATION TRIGGERED`);
        console.log(`👤 Patient: ${patientName}`);
        console.log(`🔴 Severity: ${severity}`);
        console.log(`📝 Reason: ${reason}`);
        console.log(`🎙️ Raw Context: "${transcription?.substring(0, 100)}..."`);

        // Simulate a slight delay for "processing" the alert
        await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json({
            success: true,
            message: "Clinical team notified. A specialist has been alerted to review this case immediately.",
            escalationId: `REC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Escalation Error:", error);
        return NextResponse.json({ success: false, error: "Failed to process escalation" }, { status: 500 });
    }
}
