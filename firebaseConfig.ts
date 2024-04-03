import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCELqRCztvDzMSv_LJWBUQNr2uFyoOzQwE",
  authDomain: "abtestinghub-fd8ee.firebaseapp.com",
  projectId: "abtestinghub-fd8ee",
  storageBucket: "abtestinghub-fd8ee.appspot.com",
  messagingSenderId: "872673523502",
  appId: "1:872673523502:web:45391cbb6c784c5dd72cbf",
  measurementId: "G-RCF2XP4LMG",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
