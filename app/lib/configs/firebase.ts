import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey:
    process.env.FIREBASE_APIKEY || "AIzaSyCylQNq7xSwh0AZ2aEdRFyw7WTfK-HjoCE",
  authDomain: process.env.AUTHDOMAIN || "",
  projectId: process.env.PROJECT_ID || "",
  storageBucket: "bigly-server.appspot.com",
  messagingSenderId: process.env.MESSAGE_SENDER_ID || "",
  appId: process.env.APP_ID || "",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);
