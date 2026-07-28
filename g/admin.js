// js/admin.js
import { auth, db } from '../firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { uploadFileWithProgress } from './upload.js';
import { showToast } from './ui.js';

// المعرف الثابت لمستند الإعدادات في Firestore
const SETTINGS_DOC_ID = 'site_config';
const SETTINGS_COLLECTION = 'settings';

// تخزين الحالة المحلية للبيانات لتسهيل التعديل والحذف والإضافة
let state = {
  login_title: "",
  login_subtitle: "",
  client_password: "",
  login_photo: "",
  hero_photo: "",
  hero_badge: "",
  main_title: "",
  main_message: "",
  page2_title: "",
  date: "",
  countdown_sub: "",
  captions: [],
  photos: [],
  videos: [],
  songs: [],
  sentences: [],
  updatedAt: ""
};

// عناصر الواجهة الرئيسية
const loadingScreen = document.getElementById('loading-screen');
const adminForm = document.getElementById('admin-main-form');
const logoutBtn = document.getElementById('logout-btn');
const saveAllBtn = document.getElementById('save-all-btn');

// عناصر الحاويات الديناميكية
const sentencesContainer = document.getElementById('sentences-container');
const captionsContainer = document.getElementById('captions-container');
const photosContainer = document.getElementById('photos-container');
const videosContainer = document.getElementById('videos-container');
const songsContainer = document.getElementById('songs-container');

// أزرار الإضافة
const addSentenceBtn = document.getElementById('add-sentence-btn');
const addCaptionBtn = document.getElementById('add-caption-btn');
const addPhotoBtn = document.getElementById('add-photo-btn');
const addVideoBtn = document.getElementById('add-video-btn');
const addSongBtn = document.getElementById('add-song-btn');

// ----------------------------------------------------
// 1. التهيئة والتحقق من صلاحية المسجل (Auth Guard)
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // إعادة التوجيه لصفحة الدخول إذا لم يكن مسجلاً
      window.location.href = '../login.html';
    } else {
      await loadProjectData();
      initEventListeners();
    }
  });
});

/**
 * جلب البيانات من Firestore وتعبئتها في الاستمارة والمصفوفات
 */
async function loadProjectData() {
  try {
    showLoading("جاري جلب البيانات من قاعدة البيانات...");
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // دمج البيانات مع الحالة الافتراضية لمنع الأخطاء في حال غياب حقل
      state = { ...state, ...data };
    } else {
      console.warn("لم يتم العثور على مستند الإعدادات. سيتم إنشاء مستند جديد عند الحفظ.");
    }

    populateFormInputs();
    renderAllLists();
  } catch (error) {
    console.error("خطأ في تحميل البيانات:", error);
    showToast("حدث خطأ أثناء جلب البيانات من Firestore", "error");
  } finally {
    hideLoading();
  }
}

// ----------------------------------------------------
// 2. تعبئة عناصر المدخلات وإدارة القوائم Dynamic Rendering
// ----------------------------------------------------

/**
 * تعبئة المدخلات النصية الفردية والمعاينات
 */
function populateFormInputs() {
  document.getElementById('login_title').value = state.login_title || "";
  document.getElementById('login_subtitle').value = state.login_subtitle || "";
  document.getElementById('client_password').value = state.client_password || "";
  document.getElementById('hero_badge').value = state.hero_badge || "";
  document.getElementById('main_title').value = state.main_title || "";
  document.getElementById('main_message').value = state.main_message || "";
  document.getElementById('page2_title').value = state.page2_title || "";
  document.getElementById('date').value = state.date || "";
  document.getElementById('countdown_sub').value = state.countdown_sub || "";

  document.getElementById('login_photo_url').value = state.login_photo || "";
  if (state.login_photo) {
    document.getElementById('login_photo_preview').src = state.login_photo;
  }

  document.getElementById('hero_photo_url').value = state.hero_photo || "";
  if (state.hero_photo) {
    document.getElementById('hero_photo_preview').src = state.hero_photo;
  }
}

/**
 * إعادة رسم كافة القوائم الديناميكية
 */
function renderAllLists() {
  renderSentences();
  renderCaptions();
  renderPhotos();
  renderVideos();
  renderSongs();
}

