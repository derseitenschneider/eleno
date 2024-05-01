// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBlmkMg8xhh0qQnTtBODfEeM2T3rqsu4T0",
	authDomain: "eleno-analytics.firebaseapp.com",
	projectId: "eleno-analytics",
	storageBucket: "eleno-analytics.appspot.com",
	messagingSenderId: "1042800679043",
	appId: "1:1042800679043:web:d0139da616f180a655e3b6",
	measurementId: "G-YNZ6V7TFP8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default analytics;
