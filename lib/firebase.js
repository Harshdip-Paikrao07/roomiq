import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC3wBC3Z7KQKCIbAQMcae_nLMtETIkgsew",
  authDomain: "roomiq-6360f.firebaseapp.com",
  databaseURL: "https://roomiq-6360f-default-rtdb.firebaseio.com",
  projectId: "roomiq-6360f",
  storageBucket: "roomiq-6360f.firebasestorage.app",
  messagingSenderId: "626667416535",
  appId: "1:626667416535:web:9ea9d1fbf153d8b08c7992"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);