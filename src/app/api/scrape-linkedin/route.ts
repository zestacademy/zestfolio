import { NextResponse } from 'next/server';

interface CacheEntry {
    data: any;
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function detectDomain(headline: string, skills: string[]): string {
    const text = (headline + ' ' + skills.join(' ')).toLowerCase();

    const domains = [
        { name: "Web Development", keywords: ["react", "frontend", "backend", "web dev", "html", "css", "javascript", "next", "node"] },
        { name: "AI/ML", keywords: ["machine learning", "artificial intelligence", "deep learning", "nlp", "ai", "ml"] },
        { name: "Data Science", keywords: ["data science", "data analyst", "pandas", "sql", "tableau", "bi"] },
        { name: "Embedded Systems & IoT", keywords: ["embedded", "iot", "arduino", "microcontroller", "esp", "raspberry", "iiot"] },
        { name: "Cloud / DevOps", keywords: ["aws", "azure", "docker", "kubernetes", "devops", "cloud"] },
        { name: "Electrical Engineering", keywords: ["electrical", "power systems", "eee", "power electronics"] },
        { name: "Cybersecurity", keywords: ["security", "cybersecurity", "ethical hacking", "penetration"] }
    ];

    for (const domain of domains) {
        if (domain.keywords.some(keyword => text.includes(keyword))) {
            return domain.name;
        }
    }

    return "Engineering";
}

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Rate check
    const now = Date.now();
    const rateRecord = rateLimitMap.get(ip);

    if (rateRecord) {
        if (now - rateRecord.timestamp < RATE_LIMIT_WINDOW) {
            if (rateRecord.count >= MAX_REQUESTS) {
                return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
            }
            rateRecord.count++;
        } else {
            rateLimitMap.set(ip, { count: 1, timestamp: now });
        }
    } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    try {
        const { linkedinUrl } = await req.json();

        if (!linkedinUrl || !/^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?/.test(linkedinUrl)) {
            return NextResponse.json({ error: "Invalid LinkedIn URL" }, { status: 400 });
        }

        // Check cache
        const cached = cache.get(linkedinUrl);
        if (cached && (now - cached.timestamp < CACHE_TTL)) {
            return NextResponse.json(cached.data);
        }

        const APIFY_TOKEN = process.env.APIFY_TOKEN;
        if (!APIFY_TOKEN) {
            console.error('APIFY_TOKEN is missing');
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const apifyReqBody = {
            "profileScraperMode": "Profile details no email ($4 per 1k)",
            "queries": [linkedinUrl]
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds

        const response = await fetch(`https://api.apify.com/v2/acts/harvestapi~linkedin-profile-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(apifyReqBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Apify error ${response.status}: ${errBody}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error("No profile data found in Apify response.");
        }

        const raw = data[0];

        if (raw.error) {
            throw new Error(`Scraper Error: ${raw.error}`);
        }

        const skills = Array.isArray(raw.skills) ? raw.skills.map((s: any) => s.name || s) : [];
        const rawHeadline = raw.headline || '';

        const structuredData = {
            basicInformation: {
                fullName: [raw.firstName, raw.lastName].filter(Boolean).join(" ") || null,
                professionalTitle: rawHeadline || null,
                aboutMe: raw.about || null,
                domain: detectDomain(rawHeadline, skills),
                email: raw.email || null // Note: User specified null unless email mode is used
            },
            generalInformation: {
                publicEmail: null,
                profilePhotoUrl: raw.profilePicture?.url || raw.profilePicture || null,
                resumeUrl: null
            },
            skills: skills,
            education: Array.isArray(raw.education) ? raw.education.map((edu: any) => ({
                institutionName: edu.schoolName || "",
                degree: edu.degree || "",
                fieldOfStudy: edu.fieldOfStudy || "",
                startDate: edu.startDate?.text || null,
                endDate: edu.endDate?.text || "Current",
                details: edu.insights || null
            })) : [],
            projects: Array.isArray(raw.projects) ? raw.projects.map((proj: any) => ({
                title: proj.title || "",
                description: proj.description || null,
                technologies: [],
                link: null,
                repoLink: null,
                imageUrl: null
            })) : [],
            socialLinks: {
                linkedin: raw.linkedinUrl || linkedinUrl,
                github: null,
                twitter: null,
                personalWebsite: null,
                other: []
            },
            certifications: Array.isArray(raw.certifications) ? raw.certifications.map((cert: any) => ({
                name: cert.title || "",
                issuer: cert.issuedBy || null,
                date: cert.issuedAt ? cert.issuedAt.replace('Issued ', '') : null,
                link: cert.link || null
            })) : [],
            achievements: [],
            blogs: []
        };

        // Cache the successful result
        cache.set(linkedinUrl, { data: structuredData, timestamp: Date.now() });

        return NextResponse.json(structuredData);

    } catch (error: any) {
        if (error.name === 'AbortError') {
            return NextResponse.json({ error: "Failed to scrape profile", details: "Request to Apify timed out." }, { status: 504 });
        }
        console.error("LinkedIn scraper error:", error);
        return NextResponse.json({ error: "Failed to scrape profile", details: error.message }, { status: 500 });
    }
}
