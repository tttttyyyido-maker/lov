// js/upload.js
import { storage } from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

/**
 * دالة رفع الملفات إلى Firebase Storage مع متابعة نسبة التقدم (Progress)
 * @param {File} file - الملف المراد رفعه (صورة، فيديو، صوت)
 * @param {string} folder - اسم المجلد داخل Firebase Storage (مثل: 'photos', 'videos', 'songs')
 * @returns {Promise<string>} رابط تحميل الملف بعد اكتمال الرفع (Download URL)
 */
export function uploadFileWithProgress(file, folder = 'uploads') {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("لم يتم اختيار أي ملف للرفع."));
      return;
    }

    // توليد اسم فريد للملف باستخدام التاريخ والرقم العشوائي لتجنب تكرار أسماء الملفات
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const storageRef = ref(storage, `${folder}/${uniqueFileName}`);

    // إنشاء مهمة الرفع مع إمكانية استئنافها ومراقبتها
    const uploadTask = uploadBytesResumable(storageRef, file);

    // الحصول على عناصر شريط التقدم من الواجهة
    const progressCard = document.getElementById('upload-progress-card');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressPercentText = document.getElementById('progress-percent');
    const progressFileNameText = document.getElementById('progress-file-name');

    // إظهار بطاقة الرفع وتحديث اسم الملف
    if (progressCard) {
      progressCard.classList.remove('hidden');
    }
    if (progressFileNameText) {
      progressFileNameText.textContent = `جاري رفع: ${file.name}`;
    }

    // متابعة أحداث مهمة الرفع (state_changed)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // حساب نسبة التقدم المئوية
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const roundedProgress = Math.round(progress);

        // تحديث واجهة المستخدم فورًا بنسبة التقدم
        if (progressBarFill) {
          progressBarFill.style.width = `${roundedProgress}%`;
        }
        if (progressPercentText) {
          progressPercentText.textContent = `${roundedProgress}%`;
        }
      },
      (error) => {
        // التعامل مع الأخطاء التي قد تحدث أثناء الرفع
        console.error("خطأ أثناء رفع الملف إلى Firebase Storage:", error);
        
        // إخفاء بطاقة التقدم عند حدوث خطأ
        if (progressCard) {
          progressCard.classList.add('hidden');
        }

        let errorMessage = "حدث خطأ غير متوقع أثناء الرفع.";
        switch (error.code) {
          case 'storage/unauthorized':
            errorMessage = "ليس لديك الصلاحية لرفع الملفات.";
            break;
          case 'storage/canceled':
            errorMessage = "تم إلغاء عملية الرفع.";
            break;
          case 'storage/unknown':
            errorMessage = "حدث خطأ غير معروف في خادم التخزين.";
            break;
        }

        reject(new Error(errorMessage));
      },
      async () => {
        // عند مكتمل عملية الرفع بنجاح
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // إعادة إخفاء وتصفير بطاقة شريط التقدم
          if (progressCard) {
            setTimeout(() => {
              progressCard.classList.add('hidden');
              if (progressBarFill) progressBarFill.style.width = '0%';
              if (progressPercentText) progressPercentText.textContent = '0%';
            }, 1000);
          }

          resolve(downloadURL);
        } catch (err) {
          console.error("خطأ أثناء جلب رابط التحميل:", err);
          reject(err);
        }
      }
    );
  });
}
