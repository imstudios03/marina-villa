document.addEventListener('DOMContentLoaded', function(){
  // Mobile navigation
  const menu=document.querySelector('.menu-toggle');
  const mobile=document.querySelector('.mobile-nav');
  if(menu && mobile){
    menu.addEventListener('click',()=>{
      const open=mobile.classList.toggle('open');
      menu.setAttribute('aria-expanded',String(open));
    });
    mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      mobile.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
    }));
  }

  // Horizontal rails
  document.querySelectorAll('.scroll-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const rail=document.getElementById(btn.dataset.target);
    if(!rail)return;
    const amount=Math.min(rail.clientWidth*.78,430);
    rail.scrollBy({left:Number(btn.dataset.dir)*amount,behavior:'smooth'});
  }));
  document.querySelectorAll('.rail,.gallery-rail').forEach(rail=>{
    let down=false,start=0,left=0;
    rail.addEventListener('pointerdown',e=>{down=true;start=e.clientX;left=rail.scrollLeft;rail.setPointerCapture?.(e.pointerId);rail.style.cursor='grabbing'});
    rail.addEventListener('pointermove',e=>{if(down)rail.scrollLeft=left-(e.clientX-start)});
    ['pointerup','pointercancel','pointerleave'].forEach(t=>rail.addEventListener(t,()=>{down=false;rail.style.cursor='grab'}));
  });

  const year=document.getElementById('year'); if(year)year.textContent=new Date().getFullYear();

  // Book Now -> Marina Villa WhatsApp
  const waBooking='https://wa.me/917010597696?text='+encodeURIComponent('Hello Merina Villa, I would like to book a stay.');
  document.querySelectorAll('a,button').forEach(el=>{
    const label=(el.textContent||el.getAttribute('aria-label')||'').trim().toLowerCase();
    if(label.includes('book your stay') || label==='book now' || label.includes('book now')){
      el.addEventListener('click',e=>{e.preventDefault();window.open(waBooking,'_blank','noopener');});
    }
  });

  // Customer enquiry -> WhatsApp with name + customer WhatsApp + content
  const form=document.getElementById('enquiryForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const name=document.getElementById('enquiryName')?.value.trim()||'';
      const phone=document.getElementById('enquiryWhatsapp')?.value.trim()||'';
      const message=document.getElementById('enquiryMessage')?.value.trim()||'';
      if(!name || !phone){alert('Please enter your name and WhatsApp number.');return;}
      const text=['Hello Merina Villa, I would like to make an enquiry.','',`Name: ${name}`,`Customer WhatsApp: ${phone}`,message?`Enquiry: ${message}`:'','Please contact me regarding my enquiry.'].filter(Boolean).join('\n');
      window.open('https://wa.me/917010597696?text='+encodeURIComponent(text),'_blank','noopener');
    });
  }

  // View photos -> full-screen lightbox
  const lightbox=document.getElementById('lightbox');
  const image=document.getElementById('lightboxImage');
  const caption=document.getElementById('lightboxCaption');
  const close=document.getElementById('lightboxClose');
  const prev=document.getElementById('lightboxPrev');
  const next=document.getElementById('lightboxNext');
  const links=Array.from(document.querySelectorAll('.view-photos[data-image]'));
  let index=0;
  function openPhoto(i){
    if(!lightbox || !image || !links.length)return;
    index=(i+links.length)%links.length;
    const link=links[index];
    image.src=link.getAttribute('data-image');
    image.alt=link.getAttribute('data-caption')||'Marina Villa photo';
    if(caption)caption.textContent=link.getAttribute('data-caption')||'';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('lightbox-open');
  }
  function closePhoto(){
    if(!lightbox)return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('lightbox-open');
    if(image)image.removeAttribute('src');
  }
  links.forEach((link,i)=>link.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openPhoto(i);}));
  close?.addEventListener('click',e=>{e.preventDefault();closePhoto();});
  prev?.addEventListener('click',e=>{e.preventDefault();openPhoto(index-1);});
  next?.addEventListener('click',e=>{e.preventDefault();openPhoto(index+1);});
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closePhoto();});
  document.addEventListener('keydown',e=>{
    if(!lightbox?.classList.contains('open'))return;
    if(e.key==='Escape')closePhoto();
    if(e.key==='ArrowLeft')openPhoto(index-1);
    if(e.key==='ArrowRight')openPhoto(index+1);
  });
});
