import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Assuming your db connection is setup in src/lib/db.js

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash"; // stable version

export async function POST(request) {
    if (!API_KEY) {
        console.error("Gemini API Key not configured.");
        return NextResponse.json({ error: "Internal Server Error: AI service not configured." }, { status: 500 });
    }

    try {
        const body = await request.json();
        // Expect history array and the latest question
        const { history, question } = body;

        if (!question || typeof question !== 'string' || question.trim().length === 0) {
            return NextResponse.json({ error: "Question is required and must be a non-empty string." }, { status: 400 });
        }

        // --- Fetch relevant internal data ---
        let internalContext = "";
        try {
            // Basic keyword extraction (split question into words)
            const keywords = question.toLowerCase().split(/\s+/).filter(word => word.length > 2); // Ignore short words

            if (keywords.length > 0) {
                // Use parameterized queries for security
                const faqQuery = `
                    SELECT question, answer FROM faq
                    WHERE ${keywords.map(() => `(LOWER(question) LIKE ? OR LOWER(answer) LIKE ?)`).join(' OR ')}
                    LIMIT 3;
                `;
                const faqParams = keywords.flatMap(kw => [`%${kw}%`, `%${kw}%`]);
                console.log("Executing FAQ query..."); // Add log
                const faqs = db.prepare(faqQuery).all(...faqParams);
                if (faqs.length > 0) {
                    internalContext += "Relevant FAQs found:\n" + faqs.map(f => `- Q: ${f.question}\n  A: ${f.answer}`).join('\n') + "\n\n";
                }

                const newsQuery = `
                    SELECT title, content FROM news
                    WHERE ${keywords.map(() => `(LOWER(title) LIKE ? OR LOWER(content) LIKE ?)`).join(' OR ')}
                    ORDER BY created_at DESC LIMIT 3;
                `;
                const newsParams = keywords.flatMap(kw => [`%${kw}%`, `%${kw}%`]);
                console.log("Executing News query..."); // Add log
                const newsItems = db.prepare(newsQuery).all(...newsParams);
                if (newsItems.length > 0) {
                    internalContext += "Relevant News items found:\n" + newsItems.map(n => `- Title: ${n.title}\n  Content: ${n.content.substring(0, 150)}...`).join('\n') + "\n\n"; // Truncate content
                }

                // Search Feed (limit to 3 most relevant based on simple matching)
                const feedQuery = `
                    SELECT content FROM feed
                    WHERE ${keywords.map(() => `LOWER(content) LIKE ?`).join(' OR ')}
                    ORDER BY created_at DESC LIMIT 3;
                `;
                const feedParams = keywords.map(kw => `%${kw}%`);
                console.log("Executing Feed query..."); // Add log
                const feedItems = db.prepare(feedQuery).all(...feedParams);
                if (feedItems.length > 0) {
                    internalContext += "Relevant Feed posts found:\n" + feedItems.map(f => `- Post: ${f.content.substring(0, 150)}...`).join('\n') + "\n\n"; // Truncate content
                }
            }
        } catch (dbError) {
            console.error("Database query error:", dbError);
            // Don't fail the whole request, just proceed without internal context
            internalContext = "Note: There was an issue retrieving internal data.\n\n";
        }
        // --- End fetching internal data ---

        const genAI = new GoogleGenerativeAI(API_KEY);

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 0.8,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        // Format conversation history for Gemini API
        const geminiHistory = history
            .filter(msg => msg.role === 'user' || msg.role === 'model') // Ensure only valid roles
            .map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

        // Inject internal context before the last user message in the history sent to Gemini
        if (internalContext && geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === 'user') {
             const lastUserMessage = geminiHistory.pop(); // Remove last user message temporarily
             // Add context as a preceding 'user' message (or adjust role if needed)
             geminiHistory.push({
                 role: 'user', // Or 'model' if you want AI to treat it as prior info
                 parts: [{ text: `Okay, consider this internal information from FAQs, News, and Feed posts before answering:\n${internalContext}` }]
             });
             geminiHistory.push(lastUserMessage); // Add the actual user message back
        }

        const result = await model.generateContent({
            contents: geminiHistory, // Send the formatted history
            generationConfig,
            safetySettings,
        });

        if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
            const blockReason = result.response?.promptFeedback?.blockReason;
            const userMessage = blockReason
                ? `I cannot provide an answer due to safety restrictions (${blockReason}). Please rephrase your question.`
                : "Sorry, I couldn't generate a response for that question.";
            return NextResponse.json({ answer: userMessage });
        }

        const text = result.response.text();
        return NextResponse.json({ answer: text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return NextResponse.json({ error: "Failed to get response from AI due to an internal error." }, { status: 500 });
    }
}
