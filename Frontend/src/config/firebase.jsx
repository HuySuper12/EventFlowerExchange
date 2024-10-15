// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1SJ7q32R5QU0ttr2SituwtAoTyZgOzkM",
  authDomain: "event-flower-exchange.firebaseapp.com",
  projectId: "event-flower-exchange",
  storageBucket: "event-flower-exchange.appspot.com",
  messagingSenderId: "843171396067",
  appId: "1:843171396067:web:e7bd632027b06cd36148d6",
  measurementId: "G-1VK8G2QMW5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
