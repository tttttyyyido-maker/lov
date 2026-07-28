// js/helpers.js

/**
 * تنسيق التواريخ وتحويلها إلى نص باللغة العربية مع الأرقام وسهولة القراءة
 * @param {string|Date} dateInput - التاريخ كـ String أو Date Object
 * @returns {string} التاريخ المنسق باللغة العربية (مثال: 15 يوليو 2026)
 */
export function formatArabicDate(dateInput) {
  if (!dateInput) return '';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return dateInput; // إعادة النص الأصلي إذا كان التنسيق غير صالح
  }

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  try {
    return new Intl.DateTimeFormat('ar-EG', options).format(date);
  } catch (e) {
    // Fallback في حال عدم دعم الخيار المحلي
    return date.toLocaleDateString('ar-EG', options);
  }
}

/**
 * دالة لتشفير وتنظيف النصوص لمنع ثغرات XSS عند الحقن داخل العناصر الديناميكية
 * @param {string} str - النص المراد تنقيته
 * @returns {string} النص بعد استبدال الرموز المحجوزة بـ HTML Entities
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * دالة لولبة الوقت (Debounce) لمنع التكلفة العالية للدوال المنفذة بكثرة عند الكتابة أو تغيير الحجم
 * @param {Function} func - الدالة المراد تنفيذها
 * @param {number} wait - وقت التأخير بالمللي ثانية
 * @returns {Function} الدالة المغلفة
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * حفظ البيانات في LocalStorage مع معالجة الاستثناءات
 * @param {string} key - مفتاح التخزين
 * @param {any} value - القيمة المراد حفظها
 */
export function setLocalStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`خطأ أثناء الحفظ في LocalStorage للمفتاح "${key}":`, error);
  }
}

/**
 * جلب البيانات من LocalStorage مع معالجة الاستثناءات
 * @param {string} key - مفتاح التخزين
 * @param {any} defaultValue - القيمة الافتراضية في حال عدم وجود المفتاح
 * @returns {any} القيمة المجلوبة أو الافتراضية
 */
export function getLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`خطأ أثناء الجلب من LocalStorage للمفتاح "${key}":`, error);
    return defaultValue;
  }
}

/**
 * إزالة عنصر من LocalStorage
 * @param {string} key - مفتاح التخزين
 */
export function removeLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`خطأ أثناء إزالة المفتاح "${key}" من LocalStorage:`, error);
  }
}

/**
 * التحقق من صحة البريد الإلكتروني باستخدام RegExp
 * @param {string} email - البريد المراد فخصه
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * توليد معرف فريد عشوائي (Unique ID) للبيانات المحلية قبل الحفظ
 * @returns {string}
 */
export function generateUniqueId() {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
