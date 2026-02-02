import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import PDFParser from 'pdf2json';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = '';

        console.log(`Processing file: ${file.name} (${file.type})`);

        if (file.type === 'application/pdf') {
            text = await new Promise((resolve, reject) => {
                const pdfParser = new PDFParser(null, true); // true = text content only

                pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                    // The raw text might be URL encoded, use decodeURIComponent if needed, 
                    // or rely on getRawTextContent() which is generally cleaner.
                    resolve(pdfParser.getRawTextContent());
                });

                pdfParser.parseBuffer(buffer);
            });
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else if (file.type === 'text/plain') {
            text = buffer.toString('utf-8');
        } else {
            return NextResponse.json({ error: 'Unsupported file format. Please upload PDF, DOCX, or TXT.' }, { status: 400 });
        }

        if (!text || text.trim().length === 0) {
            throw new Error("Extracted text is empty. The file might be an image or scanned document.");
        }

        // --- GEMINI AI PARSING LOGIC ---
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is missing. Falling back or returning error.");
            return NextResponse.json({
                error: 'Server configuration error: GEMINI_API_KEY is missing.',
                hint: 'Please add GEMINI_API_KEY to your .env.local file.'
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // List of models to try in order of preference to handle Rate Limits (429)
        const modelsToTry = ["gemini-2.0-flash-001", "gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest"];

        // Sanitize text and truncate to avoid excessive token usage (approx 5-6k tokens limit for safety)
        const MAX_CHARS = 20000;
        let sanitizedText = text.replace(/`/g, "'");
        if (sanitizedText.length > MAX_CHARS) {
            console.warn(`Resume text too long (${sanitizedText.length} chars). Truncating to ${MAX_CHARS}.`);
            sanitizedText = sanitizedText.substring(0, MAX_CHARS);
        }

        // Minified prompt to save tokens
        const prompt = `Parse resume to JSON. No markdown.
Schema:
{
  "personal_details": {
    "fullName": "Name", "email": "Email", "phone": "Phone", "location": "City, Country",
    "linkedin": "URL", "github": "URL", "website": "URL", "professionalTitle": "Title"
  },
  "summary": "Summary",
  "skills": ["Skill1", "Skill2"],
  "education": [{ "institution": "School", "degree": "Degree", "year": "Year" }],
  "experience": [{ "company": "Co", "role": "Role", "duration": "Dates", "description": "Desc" }],
  "projects": [{ "title": "Title", "description": "Desc", "technologies": ["Tech"] }],
  "certifications": [{ "name": "Name", "issuer": "Org", "year": "Year" }],
  "achievements": [{ "title": "Title", "description": "Desc" }]
}
Resume:
${sanitizedText}`;

        let responseText = '';
        let lastError: any = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting to parse with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const result = await model.generateContent(prompt);
                const response = await result.response;
                responseText = response.text();

                // Clean up if the model includes code blocks despite instructions
                const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

                const parsedData = JSON.parse(cleanJson);

                // If we get here, success!
                return NextResponse.json({ success: true, data: parsedData });

            } catch (error: any) {
                console.warn(`Model ${modelName} failed:`, error.message);
                lastError = error;

                // If it's NOT a rate limit error (429) or Service Unavailable (503), throw immediately (e.g. invalid key)
                const isRateLimit = error.status === 429 || error.message?.includes('429') || error.message?.includes('Quota');
                const isServiceError = error.status === 503;

                if (!isRateLimit && !isServiceError) {
                    break; // Don't retry for other errors
                }
                // Otherwise loop to next model
            }
        }

        // If we exhausted all models
        console.error("All models failed. Last error:", lastError);
        console.log("Raw Response Text (if any):", responseText);

        let errorMessage = 'Failed to parse resume with AI';
        let errorDetails = lastError?.message || 'Unknown error';

        if (lastError instanceof SyntaxError) {
            errorMessage = 'AI returned invalid JSON';
            errorDetails = 'The model response could not be parsed as JSON.';
        } else if (lastError?.status === 429 || lastError?.message?.includes('429')) {
            errorMessage = 'Too Many Requests';
            errorDetails = 'Free tier quota exceeded on all available models. Please wait a moment.';
        }

        return NextResponse.json({
            error: errorMessage,
            details: errorDetails
        }, { status: 502 });

    } catch (error: any) {
        console.error('Resume Parsing Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error during parsing',
            details: error.message
        }, { status: 500 });
    }
}
