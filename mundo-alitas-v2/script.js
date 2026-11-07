(() => {
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];
  $('#year').textContent = new Date().getFullYear();

  const header = $('.header');
  const toggle = $('.mobile-toggle');
  toggle?.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded','false');
  }));

  const rail = $('#productRail');
  $('.carousel-next')?.addEventListener('click', () => rail.scrollBy({left: rail.clientWidth * .72, behavior:'smooth'}));
  $('.carousel-prev')?.addEventListener('click', () => rail.scrollBy({left: -rail.clientWidth * .72, behavior:'smooth'}));

  // Placeholder de WhatsApp: sustituir por el número real en formato internacional, sin + ni espacios.
  const whatsappNumber = '570000000000';
  $('#whatsappLink')?.addEventListener('click', e => {
    if (whatsappNumber === '570000000000') {
      e.preventDefault();
      alert('Configura el número real de WhatsApp de Mundo Alitas en script.js antes de publicar.');
    }
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = $('.preloader');
  if (window.gsap && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);
    const counter = {value:0};
    gsap.to(counter, {
      value:100, duration:1.35, ease:'power2.inOut',
      onUpdate:()=>$('.load-number').textContent = `${Math.round(counter.value).toString().padStart(2,'0')}%`,
      onComplete:()=>{
        gsap.to(loader,{yPercent:-100,duration:.85,ease:'power4.inOut',onComplete:()=>loader.remove()});
        gsap.from('.header > *, .hero-kickers span',{y:-18,opacity:0,duration:.7,stagger:.08,ease:'power3.out',delay:.1});
        gsap.from('.hero-title span',{yPercent:110,opacity:0,duration:1.05,stagger:.12,ease:'power4.out',delay:.12});
        gsap.from('.hero-product',{scale:.78,y:55,opacity:0,duration:1.15,ease:'back.out(1.35)',delay:.25});
        gsap.from('.hero-bottom > *',{y:20,opacity:0,duration:.65,stagger:.12,ease:'power3.out',delay:.55});
      }
    });
    gsap.utils.toArray('.reveal').forEach(el=>{
      gsap.fromTo(el,{y:48,opacity:0},{y:0,opacity:1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}});
    });
    gsap.to('.origin-image img',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.origin',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.to('.story-visual img',{yPercent:8,ease:'none',scrollTrigger:{trigger:'.story-split',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.from('.product-card',{y:35,opacity:0,duration:.7,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.product-rail',start:'top 85%',once:true}});
    gsap.from('.value-item',{y:22,opacity:0,duration:.6,stagger:.12,scrollTrigger:{trigger:'.values',start:'top 90%',once:true}});
    gsap.from('.order-copy > *',{x:35,opacity:0,duration:.65,stagger:.1,scrollTrigger:{trigger:'.order-copy',start:'top 80%',once:true}});
    gsap.to('.manifesto h2',{xPercent:-3,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1}});
  } else {
    loader?.remove();
    $$('.reveal').forEach(el=>el.classList.add('is-visible'));
  }

  // Drag horizontal del carrusel con ratón y touch.
  let down=false, startX=0, scrollLeft=0;
  rail?.addEventListener('pointerdown',e=>{down=true;startX=e.clientX;scrollLeft=rail.scrollLeft;rail.setPointerCapture(e.pointerId);});
  rail?.addEventListener('pointermove',e=>{if(!down)return;rail.scrollLeft=scrollLeft-(e.clientX-startX);});
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>rail?.addEventListener(ev,()=>down=false));
})();