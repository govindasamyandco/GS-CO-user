import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
    apiKey: "AIzaSyDvjfa-nhsPwYGUn1BcAv6ukXiFwmaa9ks",
    authDomain: "govindasamyandco.firebaseapp.com",
    projectId: "govindasamyandco",
    storageBucket: "govindasamyandco.firebasestorage.app",
    messagingSenderId: "154816426732",
    appId: "1:154816426732:web:9bc68ca9632db51c2dabc9",
    measurementId: "G-T98D4GNX9V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize App Check for Domain & Bot Protection if site key present
if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6Ld_PUBLIC_SITE_KEY_HERE'),
      isTokenAutoRefreshEnabled: true
    });
  } catch (err) {
    console.warn("App Check initialization notice:", err.message);
  }
}

export { collection, onSnapshot, addDoc, serverTimestamp };
export default app;
