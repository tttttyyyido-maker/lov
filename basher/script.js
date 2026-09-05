
const music = document.getElementById('music');
const audio = document.getElementById('audio');
let playing=false;
music?.addEventListener('click', async ()=>{
  try{
    if(!audio.src){ alert('ابعت ملف الأغنية عشان نضيفه للموقع ❤️'); return; }
    if(playing){audio.pause();music.textContent='🎵';}
    else {await audio.play();music.textContent='⏸';}
    playing=!playing;
  }catch(e){ alert('اضغط مرة تانية لتشغيل الأغنية.'); }
});
document.querySelectorAll('.photo').forEach(card=>{
  card.addEventListener('click',()=>{
    const m=document.getElementById('modal'), img=m.querySelector('img');
    img.src=card.dataset.src;m.classList.add('open');
  });
});
document.querySelector('.close')?.addEventListener('click',()=>document.getElementById('modal').classList.remove('open'));
document.getElementById('modal')?.addEventListener('click',e=>{
 if(e.target.id==='modal') e.currentTarget.classList.remove('open');
});
const gift=document.getElementById('gift');
gift?.addEventListener('click',()=>{
 document.getElementById('surpriseText').classList.remove('hidden');
 gift.style.display='none';
 for(let i=0;i<90;i++){
   const c=document.createElement('i');c.className='confetti';
   c.style.left=Math.random()*100+'vw';
   c.style.animationDelay=Math.random()*.8+'s';
   c.style.background=`hsl(${Math.random()*360},90%,65%)`;
   document.body.appendChild(c);
   setTimeout(()=>c.remove(),4000);
 }
});
document.querySelectorAll('[data-scroll]').forEach(a=>a.addEventListener('click',e=>{
 e.preventDefault();document.querySelector(a.dataset.scroll).scrollIntoView({behavior:'smooth'});
}));
