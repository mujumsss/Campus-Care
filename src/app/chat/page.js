'use client'
import { useState } from 'react';

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    setResponse(data.reply);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Campus-Care AI Assistant</h1>
      <textarea
        className="w-full border p-2"
        rows={3}
        placeholder="Type your concern..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2" onClick={handleSend}>
        Send
      </button>

      {response && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
