'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase'; // Ensure this exports initialized 'db'
import { collection, query, where, getDocs } from 'firebase/firestore';
import TemplateRenderer from '@/components/templates/template-renderer';
import { PortfolioData } from '@/types';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function PublicPortfolioPage() {
    const params = useParams();
    const username = params?.username as string;

    // Explicitly define state types
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!username) return;

            try {
                // Query the 'portfolios' collection where 'username' field matches the URL param
                const q = query(
                    collection(db, 'portfolios'),
                    where('username', '==', username)
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Assuming username is unique, take the first match
                    const docData = querySnapshot.docs[0].data() as PortfolioData;
                    setData(docData);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching portfolio:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [username]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-4">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-lg text-gray-600">Portfolio not found for "{username}"</p>
            </div>
        );
    }

    return <TemplateRenderer template={data.template || 'minimal'} data={data} />;
}
