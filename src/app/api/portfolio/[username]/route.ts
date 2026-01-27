import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    // 1. Find user by username
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(portfoliosRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return new NextResponse('User not found', { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as any;

    // Fetch array data directly
    const projects = userData.projects || [];
    const skills = userData.skills || [];

    // Construct simplified portfolio object
    const portfolio = {
        ...userData,
        projects,
        skills
    };

    const templateId = portfolio.templateId || 'template01';

    // Locate template file
    const templatePath = path.join(process.cwd(), 'portfolio_templates', templateId, `${templateId}.html`);
    let htmlContent = '';

    try {
        if (fs.existsSync(templatePath)) {
            htmlContent = fs.readFileSync(templatePath, 'utf8');
        } else {
            const codePath = path.join(process.cwd(), 'portfolio_templates', templateId, 'code.html');
            if (fs.existsSync(codePath)) {
                htmlContent = fs.readFileSync(codePath, 'utf8');
            } else {
                return new NextResponse(`Template ${templateId} not found`, { status: 404 });
            }
        }
    } catch (e) {
        console.error(e);
        return new NextResponse('Error loading template', { status: 500 });
    }

    // --- AI Injection Strategy ---
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const apiKey = process.env.GOOGLE_API_KEY;

        if (apiKey) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            You are an expert web developer optimization engine.
            
            Task:
            1. Take the provided HTML template.
            2. Inject the provided User Data into the appropriate sections (Names, Titles, Bio, Projects, Skills, Social Links).
            3. CRITICAL: If the user has NOT provided data for a specific section (e.g., no projects, no skills, no specific social link), YOU MUST REMOVE that section from the HTML entirely so it does not look empty or broken.
            4. Preserve all existing CSS, JavaScript, and asset links. Do not change the overall design style, only the content and visibility of sections.
            5. Return ONLY the valid, raw HTML string. Do not use markdown code blocks.

            User Data:
            ${JSON.stringify(portfolio, null, 2)}

            HTML Template:
            ${htmlContent}
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const aiHtml = response.text();

            // Clean up markdown code blocks if present (AI sometimes adds them)
            const cleanHtml = aiHtml.replace(/```html/g, '').replace(/```/g, '');

            return new NextResponse(cleanHtml, {
                headers: { 'Content-Type': 'text/html' },
            });
        }
    } catch (error) {
        console.error("AI Generation failed, falling back to manual injection:", error);
    }

    const $ = cheerio.load(htmlContent);

    // --- Dynmaic Injection (Fallback) ---
    // Title
    $('title').text(`${portfolio.fullName || 'User'} | Portfolio`);

    if (templateId === 'template01') {
        $('h2:contains("TechNexus")').text(portfolio.fullName || 'Portfolio User');
        $('h1').first().text(portfolio.professionalTitle || 'Creative Professional');
        $('h1').first().next('h2').text(portfolio.aboutMe || 'Welcome to my portfolio.');

        // Projects
        if (portfolio.projects && portfolio.projects.length > 0) {
            const projectsHeader = $('h2:contains("Featured Projects")');
            const projectsContainer = projectsHeader.next('div').find('.flex.items-stretch');

            if (projectsContainer.length) {
                projectsContainer.empty();
                portfolio.projects.forEach((proj: any) => {
                    const projHtml = `
                     <div class="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60 max-w-sm">
                         <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex flex-col" 
                              style="background-image: url('${proj.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop'}'); background-color: #333;"></div>
                         <div>
                             <p class="text-white text-base font-medium leading-normal">${proj.title || 'Untitled Project'}</p>
                             <p class="text-[#9cba9c] text-sm font-normal leading-normal">${proj.description || ''}</p>
                             ${proj.link ? `<a href="${proj.link}" target="_blank" class="text-green-400 text-xs mt-2 inline-block hover:underline">View Project</a>` : ''}
                         </div>
                     </div>
                    `;
                    projectsContainer.append(projHtml);
                });
            }
        } else {
            $('h2:contains("Featured Projects")').parent().remove();
        }

        // Social Links
        const socialLinksData = portfolio.socialLinks || {};
        if (socialLinksData.github) {
            const githubLink = $('a[href*="github.com"]');
            if (githubLink.length) githubLink.attr('href', socialLinksData.github);
        } else {
            $('a[href*="github.com"]').remove();
        }

        if (socialLinksData.linkedin) {
            const linkedinLink = $('a[href*="linkedin.com"]');
            if (linkedinLink.length) linkedinLink.attr('href', socialLinksData.linkedin);
        } else {
            $('a[href*="linkedin.com"]').remove();
        }

        if (socialLinksData.twitter) {
            const twitterLink = $('a[href*="twitter.com"], a[href*="x.com"]');
            if (twitterLink.length) twitterLink.attr('href', socialLinksData.twitter);
        }

        // Skills
        if (portfolio.skills && portfolio.skills.length > 0) {
            const skillsHeader = $('h2:contains("Skills")');
            const skillsGrid = skillsHeader.next('div');

            if (skillsGrid.length) {
                skillsGrid.empty();
                portfolio.skills.forEach((skill: any) => {
                    const skillHtml = `
                     <div class="flex flex-1 gap-3 rounded-lg border border-[#3b543b] bg-[#1b271b] p-4 items-center min-w-[150px]">
                        <div class="text-white">
                            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path></svg>
                        </div>
                        <h2 class="text-white text-base font-bold leading-tight">${skill.name || skill}</h2>
                     </div>
                     `;
                    skillsGrid.append(skillHtml);
                });
            }
        } else {
            $('h2:contains("Skills")').parent().remove();
        }

        if (portfolio.publicEmail) {
            $('input[placeholder*="email"]').val(portfolio.publicEmail);
        }
    } else {
        // Generic Fallback
        $('body').prepend('<div style="background:red; color:white; padding:5px; text-align:center; position:sticky; top:0; z-index:9999;">Generic Preview Mode - Template specific fields might not map perfectly.</div>');
        const h1 = $('h1').first();
        if (h1.length) h1.text(portfolio.professionalTitle || portfolio.fullName || 'Portfolio');
        const p = $('p').first();
        if (p.length) p.text(portfolio.aboutMe || '');
    }

    return new NextResponse($.html(), {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}
