// js/ui.js
import { formatDateArabic } from './helpers.js';

/**
 * توليد الجسيمات الطافية (قلوب وفراشات)
 */
export function initFloatingParticles() {
  const container = document.getElementById('floatsContainer');
  if (!container) return;

  const items = ['🌸', '💜', '🦋', '✨', '💖', '🤍'];
  const particleCount = 18;

  container.innerHTML = '';

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('div');
    el.className = 'float-item';
    el.innerText = items[Math.floor(Math.random() * items.length)];
    
    // إعدادات أبعاد ومواقع عشوائية
    el.style.left = `${Math.random() * 95}%`;
    el.style.fontSize = `${Math.random() * 18 + 14}px`;
    el.style.animationDelay = `${Math.random() * 12}s`;
    el.style.animationDuration = `${Math.random() * 8 + 10}s`;

    container.appendChild(el);
  }
}

/**
 * عرض العبارات والرسائل
 */
export function renderSentences(sentences = []) {
  const grid = document.getElementById('sentencesGrid');
  if (!grid) return;

  if (sentences.length === 0) {
    grid.innerHTML = `<div class="custom-card text-center" style="grid-column: 1/-1;"><p>لا توجد رسائل حالياً 💜</p></div>`;
    return;
  }

  grid.innerHTML = sentences.map(item => `
    <div class="custom-card">
      <p style="font-size: 1.1em; line-height: 1.7; font-weight: 700; color: var(--dark-purple);">
        "${item.text || item.content || ''}"
      </p>
      ${item.createdAt ? `<span style="display:block; margin-top:12px; font-size:0.82em; color:var(--text-muted); text-align:left;">${formatDateArabic(item.createdAt)}</span>` : ''}
    </div>
  `).join('');
}

/**
 * عرض معرض الصور
 */
export function renderPhotos(photos = []) {
  const grid = document.getElementById('photosGrid');
  if (!grid) return;

  if (photos.length === 0) {
    grid.innerHTML = `<div class="custom-card text-center" style="grid-column: 1/-1;"><p>لا توجد صور في المعرض حالياً ✨</p></div>`;
    return;
  }

  grid.innerHTML = photos.map(item => `
    <div class="custom-card" style="padding: 15px;">
      <div style="border-radius: var(--radius-sm); overflow: hidden; height: 220px; margin-bottom: 12px;">
        <img src="${item.url}" alt="${item.title || 'صورة'}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
      </div>
      ${item.title ? `<h4 style="font-size:1em; font-weight:700; color:var(--dark-purple);">${item.title}</h4>` : ''}
    </div>
  `).join('');
}

/**
 * عرض معرض الفيديوهات
 */
export function renderVideos(videos = []) {
  const grid = document.getElementById('videosGrid');
  if (!grid) return;

  if (videos.length === 0) {
    grid.innerHTML = `<div class="custom-card text-center" style="grid-column: 1/-1;"><p>لا توجد فيديوهات حالياً 🎬</p></div>`;
    return;
  }

  grid.innerHTML = videos.map(item => `
    <div class="custom-card" style="padding: 15px;">
      <div style="border-radius: var(--radius-sm); overflow: hidden; height: 230px; margin-bottom: 12px;">
        <video src="${item.url}" controls style="width:100%; height:100%; object-fit:cover;"></video>
      </div>
      ${item.title ? `<h4 style="font-size:1em; font-weight:700; color:var(--dark-purple);">${item.title}</h4>` : ''}
    </div>
  `).join('');
}
