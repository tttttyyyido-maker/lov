// js/ui.js
import { formatArabicDate, escapeHtml } from './helpers.js';

// ----------------------------------------------------
// 1. إدارة الشاشات والنوافذ المنبثقة (Loading & Overlays)
// ----------------------------------------------------

/**
 * إخفاء شاشة التحميل الرئيسية
 */
export function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
}

/**
 * إظهار شاشة التحميل مع نص مخصص
 * @param {string} message 
 */
export function showLoadingScreen(message = "جاري التحميل...") {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    const textEl = loadingScreen.querySelector('p');
    if (textEl) textEl.textContent = message;
    loadingScreen.classList.remove('hidden');
  }
}

/**
 * إظهار نافذة إدخال كلمة سر الزائر لحماية محتوى الموقع
 */
export function showPasswordOverlay() {
  const overlay = document.getElementById('password-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
  }
}

/**
 * إخفاء نافذة كلمة سر الزائر عند الإدخال الصحيح
 */
export function hidePasswordOverlay() {
  const overlay = document.getElementById('password-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

/**
 * عرض رسالة إشعار مؤقتة (Toast Notification)
 * @param {string} message - نص الرسالة
 * @param {string} type - نوع الإشعار ('success' | 'error' | 'info')
 */
export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  
  // إنشاء حاوية التوست تلقائيًا إذا لم تكن موجودة في الصفحة
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-check-circle';
  if (type === 'error') iconClass = 'fa-exclamation-circle';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // إزالة التوست بعد 3.5 ثوانٍ تلقائيًا
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}

// ----------------------------------------------------
// 2. تحديث العناصر النصية والصور الأساسية بالواجهة
// ----------------------------------------------------

/**
 * تعبئة البيانات الأساسية بصفحة index.html
 * @param {Object} data - مستند الإعدادات المجلوب من Firestore
 */
export function renderHeroAndMainData(data) {
  if (!data) return;

  const mainBrand = document.getElementById('site-brand');
  const heroPhoto = document.getElementById('hero-photo');
  const heroBadge = document.getElementById('hero-badge');
  const mainTitle = document.getElementById('main-title');
  const mainMessage = document.getElementById('main-message');
  const page2Title = document.getElementById('page2-title');
  const countdownSub = document.getElementById('countdown-sub');
  const updatedAtText = document.getElementById('updated-at-text');

  if (mainBrand && data.main_title) mainBrand.textContent = data.main_title;
  if (heroPhoto && data.hero_photo) heroPhoto.src = data.hero_photo;
  if (heroBadge && data.hero_badge) heroBadge.textContent = data.hero_badge;
  if (mainTitle && data.main_title) mainTitle.textContent = data.main_title;
  if (mainMessage && data.main_message) mainMessage.textContent = data.main_message;
  if (page2Title && data.page2_title) page2Title.textContent = data.page2_title;
  if (countdownSub && data.countdown_sub) countdownSub.textContent = data.countdown_sub;

  if (updatedAtText && data.updatedAt) {
    updatedAtText.textContent = `آخر تحديث للمحتوى: ${formatArabicDate(data.updatedAt)}`;
  }
}

// ----------------------------------------------------
// 3. عرض المصفوفات الديناميكية (Sentences, Captions, Photos, Videos, Songs)
// ----------------------------------------------------

/**
 * عرض الجمل والعبارات
 * @param {Array<string>} sentences 
 */
export function renderSentences(sentences = []) {
  const container = document.getElementById('sentences-list');
  if (!container) return;

  container.innerHTML = '';
  if (!sentences.length) {
    container.innerHTML = '<p class="empty-section-msg">لا توجد عبارات مضافة حاليًا.</p>';
    return;
  }

  sentences.forEach((sentenceText) => {
    const card = document.createElement('div');
    card.className = 'sentence-card';
    card.innerHTML = `
      <i class="fa-solid fa-quote-right quote-icon"></i>
      <p class="sentence-text">${escapeHtml(sentenceText)}</p>
    `;
    container.appendChild(card);
  });
}

/**
 * عرض الكابشنات مع التاريخ في خط زمني (Timeline)
 * @param {Array<Object>} captions - [{text: "", date: ""}]
 */
export function renderCaptionsTimeline(captions = []) {
  const container = document.getElementById('captions-timeline');
  if (!container) return;

  container.innerHTML = '';
  if (!captions.length) {
    container.innerHTML = '<p class="empty-section-msg">لا توجد محطات مضافة حاليًا.</p>';
    return;
  }

  captions.forEach((cap) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <span class="timeline-date"><i class="fa-solid fa-calendar-day"></i> ${formatArabicDate(cap.date)}</span>
        <p class="timeline-text">${escapeHtml(cap.text)}</p>
      </div>
    `;
    container.appendChild(item);
  });
}

/**
 * عرض معرض الصور التفاعلي
 * @param {Array<Object>} photos - [{url: "", caption: ""}]
 */
export function renderPhotosGallery(photos = []) {
  const container = document.getElementById('photos-gallery');
  if (!container) return;

  container.innerHTML = '';
  if (!photos.length) {
    container.innerHTML = '<p class="empty-section-msg">لا توجد صور في المعرض حاليًا.</p>';
    return;
  }

  photos.forEach((photo) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <div class="photo-img-wrapper">
        <img src="${photo.url}" alt="${escapeHtml(photo.caption || 'صورة ذكرى')}" loading="lazy">
      </div>
      ${photo.caption ? `<div class="photo-caption"><p>${escapeHtml(photo.caption)}</p></div>` : ''}
    `;
    container.appendChild(card);
  });
}

