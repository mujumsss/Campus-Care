"use client";

import { useState } from 'react';
import classes from './Chatbot.module.css'; // Create this CSS module

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false); // State to control chat window visibility
    const [aiQuestion, setAiQuestion] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [aiError, setAiError] = useState(null);

    const handleAiSubmit = async (event) => {
        event.preventDefault();
        if (!aiQuestion.trim()) return;

        setIsAiLoading(true);
        setAiError(null);
        const currentQuestion = aiQuestion;
        setAiQuestion('');

        const newUserMessage = { role: 'user', text: currentQuestion };
        const updatedHistory = [...conversationHistory, newUserMessage];
        setConversationHistory(updatedHistory);

        try {
            // Use the same API endpoint as before
            const res = await fetch('/api/faq/ask-gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: updatedHistory, question: currentQuestion }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setAiError('Sorry, the assistant is currently unavailable.');
                console.error("AI Fetch Error:", errorData.error || `API error: ${res.statusText}`);
                setConversationHistory(prev => prev.slice(0, -1));
                return;
            }

            const data = await res.json();
            const newAiMessage = { role: 'model', text: data.answer };
            setConversationHistory(prev => [...prev, newAiMessage]);

        } catch (err) {
            console.error("AI Fetch/Processing Error:", err);
            setAiError('Sorry, the assistant is currently unavailable.');
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className={classes.chatbotContainer}>
            {isOpen && (
                <div className={classes.chatWindow}>
                    <div className={classes.chatHeader}>
                        <span>CampusCare AI</span>
                        <button onClick={() => setIsOpen(false)} className={classes.closeButton}>X</button>
                    </div>
                    <div className={classes.chatHistory}>
                        {conversationHistory.map((message, index) => (
                            <div key={index} className={`${classes.chatMessage} ${classes[message.role]}`}>
                               <p><strong>{message.role === 'user' ? 'You' : 'AI'}:</strong> {message.text}</p>
                            </div>
                        ))}
                        {isAiLoading && <div className={`${classes.chatMessage} ${classes.model}`}><em>AI is thinking...</em></div>}
                        {aiError && <div className={`${classes.chatMessage} ${classes.error}`}>{aiError}</div>}
                    </div>
                    <form onSubmit={handleAiSubmit} className={classes.aiForm}>
                        <textarea value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} placeholder="Ask..." rows={2} className={classes.aiTextarea} disabled={isAiLoading} />
                        <button type="submit" disabled={isAiLoading || !aiQuestion.trim()} className={classes.aiSubmitButton}>{isAiLoading ? '...' : 'Send'}</button>
                    </form>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className={classes.chatToggleButton}>
                {isOpen ? 'Close Chat' : 'Ask AI'} {/* Or use an icon */}
            </button>
        </div>
    );
}