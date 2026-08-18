// التمرير والتنقل بين خطوة السؤال وخطوة العداد
function showMemoriesSection() {
  const questionStep = document.getElementById('loveQuestionStep');
  const memoriesStep = document.getElementById('memoriesStep');
  
  if (questionStep && memoriesStep) {
    questionStep.classList.add('hidden');
    memoriesStep.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// حركة الهروب لزر "مش بتحبيني؟"
document.addEventListener('DOMContentLoaded', () => {
  const noBtn = document.getElementById('noBtn');
  if (noBtn) {
    noBtn.addEventListener('mouseover', () => {
      const x = Math.random() * (window.innerWidth - 200);
      const y = Math.random() * (window.innerHeight - 100);
      noBtn.style.position = 'fixed';
      noBtn.style.left = `${x}px`;
      noBtn.style.top = `${y}px`;
    });
  }
});
