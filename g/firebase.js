// firebase.js
// استيراد الحزم الضرورية من Firebase CDN v10 (ES Modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// إعدادات تهيئة مشروع Firebase
// يرجى استبدال القيم أدناه ببيانات مشروعك الخاصة من لوحة Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// تهيئة تطبيق Firebase
const app = initializeApp(firebaseConfig);

// تصدير الخدمات لاستخدامها في باقي موديولات المشروع (app.js, admin.js, upload.js)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
