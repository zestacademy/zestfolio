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
        name: 'Neon Terminal',
        description: 'Cyberpunk-inspired design with neon green accents and terminal aesthetics.',
        thumbnail: '/images/templates/template01.png',
        features: ['Terminal Style', 'Neon Accents', 'Dark Theme', 'Tech-Focused']
    },
    {
        id: 'template02',
        name: 'Elegant Serif',
        description: 'Professional serif typography with emerald green highlights and sophisticated layout.',
        thumbnail: '/images/templates/template02.png',
        features: ['Serif Typography', 'Emerald Theme', 'Professional', 'Classic Design']
    },
    {
        id: 'template03',
        name: 'Dark Glassmorphism',
        description: 'Modern dark theme with frosted glass effects and indigo color scheme.',
        thumbnail: '/images/templates/template03.png',
        features: ['Glassmorphism', 'Dark Indigo', 'Modern UI', 'Blur Effects']
    },
    {
        id: 'template04',
        name: 'Professional Blue',
        description: 'Clean professional design with blue accents, perfect for corporate portfolios.',
        thumbnail: '/images/templates/template04.png',
        features: ['Blue Theme', 'Corporate', 'Spinning Badge', 'Premium Look']
    },
    {
        id: 'template05',
        name: 'Industrial Amber',
        description: 'Industrial-inspired design with amber/yellow highlights and bold typography.',
        thumbnail: '/images/templates/template05.png',
        features: ['Amber Yellow', 'Bold Typography', 'Industrial', 'Dark Background']
    },
    {
        id: 'template06',
        name: 'Systems Engineer',
        description: 'Dark professional template with emerald and gold accents for technical portfolios.',
        thumbnail: '/images/templates/template06.png',
        features: ['Emerald & Gold', 'Technical Focus', 'Glass Panels', 'Modern Serif']
    },
    {
        id: 'template07',
        name: 'Creative Portfolio',
        description: 'Vibrant and creative design perfect for designers and creative professionals.',
        thumbnail: '/images/templates/template07.png',
        features: ['Creative Design', 'Bold Colors', 'Portfolio Focus', 'Modern Layout']
    },
    {
        id: 'template08',
        name: 'Minimal Clean',
        description: 'Ultra-minimal clean design focusing on content with excellent typography.',
        thumbnail: '/images/templates/template08.png',
        features: ['Minimal Design', 'Clean Layout', 'Typography Focus', 'White Space']
    },
    {
        id: 'template09',
        name: 'Dynamic Gradient',
        description: 'Modern design with dynamic gradients and contemporary aesthetic.',
        thumbnail: '/images/templates/template09.png',
        features: ['Gradient Design', 'Modern Look', 'Dynamic Colors', 'Contemporary']
    }
];
