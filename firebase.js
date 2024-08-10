// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKVMH6kMkQjd_yoWX_Qb2Ygy2ZiLkAdC4",
  authDomain: "ai-chat-support-902b5.firebaseapp.com",
  projectId: "ai-chat-support-902b5",
  storageBucket: "ai-chat-support-902b5.appspot.com",
  messagingSenderId: "444468604490",
  appId: "1:444468604490:web:bbf252049b67957d8c00b3",
  measurementId: "G-BGDR4DWQ9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth}