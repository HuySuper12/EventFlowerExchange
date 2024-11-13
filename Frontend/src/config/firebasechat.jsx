// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseChatConfig = {
  apiKey: "AIzaSyA_lyM38WC8AU6dIOaWP5RJ26FSSHj3Zsk",
  authDomain: "event-flower-exchange-chat.firebaseapp.com",
  projectId: "event-flower-exchange-chat",
  storageBucket: "event-flower-exchange-chat.firebasestorage.app",
  messagingSenderId: "922067682736",
  appId: "1:922067682736:web:e3e4e2f8061a997acc8275",
  measurementId: "G-B8L84Y6F0F",
};

const chatApp = !getApps().some(app => app.name === "chatApp")
  ? initializeApp(firebaseChatConfig, "chatApp")
  : getApps().find(app => app.name === "chatApp");

const authChat = getAuth(chatApp);
const dbChat = getFirestore(chatApp);

export { authChat, dbChat };
