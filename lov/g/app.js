// js/app.js
import { db, doc, onSnapshot, collection } from './firebase.js';
import { calculateCountdown } from './helpers.js';
import { initFloatingParticles, renderSentences, renderPhotos, renderVideos } from './ui.js';

let countdownInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. تشغيل الخلفية التفاعلية
  initFloatingParticles();

  // 2. معالجة بوابة كلمة السر
  setupPasswordGate();

  // 3. مزامنة البيانات من Firebase
  listenToData();
});

/**
 * فحص وإدارة كلمة المرور للواجهة
 */
function setupPasswordGate() {
  const form = document.getElementById('passwordForm');
  const passInput = document.getElementById('passInput');
  const overlay = document.getElementById('passwordOverlay');
  const mainContent = document.getElementById('mainContent');

  // جلب كلمة السر المخزنة محلياً إن وجدت
  const savedUnlocked = localStorage.getItem('site_unlocked');
  if (savedUnlocked === 'true') {
    overlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
  }

  form.addEventListener('submit', () => {
    const enteredPass = passInput.value.trim();
    const correctPass = window.siteSettings?.gatePassword || '1234';

    if (enteredPass === correctPass) {
      localStorage.setItem('site_unlocked', 'true');
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        overlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
      }, 400);
    } else {
      alert('كلمة السر غير صحيحة! 💜');
      passInput.value = '';
      passInput.focus();
    }
  });
}

/**
 * الاستماع للبيانات الحية من Firebase
 */
function listenToData() {
  // أ. الإعدادات العامة والعد التنازلي
  onSnapshot(doc(db, "settings", "general"), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      window.siteSettings = data;
      applyGeneralSettings(data);
    }
  });

  // ب. العبارات والرسائل
  onSnapshot(collection(db, "sentences"), (snapshot) => {
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderSentences(list);
  });

  // ج. معرض الصور
  onSnapshot(collection(db, "photos"), (snapshot) => {
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderPhotos(list);
  });

  // د. الفيديوهات
  onSnapshot(collection(db, "videos"), (snapshot) => {
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderVideos(list);
  });
}

/**
 * تطبيق الإعدادات العامة على الصفحة
 */
function applyGeneralSettings(settings) {
  if (settings.siteTitle) {
    document.title = settings.siteTitle;
    document.getElementById('siteLogoText').innerText = settings.siteTitle;
  }
  if (settings.heroTitle) {
    document.getElementById('heroTitle').innerText = settings.heroTitle;
  }
  if (settings.heroDescription) {
    document.getElementById('heroDescription').innerText = settings.heroDescription;
  }

  // تحديث العد التنازلي
  if (settings.targetDate) {
    startTimer(settings.targetDate);
  }
}

function startTimer(targetDate) {
  if (countdownInterval) clearInterval(countdownInterval);

  const update = () => {
    const res = calculateCountdown(targetDate);
    document.getElementById('days').innerText = res.days;
    document.getElementById('hours').innerText = res.hours;
    document.getElementById('minutes').innerText = res.minutes;
    document.getElementById('seconds').innerText = res.seconds;
  };

  update();
  countdownInterval = setInterval(update, 1000);
}
