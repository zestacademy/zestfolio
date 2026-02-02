import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

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
                const pdfParser = new PDFParser(null, 1); // 1 = text content only

                pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                    // rawText is usually URL encoded, sometimes easier to use .getRawTextContent() if available, 
                    // or simple parsing. 
                    // pdf2json "text only" output usually needs a bit of extracting.
                    // However, let's use the explicit raw text extraction mode.
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

        // --- RULE-BASED PARSING LOGIC ---
        // (Same robust logic as before)

        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        const fullText = lines.join('\n');

        const parsedData = {
            personal_details: {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
                professionalTitle: ''
            },
            summary: '',
            skills: [] as string[],
            education: [] as any[],
            experience: [] as any[],
            projects: [] as any[],
            certifications: [] as any[],
            achievements: [] as any[]
        };

        // Regex Utils
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
        const linkedinRegex = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/i;
        const githubRegex = /github\.com\/([a-zA-Z0-9-]+)/i;

        // Naive Name Extraction (First non-empty line usually)
        if (lines.length > 0) parsedData.personal_details.fullName = lines[0];

        // Extraction
        const emailMatch = fullText.match(emailRegex);
        if (emailMatch) parsedData.personal_details.email = emailMatch[0];

        const phoneMatch = fullText.match(phoneRegex);
        if (phoneMatch) parsedData.personal_details.phone = phoneMatch[0];

        const linkedinMatch = fullText.match(linkedinRegex);
        if (linkedinMatch) parsedData.personal_details.linkedin = "https://linkedin.com/in/" + linkedinMatch[1];

        const githubMatch = fullText.match(githubRegex);
        if (githubMatch) parsedData.personal_details.github = "https://github.com/" + githubMatch[1];

        // Section Segmentation
        let currentSection = 'unknown';
        const sections: Record<string, string[]> = {
            summary: [],
            skills: [],
            education: [],
            experience: [],
            projects: []
        };

        const sectionKeywords: Record<string, string[]> = {
            summary: ['summary', 'objective', 'about me', 'profile'],
            skills: ['skills', 'technologies', 'technical skills', 'core competencies', 'stack'],
            education: ['education', 'academic', 'qualifications', 'university'],
            experience: ['experience', 'work history', 'employment', 'career history'],
            projects: ['projects', 'key projects']
        };

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const lowerLine = line.toLowerCase();
            let isHeader = false;

            // Heuristic: Headers are usually short
            if (line.length < 50) {
                for (const [section, keywords] of Object.entries(sectionKeywords)) {
                    if (keywords.some(k => lowerLine.includes(k) && lowerLine.length < k.length + 10)) {
                        currentSection = section;
                        isHeader = true;
                        break;
                    }
                }
            }

            if (!isHeader && currentSection !== 'unknown' && sections[currentSection]) {
                sections[currentSection].push(line);
            } else if (!isHeader && currentSection === 'unknown') {
                if (lowerLine.match(/software|developer|engineer|manager|designer/)) {
                    parsedData.personal_details.professionalTitle = line;
                } else if (lines.length < 10) {
                    // Early lines might be summary/location
                    if (!parsedData.personal_details.location && line.match(/[A-Z][a-z]+, [A-Z]{2}/)) {
                        parsedData.personal_details.location = line;
                    }
                }
            }
        }

        // Process Sections
        if (sections.skills.length > 0) {
            // Cleaning skills text
            const rawSkills = sections.skills.join(' ');
            parsedData.skills = rawSkills.split(/[,|•·\n]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 30);
        }

        parsedData.summary = sections.summary.join(' ');

        if (sections.education.length > 0) {
            parsedData.education.push({
                institution: sections.education[0] || "Unknown Institution",
                degree: sections.education.find(l => l.includes('Degree') || l.includes('Bachelor') || l.includes('Master')) || "",
                year: sections.education.find(l => l.match(/\d{4}/)) || ""
            });
        }

        if (sections.experience.length > 0) {
            parsedData.experience.push({
                company: "Parsed from Resume",
                role: "",
                duration: "",
                description: sections.experience.join('\n')
            });
        }

        if (sections.projects.length > 0) {
            parsedData.projects.push({
                title: "Parsed Projects",
                description: sections.projects.join('\n'),
                technologies: []
            });
        }

        return NextResponse.json({ success: true, data: parsedData });

    } catch (error: any) {
        console.error('Resume Parsing Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error during parsing',
            details: error.message
        }, { status: 500 });
    }
}
