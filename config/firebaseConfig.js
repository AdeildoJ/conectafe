// config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwGzN245CNDvio5AoHgKXBkBYpOb7BHkw",
  authDomain: "conectafe-17f16.firebaseapp.com",
  projectId: "conectafe-17f16",
  storageBucket: "conectafe-17f16.appspot.com", // ✅ corrigido
  messagingSenderId: "577255371725",
  appId: "1:577255371725:web:7e8aed092cd402db16ca84",
  measurementId: "G-N714ZNPN2R"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

