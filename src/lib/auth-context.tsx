'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    User as FirebaseUser,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, db, dbRT } from './firebase';
import { doc, getDoc, setDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { ref, push, set } from 'firebase/database';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    zestId?: string;
    role: string;
    createdAt: any;
}

interface AuthContextType {
    user: FirebaseUser | null;
    profile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
    isProcessingGoogleLogin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    signUpWithEmail: async () => { },
    signOut: async () => { },
    isProcessingGoogleLogin: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessingGoogleLogin, setIsProcessingGoogleLogin] = useState(false);

    // Generate Zest ID with transaction
    const generateZestId = async () => {
        return await runTransaction(db, async (transaction) => {
            const counterRef = doc(db, "counters", "users");
            const counterDoc = await transaction.get(counterRef);
            const newCount = (counterDoc.exists() ? counterDoc.data().count : 0) + 1;

            const zestId = `ZU${newCount.toString().padStart(4, '0')}`;

            transaction.set(counterRef, { count: newCount }, { merge: true });
            return zestId;
        });
    };

    const logActivity = async (action: string, profileData: any) => {
        try {
            const logsRef = ref(dbRT, 'registration_logs');
            const newLogRef = push(logsRef);
            const message = `[${profileData.displayName} + ${profileData.zestId}] ${action} from zestfolio.`;

            await set(newLogRef, {
                message,
                timestamp: Date.now(),
                uid: profileData.uid,
                zestId: profileData.zestId,
                action: action.toLowerCase()
            });
        } catch (error) {
            console.error('Logging error:', error);
        }
    };

    const fetchProfile = async (uid: string) => {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
            return docSnap.data() as UserProfile;
        }
        return null;
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setIsProcessingGoogleLogin(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            // Check if profile exists
            let userProfile = await fetchProfile(firebaseUser.uid);

            if (!userProfile) {
                // New User Flow
                const zestId = await generateZestId();
                const newProfile: UserProfile = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    displayName: firebaseUser.displayName || '',
                    photoURL: firebaseUser.photoURL || '',
                    zestId: zestId,
                    role: 'student',
                    createdAt: serverTimestamp(),
                };

                await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
                setProfile(newProfile);

                // Log New User
                await logActivity('REGISTERED_GOOGLE', newProfile);

                // Signal that a new user was created
                if (typeof window !== 'undefined') {
                    (window as any).__NEW_USER_CREATED__ = true;
                }
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            throw error;
        } finally {
            setIsProcessingGoogleLogin(false);
        }
    };

    const signInWithEmail = async (email: string, pass: string) => {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        try {
            const result = await signInWithEmailAndPassword(auth, email, pass);
            await fetchProfile(result.user.uid);
        } catch (error) {
            console.error('Email Sign-In Error:', error);
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, pass: string, name: string) => {
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        try {
            const result = await createUserWithEmailAndPassword(auth, email, pass);
            const firebaseUser = result.user;

            await updateProfile(firebaseUser, { displayName: name });

            const zestId = await generateZestId();
            const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: email,
                displayName: name,
                zestId: zestId,
                role: 'student',
                createdAt: serverTimestamp(),
            };

            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setProfile(newProfile);

            // Log New User
            await logActivity('REGISTERED_EMAIL', newProfile);

            if (typeof window !== 'undefined') {
                (window as any).__NEW_USER_CREATED__ = true;
            }
        } catch (error) {
            console.error('Email Sign-Up Error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setProfile(null);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await fetchProfile(firebaseUser.uid);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            signInWithGoogle,
            signInWithEmail,
            signUpWithEmail,
            signOut,
            isProcessingGoogleLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
