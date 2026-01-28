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

    try {
        // 1. Find user by username
        const portfoliosRef = collection(db, 'portfolios');
        const q = query(portfoliosRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return new NextResponse('User not found', { status: 404 });
        }

        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data() as any;

        // Check Status (Manual Pause only)
        // Note: 90-day automatic inactivity logic has been removed.
        const isInactive = data.status === 'inactive';

        if (isInactive) {
            return new NextResponse(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Portfolio Inactive | ZestFolio</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body class="bg-slate-50 flex items-center justify-center min-h-screen font-sans">
                    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-slate-100">
                        <div class="mb-6 text-amber-500 mx-auto w-16 h-16 flex items-center justify-center bg-amber-50 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 class="text-2xl font-bold mb-3 text-slate-800">Portfolio Currently Inactive</h1>
                        <p class="text-slate-500 mb-8 leading-relaxed">This portfolio is either in maintenance mode or has been marked as inactive due to extended inactivity.</p>
                        <a href="/" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
                            Create Your Own Portfolio
                        </a>
                    </div>
                </body>
                </html>
            `, { headers: { 'Content-Type': 'text/html' } });
        }

        // 2. Extract and Normalize Data
        const portfolio = {
            fullName: data.fullName || 'User',
            professionalTitle: data.professionalTitle || 'Professional',
            aboutMe: data.aboutMe || '',
            domain: data.domain || '',
            email: data.email || '',
            publicEmail: data.publicEmail || '',
            profilePhoto: data.profilePhoto || '',
            projects: data.projects || [],
            skills: data.skills || [],
            education: data.education || [],
            socialLinks: data.socialLinks || {},
            templateId: data.templateId || 'template01',
            phone: data.phone || '',
            location: data.location || '',
            certifications: data.certifications || []
        };

        console.log('📊 Portfolio Data:', {
            name: portfolio.fullName,
            template: portfolio.templateId,
            education: portfolio.education.length
        });

        // 3. Load template HTML (Standardized to index.html)
        const templatePath = path.join(process.cwd(), 'portfolio_templates', portfolio.templateId, 'index.html');

        if (!fs.existsSync(templatePath)) {
            console.warn(`Template ${portfolio.templateId} not found (index.html missing)`);
            return new NextResponse(`Template ${portfolio.templateId} not found`, { status: 404 });
        }

        const htmlContent = fs.readFileSync(templatePath, 'utf8');
        const $ = cheerio.load(htmlContent);

        // 4. Inject Data (Robust ID-First Approach)

        // Title
        $('title').text(`${portfolio.fullName} | Portfolio`);

        // Name
        const nameSelectors = ['#portfolio-name', 'h2:contains("TechNexus")', '.user-fullname', 'div.logo-text'];
        let nameFound = false;
        nameSelectors.forEach(sel => {
            if ($(sel).length) {
                $(sel).text(portfolio.fullName);
                nameFound = true;
            }
        });

        // Professional Title
        const titleSelectors = ['#portfolio-title', 'h1:contains("SENIOR SYSTEMS ENGINEER")', '.user-title'];
        titleSelectors.forEach(sel => {
            if ($(sel).length) $(sel).text(portfolio.professionalTitle);
        });

        // About Me
        const bioSelectors = ['#portfolio-bio', 'h2:contains("A seasoned systems engineer")', '.user-bio'];
        bioSelectors.forEach(sel => {
            if ($(sel).length) $(sel).text(portfolio.aboutMe || 'Welcome to my portfolio');
        });

        // Contact Details (Phone & Location)
        if (portfolio.phone) {
            const phoneSelectors = ['#portfolio-phone', '.portfolio-phone'];
            phoneSelectors.forEach(sel => {
                if ($(sel).length) $(sel).text(portfolio.phone);
            });
        }

        if (portfolio.location) {
            const locationSelectors = ['#portfolio-location', '.portfolio-location'];
            locationSelectors.forEach(sel => {
                if ($(sel).length) $(sel).text(portfolio.location);
            });
        }

        // Profile Photo - Enhanced to properly display user photos
        if (portfolio.profilePhoto) {
            // Update header profile photo (small circular image)
            const headerPhotoSelectors = [
                '#portfolio-hero-image',
                'header img.profile-photo',
                'header div.rounded-full[style*="background-image"]',
                'header .size-10[style*="background-image"]'
            ];

            headerPhotoSelectors.forEach(sel => {
                const $el = $(sel);
                if ($el.length) {
                    if ($el.is('img')) {
                        $el.attr('src', portfolio.profilePhoto);
                        $el.attr('alt', portfolio.fullName);
                    } else {
                        // For background-image divs, preserve other styles
                        const existingStyle = $el.attr('style') || '';
                        const newStyle = existingStyle.replace(/background-image:\s*url\([^)]+\)/gi, '');
                        $el.attr('style', `${newStyle}; background-image: url("${portfolio.profilePhoto}"); background-size: cover; background-position: center;`.replace(/;\s*;/g, ';').trim());
                    }
                }
            });

            // Update hero section main image
            const heroImageSelectors = [
                '#portfolio-main-image',
                '.hero-section img.profile-photo',
                '.hero-section div[style*="background-image"]',
                'div.aspect-video[style*="background-image"]'
            ];

            heroImageSelectors.forEach(sel => {
                const $el = $(sel);
                if ($el.length) {
                    if ($el.is('img')) {
                        $el.attr('src', portfolio.profilePhoto);
                        $el.attr('alt', `${portfolio.fullName} - Profile Photo`);
                    } else {
                        // For hero images, use the profile photo as background
                        const existingStyle = $el.attr('style') || '';
                        const newStyle = existingStyle.replace(/background-image:\s*url\([^)]+\)/gi, '');
                        $el.attr('style', `${newStyle}; background-image: url("${portfolio.profilePhoto}"); background-size: cover; background-position: center;`.replace(/;\s*;/g, ';').trim());
                    }
                }
            });
        } else {
            // If no profile photo, use a professional placeholder
            const placeholderUrl = 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#0df20d">
                    <circle cx="128" cy="80" r="40" fill="#1b271b"/>
                    <path d="M128 128c-33 0-60 27-60 60v68h120v-68c0-33-27-60-60-60z" fill="#1b271b"/>
                </svg>
            `);

            $('#portfolio-hero-image, #portfolio-main-image').each((i, el) => {
                const $el = $(el);
                if ($el.is('img')) {
                    $el.attr('src', placeholderUrl);
                } else {
                    $el.attr('style', `background-image: url("${placeholderUrl}"); background-size: cover; background-position: center;`);
                }
            });
        }

        // Social Links
        const socialMap = {
            github: ['#social-github', 'a[title="GitHub"]'],
            linkedin: ['#social-linkedin', 'a[title="LinkedIn"]'],
            twitter: ['#social-twitter', 'a[title*="Twitter"]', 'a[title*="X"]'],
            website: ['#social-website', 'a[title*="Blog"]', 'a[title*="Website"]']
        };

        Object.entries(socialMap).forEach(([network, selectors]: [string, string[]]) => {
            // @ts-ignore
            const url = portfolio.socialLinks[network];
            // Find first matching selector
            let el = $('');
            for (const sel of selectors) {
                if ($(sel).length) {
                    el = $(sel);
                    break;
                }
            }

            if (url) {
                if (el.length) el.attr('href', url);
            } else {
                if (el.length) el.remove();
            }
        });

        // Projects
        const projectsHeader = $('#portfolio-projects-header, h2:contains(\"Featured Projects\")');
        const projectsContainer = $('#portfolio-projects');

        if (portfolio.projects && portfolio.projects.length > 0) {

            // If explicit container exists, use it
            let container = projectsContainer.length ? projectsContainer : projectsHeader.next('div');

            if (container.length) {
                // Use neutral styling that works with any template theme
                const projectsHTML = portfolio.projects.map((proj: any) => `
                    <div class="flex flex-col gap-4 rounded-lg min-w-[300px] max-w-[320px] shrink-0 snap-center">
                        <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg relative overflow-hidden group" 
                             style="background-image: url('${proj.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop'}'); background-color: #333;">
                             <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                ${proj.link ? `<a href="${proj.link}" target="_blank" class="bg-white/90 text-black px-6 py-2 rounded-full font-bold text-sm transform scale-90 group-hover:scale-100 transition-transform hover:bg-white">View Project</a>` : ''}
                             </div>
                        </div>
                        <div>
                            <p class="text-lg font-bold leading-normal line-clamp-1 mb-1">${proj.title || 'Untitled Project'}</p>
                            <p class="text-sm opacity-70 font-normal leading-relaxed line-clamp-2 hfont-normal leading-relaxed line-clamp-2 h-[40px]">${proj.description || ''}</p>
                        </div>
                    </div>
                `).join('');

                container.empty()
                    .removeClass('flex-col grid')
                    .addClass('flex overflow-x-auto pb-6 gap-6 px-4 snap-x') // Enhanced scroll container
                    .html(projectsHTML);
            }
        } else {
            projectsHeader.remove();
            if (projectsContainer.length) projectsContainer.remove();
            // Legacy fallback removal
            if (!projectsContainer.length) projectsHeader.next('div').remove();
        }

        // Skills
        const skillsHeader = $('#portfolio-skills-header, h2:contains("Skills")');
        const skillsContainer = $('#portfolio-skills');

        // Function to get skill icon based on skill name
        const getSkillIcon = (skillName: string): string => {
            const skill = skillName.toLowerCase();

            // Programming Languages
            if (skill.includes('javascript') || skill.includes('js')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M0 0h256v256H0V0zm127.5 211.1c0 23.8-14 34.7-34.4 34.7-18.4 0-29-9.5-34.5-21l18.7-11.3c3.6 6.4 6.9 11.8 14.8 11.8 7.6 0 12.4-3 12.4-14.6V116h23v95.1zm53.7 33.8c-21.3 0-35-10.1-41.7-23.4l18.7-10.8c4.9 8 11.3 13.9 22.7 13.9 9.5 0 15.6-4.8 15.6-11.4 0-7.9-6.2-10.7-16.7-15.3l-5.7-2.4c-16.6-7.1-27.6-16-27.6-34.8 0-17.3 13.2-30.5 33.8-30.5 14.7 0 25.2 5.1 32.8 18.5l-18 11.6c-4-7.1-8.2-9.9-14.8-9.9-6.7 0-11 4.3-11 9.9 0 6.9 4.3 9.7 14.2 14l5.7 2.4c19.5 8.4 30.6 16.9 30.6 36.1 0 20.7-16.3 32.2-38.1 32.2z"/></svg>';
            if (skill.includes('python')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"/><path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"/></svg>';
            if (skill.includes('java') && !skill.includes('javascript')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M82.554 171.175s-8.837 5.141 6.286 6.857c18.28 2.036 27.62 1.748 47.758-1.979 0 0 5.313 3.328 12.73 6.206-45.278 19.398-102.503-.563-66.774-11.084M74.292 147.699s-9.91 7.337 5.208 8.902c19.55 2.035 34.976 2.203 61.658-2.986 0 0 3.696 3.746 9.486 5.797-54.642 15.963-115.498 1.257-76.352-11.713"/><path d="M143.942 106.603c11.158 12.854-2.93 24.424-2.93 24.424s28.354-14.644 15.334-32.964c-12.152-17.098-21.462-25.603 28.96-54.888 0 0-79.13 19.755-41.364 63.428"/><path d="M201.262 185.977s6.547 5.396-7.197 9.574c-26.176 7.949-108.952 10.346-131.903.317-8.264-3.612 7.23-8.613 12.103-9.671 5.088-1.106 7.984-1.106 7.984-1.106-9.188-6.47-59.354 12.696-25.476 18.18 92.304 14.957 168.252-6.739 143.489-17.294M85.893 122.932s-42.043 9.98-14.892 13.607c11.465 1.532 34.327 1.184 55.65-.593 17.453-1.456 34.976-4.567 34.976-4.567s-6.159 2.642-10.619 5.687c-42.687 11.232-125.142 6.002-101.425-5.481 20.036-9.711 36.31-8.653 36.31-8.653M171.149 159.559c43.394-22.563 23.324-44.263 9.322-41.349-3.428.712-4.963 1.329-4.963 1.329s1.275-1.998 3.708-2.858c27.706-9.74 49.003 28.754-8.94 43.98 0 0 .67-.603 1.873-1.102"/><path d="M124.795 1.535s24.044 24.044-22.802 60.996c-37.56 29.644-8.567 46.538-.006 65.834-21.922-19.771-38.015-37.156-27.225-53.394C87.831 54.509 132.784 41.294 124.795 1.535"/><path d="M89.015 256c41.65-2.67 105.73-14.854 107.16-53.403 0 0-2.914 7.476-34.435 13.415-35.593 6.702-79.483 5.922-105.566 1.624 0 0 5.342 4.42 32.841 8.364"/></svg>';
            if (skill.includes('typescript') || skill.includes('ts')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M0 128v128h256V0H0z" fill="#3178c6"/><path d="M56.611 128.85l-.081 10.483h33.32v94.68h23.568v-94.68h33.321v-10.28c0-5.69-.122-10.444-.284-10.566-.122-.162-20.4-.244-44.983-.203l-44.74.122-.121 10.443zm149.955-10.742c6.501 1.626 11.459 4.51 16.01 9.224 2.357 2.52 5.851 7.111 6.136 8.208.08.325-11.053 7.802-17.798 11.988-.244.162-1.22-.894-2.317-2.52-3.291-4.795-6.745-6.867-12.028-7.233-7.76-.528-12.759 3.535-12.718 10.321 0 1.992.284 3.17 1.097 4.795 1.707 3.536 4.876 5.649 14.832 9.956 18.326 7.883 26.168 13.084 31.045 20.48 5.445 8.249 6.664 21.415 2.966 31.208-4.063 10.646-14.14 17.879-28.323 20.276-4.388.772-14.79.65-19.504-.203-10.28-1.829-20.033-6.908-26.047-13.572-2.357-2.6-6.949-9.387-6.664-9.874.122-.163 1.178-.813 2.356-1.504 1.138-.65 5.446-3.129 9.509-5.485l7.355-4.267 1.544 2.276c2.154 3.29 6.867 7.801 9.712 9.305 8.167 4.307 19.383 3.698 24.909-1.26 2.357-2.153 3.332-4.388 3.332-7.68 0-2.966-.366-4.266-1.91-6.501-1.99-2.845-6.054-5.242-17.595-10.24-13.206-5.69-18.895-9.224-24.096-14.832-3.007-3.25-5.852-8.452-7.03-12.8-.975-3.617-1.22-12.678-.447-16.335 2.723-12.76 12.353-21.659 26.25-24.3 4.51-.853 14.994-.528 19.424.569z" fill="#fff"/></svg>';
            if (skill.includes('c++') || skill.includes('cpp')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M0 128.5C0 57.8 57.8 0 128.5 0S257 57.8 257 128.5 199.2 257 128.5 257 0 199.2 0 128.5z" fill="#00599C"/><path d="M128.5 33.3c-52.6 0-95.2 42.6-95.2 95.2s42.6 95.2 95.2 95.2 95.2-42.6 95.2-95.2-42.6-95.2-95.2-95.2zm0 171.4c-42.1 0-76.2-34.1-76.2-76.2s34.1-76.2 76.2-76.2 76.2 34.1 76.2 76.2-34.1 76.2-76.2 76.2z" fill="#fff"/><path d="M128.5 71.4c-31.5 0-57.1 25.6-57.1 57.1s25.6 57.1 57.1 57.1 57.1-25.6 57.1-57.1-25.6-57.1-57.1-57.1zm-9.5 85.7V100h19v57.1h-19zm38.1 0V100h19v57.1h-19z" fill="#fff"/></svg>';
            if (skill.includes('c#') || skill.includes('csharp')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M0 128v128h256V0H0z" fill="#68217A"/><path d="M128 23C75.8 23 34 64.8 34 117s41.8 94 94 94 94-41.8 94-94-41.8-94-94-94zm0 168c-40.8 0-74-33.2-74-74s33.2-74 74-74 74 33.2 74 74-33.2 74-74 74z" fill="#fff"/></svg>';
            if (skill.includes('go') || skill.includes('golang')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M40.2 101.1c-.4 0-.5-.2-.3-.5l2.1-2.7c.2-.3.7-.5 1.1-.5h35.7c.4 0 .5.3.3.6l-1.7 2.6c-.2.3-.7.6-1 .6l-36.2-.1zM25.1 110.3c-.4 0-.5-.2-.3-.5l2.1-2.7c.2-.3.7-.5 1.1-.5h45.6c.4 0 .6.3.5.6l-.8 2.4c-.1.4-.5.6-.9.6l-47.3.1zm58.8 9.3c-.4 0-.5-.3-.3-.6l1.4-2.5c.2-.3.6-.6 1-.6h20c.4 0 .6.3.6.7l-.2 2.4c0 .4-.4.7-.7.7l-21.8-.1zM128.4 0c-3.1 0-5.6 2.5-5.6 5.6v244.8c0 3.1 2.5 5.6 5.6 5.6 3.1 0 5.6-2.5 5.6-5.6V5.6c0-3.1-2.5-5.6-5.6-5.6z" fill="#00ADD8"/></svg>';
            if (skill.includes('rust')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M189.1 164.5c-1.8 0-3.4.5-4.8 1.3l-13.5-11.5c.9-2.1 1.4-4.4 1.4-6.8 0-2.4-.5-4.7-1.4-6.8l13.5-11.5c1.4.8 3 1.3 4.8 1.3 5.3 0 9.6-4.3 9.6-9.6s-4.3-9.6-9.6-9.6-9.6 4.3-9.6 9.6c0 1.8.5 3.4 1.3 4.8l-13.5 11.5c-4.2-4.9-10.4-8-17.3-8s-13.1 3.1-17.3 8l-13.5-11.5c.8-1.4 1.3-3 1.3-4.8 0-5.3-4.3-9.6-9.6-9.6s-9.6 4.3-9.6 9.6 4.3 9.6 9.6 9.6c1.8 0 3.4-.5 4.8-1.3l13.5 11.5c-.9 2.1-1.4 4.4-1.4 6.8 0 2.4.5 4.7 1.4 6.8l-13.5 11.5c-1.4-.8-3-1.3-4.8-1.3-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6c0-1.8-.5-3.4-1.3-4.8l13.5-11.5c4.2 4.9 10.4 8 17.3 8s13.1-3.1 17.3-8l13.5 11.5c-.8 1.4-1.3 3-1.3 4.8 0 5.3 4.3 9.6 9.6 9.6s9.6-4.3 9.6-9.6-4.3-9.6-9.6-9.6z" fill="#CE422B"/></svg>';
            if (skill.includes('php')) return '<svg viewBox="0 0 256 256" fill="currentColor"><ellipse cx="128" cy="128" rx="128" ry="73" fill="#8993be"/><ellipse cx="128" cy="128" rx="123" ry="68" fill="#fff"/><path d="M152.9 87.5c0 0 0 0 0 0 0 0 0 0 0 0zm0 0c0 0 0 0 0 0 0 0 0 0 0 0z" fill="#8993be"/><path d="M55 114.5c-9.5 0-16.3-1.9-20.3-5.6-4-3.8-6-10.1-6-19 0-8.2 2.2-14.7 6.5-19.3 4.3-4.6 11.4-6.9 21.2-6.9h10.4l-2.5 12.6h-8.9c-4.8 0-8.2 1-10.2 3.1-2 2.1-3 5.6-3 10.6 0 4.4.8 7.5 2.5 9.3 1.7 1.8 4.6 2.7 8.8 2.7h7.9l2.5-12.6h-6.4l2.5-12.6h19.5l-7.5 37.7H55zm85.9 0c-9.5 0-16.3-1.9-20.3-5.6-4-3.8-6-10.1-6-19 0-8.2 2.2-14.7 6.5-19.3 4.3-4.6 11.4-6.9 21.2-6.9h10.4l-2.5 12.6h-8.9c-4.8 0-8.2 1-10.2 3.1-2 2.1-3 5.6-3 10.6 0 4.4.8 7.5 2.5 9.3 1.7 1.8 4.6 2.7 8.8 2.7h7.9l2.5-12.6h-6.4l2.5-12.6h19.5l-7.5 37.7h-16.5zm-47.5 0l7.5-37.7h13.1l-2.5 12.6h10.4c4.8 0 8.2 1 10.2 3.1 2 2.1 3 5.6 3 10.6 0 4.4-.8 7.5-2.5 9.3-1.7 1.8-4.6 2.7-8.8 2.7h-7.9l-2.5 12.6h-13.1l2.5-12.6h-6.4l-2.5 12.6h-13.1z" fill="#8993be"/></svg>';
            if (skill.includes('ruby')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M197.6 197.6L256 256l-58.4-58.4 58.4 58.4zM0 256l58.4-58.4L0 256l58.4-58.4zm256 0L58.4 58.4 256 256zM0 0l197.6 197.6L0 0z" fill="#CC342D"/></svg>';
            if (skill.includes('swift')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M56.9 0h142.2c31.4 0 56.9 25.5 56.9 56.9v142.2c0 31.4-25.5 56.9-56.9 56.9H56.9C25.5 256 0 230.5 0 199.1V56.9C0 25.5 25.5 0 56.9 0z" fill="#F05138"/><path d="M128 220.8c51.2 0 92.8-41.6 92.8-92.8S179.2 35.2 128 35.2 35.2 76.8 35.2 128s41.6 92.8 92.8 92.8z" fill="#fff"/></svg>';
            if (skill.includes('kotlin')) return '<svg viewBox="0 0 256 256" fill="currentColor"><linearGradient id="a"><stop offset="0" stop-color="#1389FD"/><stop offset="1" stop-color="#F77B3D"/></linearGradient><path fill="url(#a)" d="M0 256V0h256L0 256z"/></svg>';

            // Frontend Frameworks
            if (skill.includes('react')) return '<svg viewBox="0 0 256 256" fill="currentColor"><circle cx="128" cy="128" r="25" fill="#61DAFB"/><g stroke="#61DAFB" stroke-width="12" fill="none"><ellipse cx="128" cy="128" rx="110" ry="45"/><ellipse cx="128" cy="128" rx="110" ry="45" transform="rotate(60 128 128)"/><ellipse cx="128" cy="128" rx="110" ry="45" transform="rotate(120 128 128)"/></g></svg>';
            if (skill.includes('vue')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z" fill="#41B883"/><path d="M0 0l128 220.8L256 0h-51.2L128 132.48 50.56 0H0z" fill="#41B883"/><path d="M50.56 0L128 133.12 204.8 0h-47.36L128 51.2 97.92 0H50.56z" fill="#35495E"/></svg>';
            if (skill.includes('angular')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M128 0L0 45.9l19.5 168.4L128 256l108.5-41.7L256 45.9 128 0z" fill="#DD0031"/><path d="M128 0v256l108.5-41.7L256 45.9 128 0z" fill="#C3002F"/><path d="M128 30.3l-89.2 198.1h33.1l18-44.9h76.2l18 44.9h33.1L128 30.3zm0 51.4l28.5 71.1h-57L128 81.7z" fill="#fff"/></svg>';
            if (skill.includes('svelte')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M239.7 114.1c-18.8-30.5-58.8-40.1-89.3-21.3l-43.5 26.7c-12.8 7.9-21.2 21.4-23.1 36.5-1.9 15.1 2.6 30.4 12.3 41.9 6.7 8 15.3 14.3 25.1 18.3-3.4-6.2-5.2-13.2-5.2-20.4 0-11.5 4.7-22.5 12.9-30.3l43.5-26.7c30.5-18.8 70.5-9.2 89.3 21.3 18.8 30.5 9.2 70.5-21.3 89.3l-43.5 26.7c-12.8 7.9-27.8 10.7-42.3 7.9 10.8 3.4 22.3 4.2 33.6 2.3 15.1-2.6 28.9-9.9 39.2-20.8 10.3-10.9 16.8-24.9 18.4-40 1.6-15.1-1.9-30.4-9.9-43.3z" fill="#FF3E00"/><path d="M106.1 270.1c-30.5 18.8-70.5 9.2-89.3-21.3-18.8-30.5-9.2-70.5 21.3-89.3l43.5-26.7c12.8-7.9 27.8-10.7 42.3-7.9-10.8-3.4-22.3-4.2-33.6-2.3-15.1 2.6-28.9 9.9-39.2 20.8-10.3 10.9-16.8 24.9-18.4 40-1.6 15.1 1.9 30.4 9.9 43.3 18.8 30.5 58.8 40.1 89.3 21.3l43.5-26.7c12.8-7.9 21.2-21.4 23.1-36.5 1.9-15.1-2.6-30.4-12.3-41.9-6.7-8-15.3-14.3-25.1-18.3 3.4 6.2 5.2 13.2 5.2 20.4 0 11.5-4.7 22.5-12.9 30.3l-43.5 26.7z" fill="#fff"/></svg>';
            if (skill.includes('next')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128c11.3 0 22.3-1.5 32.8-4.3C201.3 242.5 256 191.2 256 128 256 57.3 198.7 0 128 0z" fill="#000"/><path d="M212.6 224.9L98.5 56.8h-8.4v142.4h16.9v-96.5l97.6 134.2c5.9-3.8 11.5-8 16.8-12.6l-8.8-12.4z" fill="#fff"/><path d="M163.1 56.8h-17v142.4h17V56.8z" fill="#fff"/></svg>';

            // Backend & Databases
            if (skill.includes('node')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm0 240c-61.8 0-112-50.2-112-112S66.2 16 128 16s112 50.2 112 112-50.2 112-112 112z" fill="#539E43"/><path d="M128 48c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80z" fill="#539E43"/></svg>';
            if (skill.includes('express')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M0 128h256v128H0z" fill="#000"/><path d="M50 90l25 40-25 40h20l15-24 15 24h20l-25-40 25-40h-20l-15 24-15-24H50z" fill="#fff"/></svg>';
            if (skill.includes('mongodb') || skill.includes('mongo')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M175.6 123.6c-12.8-46.8-35.2-66.4-42.4-75.2-1.6-2.4-3.2-4-4-5.6-.8 1.6-2.4 3.2-4 5.6-7.2 8.8-29.6 28.4-42.4 75.2-14.4 52.8 8 95.2 42.4 108 1.6.8 3.2.8 4.8 0 34.4-12.8 56.8-55.2 42.4-108z" fill="#10AA50"/><path d="M128 256c-1.6 0-3.2-.8-4.8-1.6-34.4-12.8-56.8-55.2-42.4-108 12.8-46.8 35.2-66.4 42.4-75.2 1.6-2.4 3.2-4 4-5.6.8 1.6 2.4 3.2 4 5.6 7.2 8.8 29.6 28.4 42.4 75.2 14.4 52.8-8 95.2-42.4 108-1.6.8-3.2 1.6-4.8 1.6z" fill="#B8C4C2"/><path d="M128 224c-1.6 0-3.2-.8-4.8-1.6-28-10.4-46.4-45.6-34.4-88 10.4-38.4 28.8-54.4 34.4-61.6 1.6-2.4 3.2-4 4-5.6.8 1.6 2.4 3.2 4 5.6 5.6 7.2 24 23.2 34.4 61.6 12 42.4-6.4 77.6-34.4 88-1.6.8-3.2 1.6-4.8 1.6z" fill="#12924F"/></svg>';
            if (skill.includes('mysql')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M235.6 194.4c-10.4 0-18.4 2.4-24.8 7.2-1.6 1.6-4 4-4 6.4 0 1.6.8 3.2 2.4 4 4.8 2.4 11.2 4 17.6 4 16.8 0 28-8 28-20 0-8.8-6.4-14.4-16-14.4-1.6 0-2.4.8-3.2.8zm-64-8c-4.8 0-8.8 1.6-12 4.8-3.2 3.2-4.8 7.2-4.8 12s1.6 8.8 4.8 12c3.2 3.2 7.2 4.8 12 4.8s8.8-1.6 12-4.8c3.2-3.2 4.8-7.2 4.8-12s-1.6-8.8-4.8-12c-3.2-3.2-7.2-4.8-12-4.8z" fill="#00758F"/></svg>';
            if (skill.includes('postgresql') || skill.includes('postgres')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M177.6 15.2c-18.4 0-33.6 6.4-44.8 19.2-11.2-12.8-26.4-19.2-44.8-19.2C39.2 15.2 0 54.4 0 103.2v49.6c0 48.8 39.2 88 88 88 18.4 0 33.6-6.4 44.8-19.2 11.2 12.8 26.4 19.2 44.8 19.2 48.8 0 88-39.2 88-88v-49.6c0-48.8-39.2-88-88-88z" fill="#336791"/></svg>';
            if (skill.includes('redis')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M245.5 169.6l-53.3 21.3-64-25.6-74.7 29.9-53.5-21.3v42.7l53.5 21.3 74.7-29.9 64 25.6 53.3-21.3v-42.7z" fill="#A41E11"/><path d="M245.5 126.9l-53.3 21.3-64-25.6-74.7 29.9-53.5-21.3v42.7l53.5 21.3 74.7-29.9 64 25.6 53.3-21.3v-42.7z" fill="#D82C20"/><path d="M245.5 84.3l-53.3 21.3-64-25.6L53.5 110 0 88.7v42.7l53.5 21.3 74.7-29.9 64 25.6 53.3-21.3V84.3z" fill="#A41E11"/></svg>';
            if (skill.includes('firebase')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M93.2 0L50.7 89.6 73.6 51.2 93.2 0z" fill="#FFA000"/><path d="M93.2 0l42.5 89.6L116.8 51.2 93.2 0z" fill="#F57F17"/><path d="M50.7 89.6L0 256l128-73.6-77.3-92.8z" fill="#FFCA28"/><path d="M256 256L128 182.4l77.3-92.8L256 256z" fill="#FFA000"/></svg>';

            // CSS & Styling
            if (skill.includes('css')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M0 0h256v256H0V0zm41.2 23.1l14.4 161.5L127.9 209l72.5-24.3 14.4-161.5H41.2z" fill="#1572B6"/><path d="M128 39.9v169.4l58.5-19.6 11.9-133.3H128z" fill="#33A9DC"/></svg>';
            if (skill.includes('sass') || skill.includes('scss')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M220.5 109.7c-5.9 0-11.1 1.4-15.4 3.7-2.8-5.6-5.6-10.5-6.1-14.1-.6-4.2-1.2-6.8-.5-11.8.7-5 3.8-12.1 3.7-12.6-.1-.5-.6-3-6.2-3.1-5.6-.1-10.4.6-11 1.4-.6.8-1.8 2.6-2.5 4.5-1 2.8-11.5 26.3-17.5 37-1.9-3.7-3.5-7-3.8-9.6-.6-4.2-1.2-6.8-.5-11.8.7-5 3.8-12.1 3.7-12.6-.1-.5-.6-3-6.2-3.1-5.6-.1-10.4.6-11 1.4-.6.8-1.2 2.7-2.5 4.5-1.3 1.8-16.5 37.6-20.5 46.4-2 4.5-3.7 8.1-5 10.5 0 0-.1.2-.3.6-.9 2-1.5 3.1-1.5 3.1v.1c-.7 1.3-1.5 2.5-1.9 2.5-.3 0-.8-3.5.1-8.3 1.9-10.1 6.4-25.9 6.4-26.4 0-.3.8-2.8-2.8-4.1-3.5-1.3-4.8.9-5.1.9-.3 0-.5.7-.5.7s3.7-15.5-7.1-15.5c-6.7 0-16 7.4-20.6 14.1-2.9 1.6-9.1 5-15.7 8.6-2.5 1.4-5.1 2.8-7.5 4.1-.2-.2-.3-.4-.5-.6C9.4 73.9-2.9 50.4 1.3 35.5c1.5-5.4 6.1-19.6 36.5-36.8C61.5-14.6 84.6-9.3 90.5-1.3c8.4 11.5-18.2 32.9-62.3 36-16.8 1.2-25.7-2.9-27.9-4.4-2.3-1.6-2.6-1.7-3.5-1.4-1.4.5-.5 1.9 0 2.7 1.3 2.1 6.6 5.8 15.7 7.6 8 1.6 27.5 2.5 51.1-3.1 26.3-6.2 46.8-23.4 51.3-44.9 5.1-24.3-18.2-40.6-49.6-39.5C41.1-46.5 17.6-37.1 1.9-23.2c-18.7 16.6-21.7 31.1-20.5 37.2 4.3 21.9 35 36.2 47.3 46.8-.6.3-1.2.7-1.8 1-6.5 3.2-31.3 16.2-37.5 29.9-7 15.5 1.1 26.6 6.5 28.1 16.7 4.7 33.9-3.8 43.1-17.8s8.2-32.6 3.9-41.1c-.1-.2-.2-.4-.3-.6 2-1.2 4-2.4 6-3.5 3.7-2.1 7.3-4.1 10.5-5.9-1.8 4.9-3.1 10.7-3.8 19.1-.8 10 3.3 23 8.7 28.1 2.4 2.2 5.2 2.2 7 2.2 6.2 0 9-5.2 12.1-11.4 3.8-7.5 7.2-16.3 7.2-16.3s-4.2 23.4 6.5 23.4c3.9 0 7.8-5.1 9.6-7.7v.1s.1-.2.3-.5c.4-.6.6-1 .6-1v-.1c1.6-2.8 5.1-9 10.4-19.3 6.8-13.3 13.4-30 13.4-30 .6 2.3 2.5 9.6 5.8 16.4 2 4.1 6.2 8.6 9.5 11.1-.5.7-1 1.4-1.4 2.1-5 6.4-11 13.7-11.8 15.8-1 2.5-.7 4.3 1.2 5.8 1.4 1.1 3.8 1.3 6.3 1.1 4.5-.4 7.7-1.7 9.3-2.5 2.5-.9 5.4-2.4 8.1-4.5 5-3.8 8-9.3 7.7-16.5-.2-4-1.4-8-3-11.8 1.2-1.7 2.4-3.5 3.6-5.3 6.3-9.3 11.1-19.5 11.1-19.5.6 2.3 2.5 9.6 5.8 16.4 1.6 3.4 5 7.1 8.1 9.8-13.1 10.6-21.2 23-24.1 31.1-5.4 15.1-.8 21.9 4.5 23.5 2.4.7 5.8-1 8.3-2.7 2.6-1 5.7-2.6 8.6-5 5-3.8 9.8-9.1 9.5-16.3-.1-3.3-.9-6.6-2.1-9.7 6.2-2.6 14.3-4 24.6-2.8 22.2 2.5 26.6 16.1 25.8 21.8-.8 5.7-5.2 8.8-6.7 9.8-1.5.9-2 1.2-1.8 1.9.2 1 .9 1 2.2.8 1.8-.3 11.2-4.5 11.6-14.8.6-13-11.9-27.3-33.9-27.1z" fill="#CD6799"/></svg>';
            if (skill.includes('tailwind')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M128 0C93.8 0 72.1 17.2 64 51.5c12.8-17.2 27.7-23.6 44.6-19.3 9.7 2.4 16.7 9.4 24.4 17.2 12.5 12.7 27 27.5 58.6 27.5 34.2 0 55.9-17.2 64-51.5-12.8 17.2-27.7 23.6-44.6 19.3-9.7-2.4-16.7-9.4-24.4-17.2C173.1 14.8 158.6 0 128 0zM64 76.8C29.8 76.8 8.1 94 0 128.3c12.8-17.2 27.7-23.6 44.6-19.3 9.7 2.4 16.7 9.4 24.4 17.2 12.5 12.7 27 27.5 58.6 27.5 34.2 0 55.9-17.2 64-51.5-12.8 17.2-27.7 23.6-44.6 19.3-9.7-2.4-16.7-9.4-24.4-17.2C109.1 91.6 94.6 76.8 64 76.8z" fill="#06B6D4"/></svg>';
            if (skill.includes('bootstrap')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M0 222.991C0 241.223 14.779 256 33.009 256H222.99C241.223 256 256 241.221 256 222.991V33.01C256 14.777 241.221 0 222.991 0H33.01C14.777 0 0 14.779 0 33.009V222.99z" fill="#563D7C"/><path d="M106.158 113.238V76.985h31.911c3.04 0 5.97.253 8.792.76 2.822.506 5.319 1.41 7.49 2.713 2.17 1.303 3.907 3.112 5.21 5.427 1.302 2.316 1.954 5.283 1.954 8.9 0 6.513-1.954 11.217-5.862 14.111-3.907 2.895-8.9 4.342-14.979 4.342h-34.516zM72.075 50.5v155h75.112c6.947 0 13.713-.868 20.298-2.605 6.585-1.737 12.446-4.414 17.584-8.032 5.137-3.618 9.226-8.286 12.265-14.002 3.04-5.717 4.559-12.483 4.559-20.298 0-9.697-2.352-17.982-7.055-24.856-4.704-6.875-11.832-11.687-21.384-14.437 6.947-3.328 12.194-7.598 15.74-12.808 3.545-5.21 5.318-11.722 5.318-19.538 0-7.236-1.194-13.314-3.582-18.235-2.388-4.92-5.753-8.864-10.095-11.831-4.341-2.967-9.551-5.102-15.63-6.404-6.078-1.303-12.808-1.954-20.189-1.954H72.075zm34.083 128.515v-42.549h37.121c7.381 0 13.315 1.7 17.802 5.102 4.486 3.401 6.73 9.081 6.73 17.041 0 4.053-.688 7.381-2.063 9.986-1.375 2.605-3.22 4.668-5.536 6.187-2.315 1.52-4.993 2.605-8.032 3.257-3.04.65-6.223.976-9.552.976h-36.47z" fill="#FFF"/></svg>';

            // Tools & Platforms
            if (skill.includes('git')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M251.2 117.5L138.5 4.8c-6.4-6.4-16.8-6.4-23.2 0L92.3 27.9l29.3 29.3c6.8-2.3 14.6-.8 20 4.6 5.4 5.4 6.9 13.3 4.5 20.1l28.2 28.2c6.8-2.4 14.7-.9 20.1 4.5 7.6 7.6 7.6 19.9 0 27.5s-19.9 7.6-27.5 0c-5.7-5.7-7.1-14-4.2-21l-26.3-26.3v69.3c1.9.9 3.6 2.2 5.2 3.8 7.6 7.6 7.6 19.9 0 27.5s-19.9 7.6-27.5 0-7.6-19.9 0-27.5c1.9-1.9 4.1-3.3 6.4-4.2V94.5c-2.3-.9-4.5-2.3-6.4-4.2-5.7-5.7-7.2-14.1-4.3-21.2L80.4 39.8 4.8 115.3c-6.4 6.4-6.4 16.8 0 23.2l112.7 112.7c6.4 6.4 16.8 6.4 23.2 0l112.2-112.2c6.5-6.4 6.5-16.8.3-23.2z" fill="#F05032"/></svg>';
            if (skill.includes('docker')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M27.3 106.1h23.4v21.9H27.3v-21.9zm26.5 0H77v21.9H53.8v-21.9zm26.6 0h23.2v21.9H80.4v-21.9zm26.5 0h23.3v21.9h-23.3v-21.9zm26.6 0h23.3v21.9h-23.3v-21.9zM80.4 79.5h23.2v21.9H80.4V79.5zm26.5 0h23.3v21.9h-23.3V79.5zm26.6 0h23.3v21.9h-23.3V79.5zM80.4 53h23.2v21.9H80.4V53zm26.5 0h23.3v21.9h-23.3V53zm79.5 70.6c-5.2-3.1-17.3-4.3-26.4-2.9-2.1-15.2-10.7-28.5-25.6-40l-5.2-3.4-3.5 5.1c-6.9 10.2-9.8 26.6-3.5 39.6-3.9 2.2-11.9 5.4-22.3 5.2H.8l-.4 2.2c-1.5 11.6.2 26.8 8.1 37.8 6.7 9.3 16.7 14.1 29.8 14.1 56.6 0 98.5-25.9 118.1-72.9 7.7.2 24.3.1 32.8-16.2.2-.4.7-1.4 2.2-4.7l.8-1.8-4.8-3z" fill="#0DB7ED"/></svg>';
            if (skill.includes('kubernetes') || skill.includes('k8s')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M128 0L25.6 48v160l102.4 48 102.4-48V48L128 0zm0 230.4L51.2 192V64L128 25.6 204.8 64v128l-76.8 38.4z" fill="#326CE5"/></svg>';
            if (skill.includes('aws')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M72.3 186.1c0 6.8-1.5 11.8-4.4 15.1-2.9 3.3-7.2 4.9-12.8 4.9-2.6 0-4.9-.2-7-.7v-5.3c1.6.4 3.4.6 5.4.6 3.3 0 5.8-1 7.5-3.1 1.7-2.1 2.6-5.2 2.6-9.4v-36.7h8.7v34.6zm-8.7-49.4h-8.7v-7.9h8.7v7.9z" fill="#FF9900"/><path d="M128 230.4c-56.6 0-102.4-45.8-102.4-102.4S71.4 25.6 128 25.6 230.4 71.4 230.4 128 184.6 230.4 128 230.4zm0-192c-49.4 0-89.6 40.2-89.6 89.6s40.2 89.6 89.6 89.6 89.6-40.2 89.6-89.6-40.2-89.6-89.6-89.6z" fill="#FF9900"/></svg>';
            if (skill.includes('azure')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M0 0h256v256H0z" fill="#0089D6"/><path d="M89.6 140.8L128 256l76.8-38.4-115.2-76.8z" fill="#50E6FF"/><path d="M89.6 140.8L0 192l89.6-51.2z" fill="#0078D4"/><path d="M128 0l-38.4 140.8L204.8 192 128 0z" fill="#50E6FF"/></svg>';
            if (skill.includes('gcp') || skill.includes('google cloud')) return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M128 0L25.6 48v160l102.4 48 102.4-48V48L128 0z" fill="#4285F4"/></svg>';

            // Default icon for unknown skills
            return '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path></svg>';
        };

        if (portfolio.skills && portfolio.skills.length > 0) {
            let container = skillsContainer.length ? skillsContainer : skillsHeader.next('div');

            if (container.length) {
                container.empty();
                const skillsHTML = portfolio.skills.map((skill: any) => {
                    const skillName = typeof skill === 'string' ? skill : (skill.name || skill);
                    const icon = getSkillIcon(skillName);
                    // Neutral styling that adapts to template theme
                    return `
                        <div class="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 px-4 py-3 min-w-[140px] backdrop-blur-sm">
                            <div class="w-5 h-5 opacity-80">
                                ${icon}
                            </div>
                            <span class="font-semibold">${skillName}</span>
                        </div>
                    `;
                }).join('');
                container.html(`<div class="flex flex-wrap gap-3 px-4">${skillsHTML}</div>`);
            }
        } else {
            skillsHeader.remove();
            if (skillsContainer.length) skillsContainer.remove();
        }

        // Certifications
        const certificationsHeader = $('#portfolio-certifications-header, h2:contains("Certifications")');
        const certificationsContainer = $('#portfolio-certifications');

        if (portfolio.certifications && portfolio.certifications.length > 0) {
            let container = certificationsContainer.length ? certificationsContainer : certificationsHeader.next('div');

            if (container.length) {
                container.empty();
                const certificationsHTML = portfolio.certifications.map((cert: string) => {
                    // Neutral styling that adapts to any template theme
                    return `
                        <div class="flex items-center gap-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 min-w-[180px]">
                            <div class="opacity-70">
                                <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px"><path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                            </div>
                            <span class="font-semibold">${cert}</span>
                        </div>
                    `;
                }).join('');
                container.html(`<div class="flex flex-wrap gap-3 px-4">${certificationsHTML}</div>`);
            }
        } else {
            certificationsHeader.remove();
            if (certificationsContainer.length) certificationsContainer.remove();
        }

        // Education (Insert dynamically if not present)
        const eduHeader = $('h2:contains("Education")');
        if (portfolio.education && portfolio.education.length > 0 && eduHeader.length === 0) {
            // Use neutral styling that works across all templates
            const educationHTML = `
                <div class="education-section px-4 py-8">
                    <h2 class="text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">Education</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${portfolio.education.map((edu: any) => `
                            <div class="p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm">
                                <h3 class="text-lg font-bold">${edu.degree}</h3>
                                <p class="font-medium text-lg opacity-80">${edu.institution}</p>
                                <p class="text-sm mt-1 opacity-70">${edu.fieldOfStudy}</p>
                                <p class="text-xs mt-3 font-mono uppercase tracking-widest opacity-60">${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Insert before Projects section (moved from bottom to appear earlier)
            const projectsHeaders = $('#portfolio-projects-header, h2:contains("Featured Projects"), h2:contains("Selected Work"), h2:contains("Projects")');
            if (projectsHeaders.length) {
                projectsHeaders.first().closest('section, div.flex.flex-col, div[class*="py-"]').before(educationHTML);
            } else {
                // Fallback: insert in main content area
                $('.layout-content-container, main, body').append(educationHTML);
            }
        }

        // Email
        if (portfolio.publicEmail) {
            $('input[type="text"][placeholder*="email"], input[type="email"]').val(portfolio.publicEmail);
            $('#portfolio-email, #social-email, a[href^="mailto:"]').attr('href', `mailto:${portfolio.publicEmail}`);
        }

        // Check for download query param
        const url = new URL(request.url);
        const isDownload = url.searchParams.get('download') === 'true';

        const headers: Record<string, string> = {
            'Content-Type': 'text/html',
        };

        if (isDownload) {
            headers['Content-Disposition'] = `attachment; filename="${username}-portfolio.html"`;
        }

        return new NextResponse($.html(), {
            headers: headers,
        });

    } catch (error) {
        console.error('Error generating portfolio:', error);
        return new NextResponse(`Error: ${error}`, { status: 500 });
    }
}
