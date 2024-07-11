// src/app/firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth';

 export const firebaseConfig = {
  apiKey: "AIzaSyBzjo0S1tk-R14ekcZFXxEfV38w-V_lag0",
  authDomain: "phoneotp-dc476.firebaseapp.com",
  projectId: "phoneotp-dc476",
  storageBucket: "phoneotp-dc476.appspot.com",
  messagingSenderId: "252099419941",
  appId: "1:252099419941:web:3e3d1a4019c021f98104cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default app;
