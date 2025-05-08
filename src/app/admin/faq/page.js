"use client";

import { useState, useEffect } from "react";
import { DisplayCard } from "@/components/cards/faq/display";
import Link from "next/link";
import classes from './page.module.css';
import { usePathname } from "next/navigation";

export default function FaqPage() {
    const [faqs, setFaqs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [aiQuestion, setAiQuestion] = useState("");
    const [aiAnswer, setAiAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const currentPath = usePathname();

    useEffect(() => {
        async function fetchFaqs() {
            const res = await fetch('/api/faq/get-faq'); 
            const data = await res.json();
            setFaqs(data);
        }
        fetchFaqs();
    }, []);

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentPath - usePathname();

    const handleExpand = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const handleDelete = (id) => {
        setFaqs(prev => prev.filter(f => f.id !== id));
    };

    const askAI = async () => {
        if (!aiQuestion.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiQuestion }),
            });
            const data = await res.json();
            setAiAnswer(data.response || "No response received.");
        } catch (err) {
            console.error(err);
            setAiAnswer("Error getting AI response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={classes.container}>
            <Link href="/admin/faq/create" className={classes.addFaq}>
                Add FAQ
            </Link>

            <div className={classes.topBar}>
                <input 
                    type="text" 
                    placeholder="Search FAQ" 
                    name="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={classes.searchInput}
                />
            </div>

            <div className={classes.aiSection}>
                <h3>Can't find what you're looking for? Ask AI 👇</h3>
                <textarea
                    className={classes.searchInput}
                    rows={3}
                    placeholder="Ask the AI about anything..."
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                />
                <button
                    onClick={askAI}
                    className={classes.askAiButton}
                    disabled={loading}
                >
                    {loading ? "Thinking..." : "Ask Gemini"}
                </button>

                {aiAnswer && (
                    <div className={classes.aiResponse}>
                        <strong>AI Response:</strong>
                        <p>{aiAnswer}</p>
                    </div>
                )}
            </div>

            {filteredFaqs.length === 0 ? (
                <p>No FAQs match your search.</p>
            ) : (
                filteredFaqs.map((faq) => (
                    <DisplayCard 
                        id={faq.id}
                        key={faq.id} 
                        question={faq.question} 
                        answer={faq.answer}
                        isExpanded={expandedId === faq.id}
                        onToggle={() => handleExpand(faq.id)}
                        path={currentPath}
                        onDelete={handleDelete} 
                    />
                ))
            )}
        </div>
    );
}
