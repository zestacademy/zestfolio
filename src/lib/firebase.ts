import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAGng4_qT_Ot5EvCMnyU8DNYeERh4NarnY",
    authDomain: "zestfolio-247.firebaseapp.com",
    projectId: "zestfolio-247",
    storageBucket: "zestfolio-247.firebasestorage.app",
    messagingSenderId: "385796648663",
    appId: "1:385796648663:web:cbbca9d4171e1f024f0a92",
    measurementId: "G-FCK6W9QV7X"
};

// Initialize Firebase (Singleton pattern to prevent re-initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then(supported => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { analytics };
