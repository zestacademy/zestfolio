export interface Template {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    features: string[];
}

export const PORTFOLIO_TEMPLATES: Template[] = [
    {
        id: 'template01',
        name: 'Modern Professional',
        description: 'A clean and professional design suitable for corporate portfolios.',
        thumbnail: '/images/templates/template01.png',
        features: ['Professional Header', 'Skills Grid', 'Experience Timeline']
    },
    {
        id: 'template02',
        name: 'Creative Dark',
        description: 'A dark-themed template perfect for designers and artists.',
        thumbnail: '/images/templates/template02.png',
        features: ['Dark Mode', 'Gallery View', 'Project Spotlight']
    },
    {
        id: 'template03',
        name: 'Minimalist One',
        description: 'Less is more. A simple, elegant single-page portfolio.',
        thumbnail: '/images/templates/template03.png',
        features: ['Minimal Design', 'Fast Loading', 'Focus on Typography']
    },
    {
        id: 'template04',
        name: 'Developer Blue',
        description: 'Tailored for software developers with code-block aesthetics.',
        thumbnail: '/images/templates/template04.png',
        features: ['Tech Stack Ions', 'GitHub Integration Style', 'Project Cards']
    },
    {
        id: 'template05',
        name: 'Vibrant Studio',
        description: 'Colorful and dynamic, great for creative agencies.',
        thumbnail: '/images/templates/template05.png',
        features: ['Bold Colors', 'Large Typography', 'Interactive Elements']
    },
    {
        id: 'template06',
        name: 'Academic Focus',
        description: 'Structured layout ideal for researchers and academics.',
        thumbnail: '/images/templates/template06.png',
        features: ['Publication List', 'Research Areas', 'CV Download']
    },
    {
        id: 'template07',
        name: 'Freelancer Bold',
        description: 'Make a statement with high-contrast design and large visuals.',
        thumbnail: '/images/templates/template07.png',
        features: ['Testimonials', 'Service Pricing', 'Call to Action']
    },
    {
        id: 'template08',
        name: 'Tech Startup',
        description: 'Modern SaaS-like aesthetic for product-focused portfolios.',
        thumbnail: '/images/templates/template08.png',
        features: ['Feature Grid', 'Modern Gradients', 'Clean Layout']
    },
    {
        id: 'template09',
        name: 'Content Creator',
        description: 'Video and image heavy design for content producers.',
        thumbnail: '/images/templates/template09.png',
        features: ['Social Media Integration', 'Video Embeds', 'Blog Section']
    }
];
