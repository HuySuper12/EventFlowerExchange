import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseStorageConfig = {
  apiKey: "AIzaSyC1SJ7q32R5QU0ttr2SituwtAoTyZgOzkM",
  authDomain: "event-flower-exchange.firebaseapp.com",
  projectId: "event-flower-exchange",
  storageBucket: "event-flower-exchange.appspot.com",
  messagingSenderId: "843171396067",
  appId: "1:843171396067:web:e7bd632027b06cd36148d6",
  measurementId: "G-1VK8G2QMW5",
};

const storageApp = !getApps().some(app => app.name === "storageApp")
  ? initializeApp(firebaseStorageConfig, "storageApp")
  : getApps().find(app => app.name === "storageApp");

const storage = getStorage(storageApp);

export { storage };


