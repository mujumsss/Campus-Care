// /app/admin/faq/ai/page.js
"use client";

import { useState } from "react";

export default function AiPage() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const handleAsk = async () => {
        const res = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: input })
        });
        const data = await res.json();
        setResponse(data.answer);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Ask AI (Gemini)</h2>
            <textarea
                rows="4"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question here..."
                style={{ width: "100%", marginBottom: "1rem" }}
            />
            <button onClick={handleAsk}>Ask</button>
            <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
                <strong>Response:</strong>
                <p>{response}</p>
            </div>
        </div>
    );
}