// ---- إدارة الجمل (sentences) ----
function renderSentences() {
  sentencesContainer.innerHTML = '';
  if (!state.sentences || state.sentences.length === 0) {
    sentencesContainer.innerHTML = '<p class="empty-msg">لا توجد جمل مضافة حاليًا.</p>';
    return;
  }

  state.sentences.forEach((text, index) => {
    const item = document.createElement('div');
    item.className = 'dynamic-row';
    item.innerHTML = `
      <input type="text" class="form-control sentence-input" value="${escapeHtml(text)}" data-index="${index}" placeholder="أدخل الجملة أو العبارة">
      <button type="button" class="btn-icon btn-danger delete-sentence-btn" data-index="${index}" title="حذف">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    sentencesContainer.appendChild(item);
  });
}

// ---- إدارة الكابشنات مع التاريخ (captions) ----
function renderCaptions() {
  captionsContainer.innerHTML = '';
  if (!state.captions || state.captions.length === 0) {
    captionsContainer.innerHTML = '<p class="empty-msg">لا توجد كابشنات مضافة حاليًا.</p>';
    return;
  }

  state.captions.forEach((cap, index) => {
    const item = document.createElement('div');
    item.className = 'dynamic-row grid-2';
    item.innerHTML = `
      <input type="text" class="form-control caption-text-input" value="${escapeHtml(cap.text || '')}" data-index="${index}" placeholder="نص الكابشن">
      <div class="flex-row">
        <input type="date" class="form-control caption-date-input" value="${cap.date || ''}" data-index="${index}">
        <button type="button" class="btn-icon btn-danger delete-caption-btn" data-index="${index}" title="حذف">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    captionsContainer.appendChild(item);
  });
}

// ---- إدارة الصور (photos) ----
function renderPhotos() {
  photosContainer.innerHTML = '';
  if (!state.photos || state.photos.length === 0) {
    photosContainer.innerHTML = '<p class="empty-msg">لا توجد صور مضافة في المعرض.</p>';
    return;
  }

  state.photos.forEach((photo, index) => {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.innerHTML = `
      <div class="media-preview-box">
        <img src="${photo.url || '../assets/placeholder-hero.jpg'}" alt="معاينة" id="photo-img-preview-${index}">
      </div>
      <div class="media-card-body">
        <input type="text" class="form-control photo-caption-input" value="${escapeHtml(photo.caption || '')}" data-index="${index}" placeholder="الوصف أو الكابشن">
        <div class="file-upload-inline">
          <input type="file" class="file-input photo-file-input" accept="image/*" data-index="${index}">
          <input type="hidden" class="photo-url-input" value="${photo.url || ''}" data-index="${index}">
        </div>
        <button type="button" class="btn-danger btn-sm btn-block delete-photo-btn" data-index="${index}">
          <i class="fa-solid fa-trash"></i> حذف الصورة
        </button>
      </div>
    `;
    photosContainer.appendChild(card);
  });
}

// ---- إدارة الفيديوهات (videos) ----
function renderVideos() {
  videosContainer.innerHTML = '';
  if (!state.videos || state.videos.length === 0) {
    videosContainer.innerHTML = '<p class="empty-msg">لا توجد فيديوهات مضافة.</p>';
    return;
  }

  state.videos.forEach((vid, index) => {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.innerHTML = `
      <div class="media-preview-box video-preview-box">
        ${vid.url ? `<video src="${vid.url}" controls></video>` : '<div class="no-video"><i class="fa-solid fa-video-slash"></i></div>'}
      </div>
      <div class="media-card-body">
        <input type="text" class="form-control video-title-input" value="${escapeHtml(vid.title || '')}" data-index="${index}" placeholder="عنوان الفيديو">
        <div class="file-upload-inline">
          <input type="file" class="file-input video-file-input" accept="video/*" data-index="${index}">
          <input type="hidden" class="video-url-input" value="${vid.url || ''}" data-index="${index}">
        </div>
        <button type="button" class="btn-danger btn-sm btn-block delete-video-btn" data-index="${index}">
          <i class="fa-solid fa-trash"></i> حذف الفيديو
        </button>
      </div>
    `;
    videosContainer.appendChild(card);
  });
}

