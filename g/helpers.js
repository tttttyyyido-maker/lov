// js/helpers.js

/**
 * حساب الوقت المتبقي للعد التنازلي
 * @param {string|Date} targetDate 
 * @returns {Object} { days, hours, minutes, seconds, isExpired }
 */
export function calculateCountdown(targetDate) {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (isNaN(target) || difference <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00', isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const format = (num) => String(num).padStart(2, '0');

  return {
    days: format(days),
    hours: format(hours),
    minutes: format(minutes),
    seconds: format(seconds),
    isExpired: false
  };
}

/**
 * تنسيق التاريخ باللغة العربية
 * @param {string|number|Date} dateVal 
 */
export function formatDateArabic(dateVal) {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
