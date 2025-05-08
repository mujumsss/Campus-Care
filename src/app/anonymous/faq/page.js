"use client";

import { useState, useEffect, Fragment } from "react"; // Added Fragment
import { DisplayCard } from "@/components/cards/faq/display";
import { usePathname } from 'next/navigation'; // Import usePathname
import Link from "next/link";
import classes from './page.module.css';

export default function FaqPage() {
    const [faqs, setFaqs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    // --- AI State and handlers removed ---

    const currentPath = usePathname(); // Get the current path

    useEffect(() => {
        async function fetchFaqs() {
            // Consider adding error handling for this fetch
            const res = await fetch('/api/faq/get-faq');
            const data = await res.json();
            setFaqs(data || []); // Ensure faqs is always an array
        }
        fetchFaqs();
    }, []);

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExpand = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        <div className={classes.container}>
            <div className={classes.topBar}>
                <input
                    type="text"
                    placeholder="Search FAQ"
                    name="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={classes.searchInput}
                />
                {/* Keep the link as a fallback or remove if AI is fully integrated here */}
                {/* <Link href="/anonymous/faq/ai" className={classes.askAiButton}>
                    Ask AI
                </Link> */}
            </div>

            {/* --- AI Interaction Section Removed --- */}

            <h2>Frequently Asked Questions</h2>
            {filteredFaqs.length === 0 && searchTerm ? (
                 <p>No FAQs match your search term "{searchTerm}".</p>
             ) : filteredFaqs.length === 0 && !searchTerm ? (
                 <p>Loading FAQs or no FAQs available.</p> // Handle initial load or empty state
             ) : (
                 filteredFaqs.map((faq) => (
                     <DisplayCard
                         key={faq.id} // Ensure faq.id is unique and stable
                         question={faq.question}
                         answer={faq.answer}
                         isExpanded={expandedId === faq.id}
                         path={currentPath} // Pass the path prop
                         onToggle={() => handleExpand(faq.id)}
                     />
                 ))
             )}
        </div>
    );
}