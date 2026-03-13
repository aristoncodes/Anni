import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAIn-ehRWPPLeecMaGkdTiLDEDooefhyyI",
    authDomain: "jimjam-e86c0.firebaseapp.com",
    databaseURL: "https://jimjam-e86c0-default-rtdb.firebaseio.com",
    projectId: "jimjam-e86c0",
    storageBucket: "jimjam-e86c0.firebasestorage.app",
    messagingSenderId: "656856742051",
    appId: "1:656856742051:web:65d701e254ded95ea86716",
    measurementId: "G-C1BN5DZKS0"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
