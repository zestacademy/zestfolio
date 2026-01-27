import { PortfolioData } from '@/types';

export const mockPortfolioData: PortfolioData = {
    fullName: "Alex Rivera",
    professionalTitle: "Creative Frontend Engineer",
    aboutMe: "I build accessible, pixel-perfect web experiences. passionate about UI/UX and modern frontend architecture. Currently studying Computer Science at Zest Academy.",
    domain: "Web Development",
    email: "alex@example.com",
    publicEmail: "alex.dev@gmail.com",
    socialLinks: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
    },
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Figma", "PostgreSQL"],
    education: [
        {
            institution: "Zest Academy",
            degree: "B.Tech",
            fieldOfStudy: "Computer Science",
            startDate: "2022",
            endDate: "2026",
            current: true,
        },
        {
            institution: "Generic High School",
            degree: "High School Diploma",
            fieldOfStudy: "Science",
            startDate: "2020",
            endDate: "2022",
        }
    ],
    projects: [
        {
            title: "Nebula Dashboard",
            description: "A comprehensive analytics dashboard for SaaS platforms. Features real-time data visualization, user management, and dark mode support.",
            technologies: ["React", "Recharts", "Firebase"],
            link: "https://example.com",
            repoLink: "https://github.com",
        },
        {
            title: "TaskFlow CLI",
            description: "A command-line interface tool for developer task management. Written in Rust for maximum performance and reliability.",
            technologies: ["Rust", "Clap", "SQLite"],
            repoLink: "https://github.com",
        }
    ]
};
