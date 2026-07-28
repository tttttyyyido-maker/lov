// js/admin.js
import { db, doc, setDoc, getDoc, collection, addDoc, deleteDoc, onSnapshot } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  setupAdminLogin();
  setupNavigation();
  setupForms();
  listenToAdminTables();
});

function setupAdminLogin() {
  const form = document.getElementById('adminLoginForm');
  const overlay = document.getElementById('adminLoginOverlay');
  const dashboard = document.getElementById('adminDashboard');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  if (sessionStorage.getItem('admin_logged_in') === 'true') {
    overlay.classList.add('hidden');
    dashboard.classList.remove('hidden');
  }

  form.addEventListener('submit', () => {
    const pass = document.getElementById('adminPassInput').value.trim();
    if (pass === 'admin123' || pass === '1234') { // كلمة المرور الافتراضية
      sessionStorage.setItem('admin_logged_in', 'true');
      overlay.classList.add('hidden');
      dashboard.classList.remove('hidden');
    } else {
      alert('كلمة المرور غير صحيحة!');
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_logged_in');
    location.reload();
  });
}

function setupNavigation() {
  const links = document.querySelectorAll('.sidebar-menu a[data-target]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetId = link.getAttribute('data-target');
      document.querySelectorAll('.admin-content section').forEach(sec => {
        if (sec.id === targetId) {
          sec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  });
}

function setupForms() {
  // حفظ الإعدادات العامة
  const settingsForm = document.getElementById('generalSettingsForm');
  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "settings", "general"), {
        siteTitle: document.getElementById('siteTitleInput').value.trim(),
        gatePassword: document.getElementById('gatePasswordInput').value.trim(),
        heroTitle: document.getElementById('heroTitleInput').value.trim(),
        heroDescription: document.getElementById('heroDescInput').value.trim(),
        targetDate: document.getElementById('targetDateInput').value
      }, { merge: true });
      alert('تم حفظ الإعدادات بنجاح ✨');
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ: ' + err.message);
    }
  });

  // إضافة عبارة جديدة
  const sentenceForm = document.getElementById('addSentenceForm');
  sentenceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('sentenceTextInput').value.trim();
    if (!text) return;

    try {
      await addDoc(collection(db, "sentences"), {
        text: text,
        createdAt: new Date().toISOString()
      });
      sentenceForm.reset();
      alert('تم إضافة العبارة بنجاح 💜');
    } catch (err) {
      alert('حدث خطأ: ' + err.message);
    }
  });
}

function listenToAdminTables() {
  // جداول العبارات مع إمكانية الحذف
  onSnapshot(collection(db, "sentences"), (snapshot) => {
    const tbody = document.getElementById('sentencesTableBody');
    if (!tbody) return;

    tbody.innerHTML = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return `
        <tr>
          <td>${data.text || ''}</td>
          <td>${data.createdAt ? new Date(data.createdAt).toLocaleDateString('ar-EG') : '-'}</td>
          <td>
            <button class="btn-icon btn-delete" onclick="deleteItem('sentences', '${docSnap.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  });
}

// إتاحة دالة الحذف على المستوى العام Window
window.deleteItem = async (colName, id) => {
  if (confirm('هل أنت تأكد من إتمام الحذف؟')) {
    try {
      await deleteDoc(doc(db, colName, id));
    } catch (err) {
      alert('خطأ أثناء الحذف: ' + err.message);
    }
  }
};
