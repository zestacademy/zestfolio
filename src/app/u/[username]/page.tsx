'use client';

import { use, useEffect, useState } from 'react';

export default function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                // Fetch the generated HTML from our robust API route
                const response = await fetch(`/api/portfolio/${username}`);
                if (response.ok) {
                    const html = await response.text();
                    setHtmlContent(html);
                } else {
                    console.error('Failed to load portfolio');
                }
            } catch (error) {
                console.error('Error fetching portfolio:', error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchPortfolio();
        }
    }, [username]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!htmlContent) {
        return <div className="text-white text-center pt-20">Portfolio not found</div>;
    }

    // Render the raw HTML from the API
    return (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
}
