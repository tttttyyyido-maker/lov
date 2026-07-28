// js/app.js
import { db } from './firebase.js';
import { doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  hideLoadingScreen,
  showPasswordOverlay,
  hidePasswordOverlay,
  renderHeroAndMainData,
  renderSentences,
  renderCaptionsTimeline,
  renderPhotosGallery,
  renderVideosGrid,
  renderSongsList,
  startCountdown,
  showToast
} from './ui.js';
import { getLocalStorage, setLocalStorage } from './helpers.js';

// اسم المجموعة والمستند في Firestore
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'site_config';

// مفتاح التخزين المحلي للتحقق من إدخال كلمة سر الزائر مسبقًا
const AUTH_PASS_KEY = 'site_client_authenticated';

// متغير لتخزين كلمة سر الزوار المجلوبة من Firestore
let siteClientPassword = "";

// ----------------------------------------------------
// 1. التهيئة عند تحميل الصفحة
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/**
 * دالة التهيئة الرئيسية لتطبيق الواجهة
 */
async function initApp() {
  setupPasswordGateListener();
  subscribeToSiteData();
}

// ----------------------------------------------------
// 2. المزامنة اللحظية مع Firestore (Realtime Listener)
// ----------------------------------------------------

/**
 * الاشتراك في التحديثات اللحظية لمستند الإعدادات
 */
function subscribeToSiteData() {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

  // استخدام onSnapshot للحصول على تحديثات فورية بدون إعادة تحميل الصفحة
  onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // حفظ كلمة سر الزوار للتحقق المحلي
      siteClientPassword = data.client_password || "";

      // التحقق من حماية الصفحة بكلمة سر
      checkClientPasswordAccess();

      // عرض كافة أقسام البيانات في الواجهة
      renderAllPageSections(data);
    } else {
      console.warn("لم يتم العثور على بيانات في Firestore.");
      hideLoadingScreen();
    }
  }, (error) => {
    console.error("خطأ أثناء الاستماع لتحديثات Firestore:", error);
    showToast("تعذر جلب التحديثات المباشرة للموقع.", "error");
    hideLoadingScreen();
  });
}

/**
 * عرض كافة أقسام الصفحة ببيانات Firestore
 * @param {Object} data 
 */
function renderAllPageSections(data) {
  renderHeroAndMainData(data);
  renderSentences(data.sentences || []);
  renderCaptionsTimeline(data.captions || []);
  renderPhotosGallery(data.photos || []);
  renderVideosGrid(data.videos || []);
  renderSongsList(data.songs || []);
  
  // تشغيل العداد التنازلي بناءً على التاريخ المحفوظ
  if (data.date) {
    startCountdown(data.date);
  }
}

// ----------------------------------------------------
// 3. نظام حماية الزوار (Client Password Gate)
// ----------------------------------------------------

/**
 * فحص ما إذا كانت كلمة السر مطلوبة وهل تم تجاوزها مسبقًا
 */
function checkClientPasswordAccess() {
  const isAuthenticated = getLocalStorage(AUTH_PASS_KEY, false);

  // إذا كانت هناك كلمة سر محددة والمستخدم لم يدخلها بعد
  if (siteClientPassword && siteClientPassword.trim() !== "" && !isAuthenticated) {
    showPasswordOverlay();
  } else {
    hidePasswordOverlay();
  }

  hideLoadingScreen();
}

/**
 * إعداد الاستماع لنموذج إدخال كلمة سر الزائر
 */
function setupPasswordGateListener() {
  const passForm = document.getElementById('client-pass-form');
  const passInput = document.getElementById('client-password-input');
  const passError = document.getElementById('pass-error');

  if (!passForm || !passInput) return;

  passForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const enteredPassword = passInput.value.trim();

    if (enteredPassword === siteClientPassword) {
      // حفظ حالة التحقق في LocalStorage
      setLocalStorage(AUTH_PASS_KEY, true);
      if (passError) passError.classList.add('hidden');
      hidePasswordOverlay();
      showToast("تم فتح المحتوى بنجاح!", "success");
    } else {
      if (passError) {
        passError.textContent = "كلمة السر غير صحيحة، حاول مجددًا";
        passError.classList.remove('hidden');
      }
    }
  });
}
