// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCvMcSeoVY92kISoZGEXeoZD86Un1psuHs",
    authDomain: "hack8init0.firebaseapp.com",
    projectId: "hack8init0",
    storageBucket: "hack8init0.firebasestorage.app",
    messagingSenderId: "15195303504",
    appId: "1:15195303504:web:6e0d475d2458176c89ab55",
    measurementId: "G-9V0JX3FN9R"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
