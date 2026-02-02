import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyCxIGpty5CTmQV298hCgJxXcluldxO0DdA';
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        // There isn't a direct listModels on genAI instance in some versions, 
        // but we can try to just generateContent with 'gemini-pro' to see if it works
        console.log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-pro worked:", result.response.text());
    } catch (e) {
        console.log("gemini-pro failed:", e.message);
    }

    try {
        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-flash worked:", result.response.text());
    } catch (e) {
        console.log("gemini-1.5-flash failed:", e.message);
    }

    try {
        console.log("Testing gemini-1.5-flash-001...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-flash-001 worked:", result.response.text());
    } catch (e) {
        console.log("gemini-1.5-flash-001 failed:", e.message);
    }
}

test();
