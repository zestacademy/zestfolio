export interface SocialLinks {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    [key: string]: string | undefined;
}

export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string; // "Present" if undefined? or string "Present"
    current?: boolean;
    description?: string;
}

export interface Project {
    title: string;
    description: string;
    technologies: string[];
    link?: string; // Live Demo
    repoLink?: string; // GitHub
    imageUrl?: string;
}

export interface Certification {
    name: string;
    issuer: string;
    date: string;
    link?: string;
}

export interface Achievement {
    title: string;
    description: string;
    date?: string;
}

export interface PortfolioData {
    // Mandatory Fields
    username?: string; // Unique identifier for URL
    template?: 'minimal' | 'modern';
    fullName: string;
    professionalTitle: string; // e.g. "EEE Student | Web Developer"
    aboutMe: string; // Short Bio
    domain: string; // e.g. "Web Development", "AI/ML"
    email: string;
    publicEmail?: string;

    // Collections
    skills: string[];
    education: Education[];
    projects: Project[];
    socialLinks: SocialLinks;

    // Optional Fields
    profilePhotoUrl?: string;
    resumeUrl?: string;
    certifications?: Certification[];
    achievements?: Achievement[];
    blogs?: { title: string; link: string; date?: string }[];
}