/**
 * عرض فيديوهات الذكريات
 * @param {Array<Object>} videos - [{url: "", title: ""}]
 */
export function renderVideosGrid(videos = []) {
  const container = document.getElementById('videos-grid');
  if (!container) return;

  container.innerHTML = '';
  if (!videos.length) {
    container.innerHTML = '<p class="empty-section-msg">لا توجد فيديوهات مضافة حاليًا.</p>';
    return;
  }

  videos.forEach((vid) => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <div class="video-wrapper">
        <video src="${vid.url}" controls preload="metadata"></video>
      </div>
      ${vid.title ? `<h4 class="video-title">${escapeHtml(vid.title)}</h4>` : ''}
    `;
    container.appendChild(card);
  });
}

/**
 * عرض المشغل الصوتي للأغاني والمقاطع
 * @param {Array<Object>} songs - [{url: "", title: ""}]
 */
export function renderSongsList(songs = []) {
  const container = document.getElementById('songs-list');
  if (!container) return;

  container.innerHTML = '';
  if (!songs.length) {
    container.innerHTML = '<p class="empty-section-msg">لا توجد مقاطع صوتية مضافة حاليًا.</p>';
    return;
  }

  songs.forEach((song) => {
    const item = document.createElement('div');
    item.className = 'song-item';
    item.innerHTML = `
      <div class="song-info">
        <i class="fa-solid fa-music song-icon"></i>
        <span class="song-title">${escapeHtml(song.title || 'مقطع صوتي')}</span>
      </div>
      <div class="song-player">
        <audio src="${song.url}" controls></audio>
      </div>
    `;
    container.appendChild(item);
  });
}

// ----------------------------------------------------
// 4. العداد التنازلي / التصاعدي التفاعلي (Countdown)
// ----------------------------------------------------

let countdownInterval = null;

/**
 * تشغيل العداد وتعديل أرقام الثواني، الدقائق، الساعات والأيام في الوقت الفعلي
 * @param {string} targetDateStr - صيغة تاريخ ISO أو datetime-local
 */
export function startCountdown(targetDateStr) {
  if (countdownInterval) clearInterval(countdownInterval);

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (!targetDateStr) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const targetDate = new Date(targetDateStr).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const difference = Math.abs(now - targetDate);

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
}
