import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFHcU7H24qU3OlJRdTe27ZxgwnFRzYxvE",
  authDomain: "love-18e03.firebaseapp.com",
  projectId: "love-18e03",
  storageBucket: "love-18e03.firebasestorage.app",
  messagingSenderId: "716078539990",
  appId: "1:716078539990:web:6198dd38a0cd3ad3369577"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

export { doc, setDoc, getDoc, onSnapshot };