// ---- إدارة الأغاني (songs) ----
function renderSongs() {
  songsContainer.innerHTML = '';
  if (!state.songs || state.songs.length === 0) {
    songsContainer.innerHTML = '<p class="empty-msg">لا توجد مقاطع صوتية مضافة.</p>';
    return;
  }

  state.songs.forEach((song, index) => {
    const card = document.createElement('div');
    card.className = 'dynamic-row flex-column-mobile';
    card.innerHTML = `
      <input type="text" class="form-control song-title-input" value="${escapeHtml(song.title || '')}" data-index="${index}" placeholder="اسم الأغنية / المقطع">
      <div class="audio-controls-wrapper">
        ${song.url ? `<audio src="${song.url}" controls></audio>` : ''}
        <input type="file" class="file-input song-file-input" accept="audio/*" data-index="${index}">
        <input type="hidden" class="song-url-input" value="${song.url || ''}" data-index="${index}">
      </div>
      <button type="button" class="btn-icon btn-danger delete-song-btn" data-index="${index}" title="حذف">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    songsContainer.appendChild(card);
  });
}

// ----------------------------------------------------
// 3. الاستماع للأحداث والمعالجات (Event Listeners)
// ----------------------------------------------------
function initEventListeners() {
  // تسجيل الخروج
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      window.location.href = '../login.html';
    } catch (err) {
      showToast("حدث خطأ أثناء تسجيل الخروج", "error");
    }
  });

  // إضافة العناصر إلى المصفوفات
  addSentenceBtn.addEventListener('click', () => {
    state.sentences.push("");
    renderSentences();
  });

  addCaptionBtn.addEventListener('click', () => {
    state.captions.push({ text: "", date: "" });
    renderCaptions();
  });

  addPhotoBtn.addEventListener('click', () => {
    state.photos.push({ url: "", caption: "" });
    renderPhotos();
  });

  addVideoBtn.addEventListener('click', () => {
    state.videos.push({ url: "", title: "" });
    renderVideos();
  });

  addSongBtn.addEventListener('click', () => {
    state.songs.push({ url: "", title: "" });
    renderSongs();
  });

  // تفويض الأحداث للحذف والتعديل المباشر (Event Delegation)
  adminForm.addEventListener('click', handleGlobalClicks);
  adminForm.addEventListener('input', handleGlobalInputs);
  adminForm.addEventListener('change', handleGlobalFileChanges);

  // زر حفظ الكل وتقديم النموذج
  adminForm.addEventListener('submit', handleSaveAll);
  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSaveAll(e);
    });
  }
}

/**
 * معالجة نقرات أزرار الحذف
 */
function handleGlobalClicks(e) {
  const target = e.target.closest('button');
  if (!target) return;

  const index = parseInt(target.getAttribute('data-index'));

  if (target.classList.contains('delete-sentence-btn')) {
    state.sentences.splice(index, 1);
    renderSentences();
  } else if (target.classList.contains('delete-caption-btn')) {
    state.captions.splice(index, 1);
    renderCaptions();
  } else if (target.classList.contains('delete-photo-btn')) {
    state.photos.splice(index, 1);
    renderPhotos();
  } else if (target.classList.contains('delete-video-btn')) {
    state.videos.splice(index, 1);
    renderVideos();
  } else if (target.classList.contains('delete-song-btn')) {
    state.songs.splice(index, 1);
    renderSongs();
  }
}

/**
 * معالجة إدخال النصوص والمزامنة المباشرة مع الحالة state
 */
function handleGlobalInputs(e) {
  const target = e.target;
  const index = parseInt(target.getAttribute('data-index'));

  if (target.classList.contains('sentence-input')) {
    state.sentences[index] = target.value;
  } else if (target.classList.contains('caption-text-input')) {
    state.captions[index].text = target.value;
  } else if (target.classList.contains('caption-date-input')) {
    state.captions[index].date = target.value;
  } else if (target.classList.contains('photo-caption-input')) {
    state.photos[index].caption = target.value;
  } else if (target.classList.contains('video-title-input')) {
    state.videos[index].title = target.value;
  } else if (target.classList.contains('song-title-input')) {
    state.songs[index].title = target.value;
  }
}

/**
 * معالجة تغير الملفات ورفعها المباشر إلى Firebase Storage
 */
async function handleGlobalFileChanges(e) {
  const fileInput = e.target;
  if (fileInput.type !== 'file' || !fileInput.files || fileInput.files.length === 0) return;

  const file = fileInput.files[0];
  const index = parseInt(fileInput.getAttribute('data-index'));

  // 1. رفع صورة صفحة الدخول (login_photo)
  if (fileInput.id === 'login_photo_file') {
    const url = await uploadMediaFile(file, 'login_photos');
    if (url) {
      state.login_photo = url;
      document.getElementById('login_photo_url').value = url;
      document.getElementById('login_photo_preview').src = url;
    }
  }
  // 2. رفع صورة الواجهة (hero_photo)
  else if (fileInput.id === 'hero_photo_file') {
    const url = await uploadMediaFile(file, 'hero_photos');
    if (url) {
      state.hero_photo = url;
      document.getElementById('hero_photo_url').value = url;
      document.getElementById('hero_photo_preview').src = url;
    }
  }
  // 3. رفع صورة في المعرض (photos)
  else if (fileInput.classList.contains('photo-file-input')) {
    const url = await uploadMediaFile(file, 'gallery_photos');
    if (url) {
      state.photos[index].url = url;
      renderPhotos();
    }
  }
  // 4. رفع فيديو (videos)
  else if (fileInput.classList.contains('video-file-input')) {
    const url = await uploadMediaFile(file, 'videos');
    if (url) {
      state.videos[index].url = url;
      renderVideos();
    }
  }
  // 5. رفع مقطع صوتي (songs)
  else if (fileInput.classList.contains('song-file-input')) {
    const url = await uploadMediaFile(file, 'songs');
    if (url) {
      state.songs[index].url = url;
      renderSongs();
    }
  }
}

/**
 * دالة تغليف لرفع الملفات مع عرض التنبيهات
 */
async function uploadMediaFile(file, folderName) {
  try {
    const downloadURL = await uploadFileWithProgress(file, folderName);
    showToast("تم رفع الملف بنجاح!", "success");
    return downloadURL;
  } catch (error) {
    console.error("خطأ أثناء رفع الملف:", error);
    showToast("فشل رفع الملف. يرجى إعادة المحاولة.", "error");
    return null;
  }
}

// ----------------------------------------------------
// 4. حفظ البيانات النهائية في Firestore
// ----------------------------------------------------
async function handleSaveAll(e) {
  e.preventDefault();

  try {
    showLoading("جاري حفظ التعديلات في Firestore...");

    // تجميع القيم المحدثة من المدخلات الفردية
    const updatedData = {
      login_title: document.getElementById('login_title').value.trim(),
      login_subtitle: document.getElementById('login_subtitle').value.trim(),
      client_password: document.getElementById('client_password').value.trim(),
      hero_badge: document.getElementById('hero_badge').value.trim(),
      main_title: document.getElementById('main_title').value.trim(),
      main_message: document.getElementById('main_message').value.trim(),
      page2_title: document.getElementById('page2_title').value.trim(),
      date: document.getElementById('date').value,
      countdown_sub: document.getElementById('countdown_sub').value.trim(),
      
      login_photo: state.login_photo,
      hero_photo: state.hero_photo,

      // تصفية العناصر الفارغة للحفاظ على نظافة البيانات
      sentences: state.sentences.filter(s => s.trim() !== ""),
      captions: state.captions.filter(c => c.text.trim() !== "" || c.date !== ""),
      photos: state.photos.filter(p => p.url !== ""),
      videos: state.videos.filter(v => v.url !== ""),
      songs: state.songs.filter(s => s.url !== ""),

      updatedAt: new Date().toISOString()
    };

    // حفظ المستند الكامل في Firestore
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(docRef, updatedData, { merge: true });

    // تحديث الحالة المحلية
    state = { ...state, ...updatedData };

    showToast("تم حفظ جميع البيانات بنجاح!", "success");
  } catch (error) {
    console.error("خطأ أثناء حفظ البيانات:", error);
    showToast("حدث خطأ أثناء حفظ البيانات في Firestore", "error");
  } finally {
    hideLoading();
  }
}

// ----------------------------------------------------
// 5. دوال مساعدة Helpers
// ----------------------------------------------------
function showLoading(msg) {
  const loadingText = document.getElementById('loading-text');
  if (loadingText) loadingText.textContent = msg || "جاري التحميل...";
  if (loadingScreen) loadingScreen.classList.remove('hidden');
}

function hideLoading() {
  if (loadingScreen) loadingScreen.classList.add('hidden');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
