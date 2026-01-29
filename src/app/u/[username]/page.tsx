
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ username: string }>;
};

// 1. Generate Metadata (Title & Favicon)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params;

    // Fetch user data to populate title and icon
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(portfoliosRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return {
            title: 'Portfolio Not Found'
        };
    }

    const data = querySnapshot.docs[0].data();
    const fullName = data.fullName || username;
    const title = data.professionalTitle || `Portfolio of ${fullName}`;
    const profilePhoto = data.profilePhoto;

    return {
        title: fullName,
        description: title,
        icons: profilePhoto ? {
            icon: profilePhoto,
            shortcut: profilePhoto,
            apple: profilePhoto,
        } : undefined,
    };
}

// 2. Server Component
export default async function PortfolioPage({ params }: Props) {
    const { username } = await params;

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
