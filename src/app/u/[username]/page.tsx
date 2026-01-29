'use client';

import { use } from 'react';

export default function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);

    // Use an iframe to render the complete HTML document 
    // This allows the portfolio to have its own <html>, <head>, <body> context
    // preserving all styles, scripts, and layout attributes correctly.
    return (
        <iframe
            src={`/api/portfolio/${username}`}
            className="w-full h-screen border-none block"
            title={`${username}'s Portfolio`}
            // Use dark background to prevent white flash
            style={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 0,
                backgroundColor: '#111'
            }}
        />
    );
}
