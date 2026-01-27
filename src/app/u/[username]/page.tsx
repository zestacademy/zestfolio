import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { notFound } from 'next/navigation';

async function getUserPortfolio(username: string) {
    // 1. Find user by username
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(portfoliosRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as any;

    // 2. Use data directly from the document (Arrays)
    // The data is stored as arrays within the main document, not subcollections.
    const projects = userData.projects || [];
    const skills = userData.skills || []; // Assuming skills might be added as array later or if using array storage

    return {
        ...userData,
        projects,
        skills
    };
}

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    // Decode username to handle spaces etc if needed, though usually usernames are url-safe
    const decodedUsername = decodeURIComponent(username);
    const portfolio = await getUserPortfolio(decodedUsername);

    if (!portfolio) {
        return notFound();
    }

    const templateId = portfolio.templateId || 'template01';

    // Path to the template file
    const templatePath = path.join(process.cwd(), 'portfolio_templates', templateId, `${templateId}.html`);
    // Fallback or check if exists
    // For some templates the file name is 'code.html', need to handle that.
    // Based on previous list_dir:
    // template01: template01.html
    // template02: code.html
    // template03: code.html
    // ...

    let htmlContent = '';
    try {
        if (fs.existsSync(templatePath)) {
            htmlContent = fs.readFileSync(templatePath, 'utf8');
        } else {
            const codePath = path.join(process.cwd(), 'portfolio_templates', templateId, 'code.html');
            if (fs.existsSync(codePath)) {
                htmlContent = fs.readFileSync(codePath, 'utf8');
            } else {
                throw new Error(`Template file not found for ${templateId}`);
            }
        }
    } catch (e) {
        console.error(e);
        return <div>Error loading template configuration. Please contact support.</div>;
    }

    // Load HTML into Cheerio
    const $ = cheerio.load(htmlContent);

    // --- Dynamic Injection Strategy ---
    // We try to find semantic elements or use heuristics. 
    // Since we don't have explicit IDs in the downloaded templates, we guess based on content or utility classes.

    // 1. Title / Name (Browser Title)
    $('title').text(`${portfolio.firstName || 'User'} | Portfolio`);

    // 2. Main Name (often in H1 or H2 in header)
    // Heuristic: Find element containing "TechNexus" or just the first H2 in header
    // Helper to find text and replace safely
    const replaceText = (selector: string, newText: string) => {
        if (newText) $(selector).first().text(newText);
    };

    // For Template 01 specific logic (we can expand switch cases later)
    if (templateId === 'template01') {
        // Logo/Brand
        $('h2:contains("TechNexus")').text(portfolio.fullName || 'Portfolio User');

        // Hero Title - "SENIOR SYSTEMS ENGINEER"
        // Try to find the large H1
        $('h1').text(portfolio.professionalTitle || 'Creative Professional');

        // Hero Description
        $('h1').next('h2').text(portfolio.aboutMe || 'Welcome to my portfolio.');

        // Projects
        if (portfolio.projects && portfolio.projects.length > 0) {
            // Find the container. In template 01 it is:
            // <h2 ...>Featured Projects</h2>
            // <div class="flex overflow-y-auto ..."> <-- Container

            const projectsHeader = $('h2:contains("Featured Projects")');
            const projectsContainer = projectsHeader.next('div').find('.flex.items-stretch');

            // Or the container is the div immediately after header?
            // In the file: <div class="flex overflow-y-auto..."><div class="flex items-stretch...>
            // Let's target the inner one that holds the project cards

            if (projectsContainer.length) {
                // Clear existing items
                projectsContainer.empty();

                // Add user projects
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
        }

        // Skills (Currently not in schema but might be fetched)
        // Adjust if needed. Assuming skills is an array of strings or objects if it existed.
        // Based on ProfileForm, there is no separate skills collection save logic shown yet, 
        // but let's keep the logic safe.
        if (portfolio.skills && portfolio.skills.length > 0) {
            const skillsHeader = $('h2:contains("Skills")');
            const skillsGrid = skillsHeader.next('div');
            // Logic: the div immediately following the "Skills" h2

            if (skillsGrid.length) {
                skillsGrid.empty();
                portfolio.skills.forEach((skill: any) => {
                    // Simple skill card
                    const skillHtml = `
                     <div class="flex flex-1 gap-3 rounded-lg border border-[#3b543b] bg-[#1b271b] p-4 items-center min-w-[150px]">
                        <div class="text-white">
                            <!-- Default Icon -->
                            <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path></svg>
                        </div>
                        <h2 class="text-white text-base font-bold leading-tight">${skill.name || skill}</h2>
                     </div>
                     `;
                    skillsGrid.append(skillHtml);
                });
            }
        }

        // Contact Email
        // Find input with placeholder "your.email@example.com" or label containing Email
        if (portfolio.publicEmail) {
            // Usually we'd want a mailto link or form logic. 
            // For now, let's just update the placeholder or add a text
            $('input[placeholder*="email"]').val(portfolio.publicEmail);
        }
    } else {
        // Fallback generic injection for other templates
        $('body').prepend('<div style="background:red; color:white; padding:5px; text-align:center;">Generic Preview Mode - Template specific fields might not map perfectly.</div>');
        $('h1').first().text(portfolio.fullName || 'Portfolio User');
        $('p').first().text(portfolio.aboutMe || '');
    }

    // Return the full HTML
    return (
        <div dangerouslySetInnerHTML={{ __html: $.html() }} style={{ width: '100%', height: '100%' }} />
    );
}
