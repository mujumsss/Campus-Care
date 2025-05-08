import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    const { question } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = await response.text();

        return new Response(JSON.stringify({ answer: text }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Something went wrong" }), {
            status: 500,
        });
    }
}
