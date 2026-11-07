(() => {
  'use strict';

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const header = $('.header');
  const toggle = $('.mobile-toggle');
  const loader = $('.preloader');

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* AÑO AUTOMÁTICO */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* CABECERA DINÁMICA */
  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 35);
  };

  updateHeader();

  window.addEventListener('scroll', updateHeader, {
    passive: true
  });

  /* MENÚ MÓVIL */
  const closeMenu = () => {
    header?.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir navegación');
  };

  toggle?.addEventListener('click', () => {
    const opened = header.classList.toggle('menu-open');

    toggle.setAttribute('aria-expanded', String(opened));
    toggle.setAttribute(
      'aria-label',
      opened ? 'Cerrar navegación' : 'Abrir navegación'
    );
  });

  $$('.nav a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', event => {
    if (
      header?.classList.contains('menu-open') &&
      !header.contains(event.target)
    ) {
      closeMenu();
    }
  });

  /* HISTORIA: LAS PALABRAS SE ENCIENDEN AL HACER SCROLL */
  const statement = $('#statementText');
  let words = [];

  if (statement) {
    words = statement.textContent.trim().split(/\s+/).map(text => {
      const span = document.createElement('span');
      span.className = 'w';
      span.textContent = text;
      return span;
    });

    statement.textContent = '';

    words.forEach((word, index) => {
      statement.appendChild(word);
      if (index < words.length - 1) {
        statement.appendChild(document.createTextNode(' '));
      }
    });
  }

  const updateStatement = () => {
    if (!words.length) return;

    if (reduceMotion) {
      words.forEach(word => word.classList.remove('is-dim'));
      return;
    }

    const rect = statement.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0,
      (window.innerHeight * .8 - rect.top) / (window.innerHeight * .55)
    ));

    const lit = Math.round(words.length * (.38 + .62 * progress));

    words.forEach((word, index) => {
      word.classList.toggle('is-dim', index >= lit);
    });
  };

  updateStatement();

  window.addEventListener('scroll', updateStatement, { passive: true });
  window.addEventListener('resize', updateStatement);

  /* INSTAGRAM: PENDIENTE DE CONFIGURAR */
  const instagramUrl = '';
  const instagramLink = $('#instagramLink');

  if (instagramLink && instagramUrl) {
    instagramLink.href = instagramUrl;
    instagramLink.target = '_blank';
    instagramLink.rel = 'noopener';
  } else {
    instagramLink?.addEventListener('click', event => event.preventDefault());
  }

  /* SABORES: CAMBIAR IMAGEN CON MOUSE, TOQUE O DESLIZAMIENTO */
  const stage = $('#flavorStage');
  const flavorRows = $$('.flavor-row');
  const shots = $$('.shot', stage || document);
  const dots = $$('.flavor-dots i', stage || document);
  let currentFlavor = -1;

  const setFlavor = index => {
    if (!stage || index === currentFlavor || index < 0 || index >= flavorRows.length) return;

    currentFlavor = index;
    const row = flavorRows[index];

    flavorRows.forEach((item, i) => item.classList.toggle('is-active', i === index));
    shots.forEach((shot, i) => shot.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('on', i === index));

    $('#fName').textContent = row.dataset.name;
    $('#fTag').textContent = row.dataset.tag;
    $('#fDesc').textContent = row.dataset.desc;

    stage.classList.remove('swap');
    void stage.offsetWidth;
    stage.classList.add('swap');
  };

  const touchOnly = window.matchMedia('(hover: none)').matches;

  flavorRows.forEach((row, index) => {
    row.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') setFlavor(index);
    });
    row.addEventListener('focus', () => setFlavor(index));
    row.addEventListener('click', event => {
      if (touchOnly) {
        event.preventDefault();
        setFlavor(index);
      }
    });
  });

  /* Dedo deslizando sobre la lista */
  $('.flavor-rows')?.addEventListener('touchmove', event => {
    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const row = target?.closest('.flavor-row');
    if (row) setFlavor(Number(row.dataset.i));
  }, { passive: true });

  /* Deslizar la foto a izquierda o derecha */
  let swipeX = null;

  stage?.addEventListener('touchstart', event => {
    swipeX = event.touches[0].clientX;
  }, { passive: true });

  stage?.addEventListener('touchend', event => {
    if (swipeX === null) return;
    const dx = event.changedTouches[0].clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) < 40) return;
    const total = flavorRows.length;
    setFlavor((currentFlavor + (dx < 0 ? 1 : -1) + total) % total);
  }, { passive: true });

  setFlavor(0);

  /* FOTOS DEL LUGAR: CAMBIO AUTOMÁTICO SUAVE */
  $$('[data-slider]').forEach((box, n) => {
    const slides = $$('.slide', box);
    if (slides.length < 2 || reduceMotion) return;

    let current = 0;

    window.setInterval(() => {
      slides[current].classList.remove('is-on');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-on');
    }, 4800 + n * 900);
  });

  /* WHATSAPP */
  const whatsappNumber = '570000000000';

  $('#whatsappLink')?.addEventListener('click', event => {
    if (whatsappNumber === '570000000000') {
      event.preventDefault();

      alert(
        'Configura el número real de WhatsApp de Mundo Alitas en script.js.'
      );
    }
  });

  /* BARRA DE PROGRESO DEL SCROLL */
  const progress = document.createElement('div');

  progress.className = 'ma-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');

  document.body.appendChild(progress);

  let progressPending = false;

  const updateProgress = () => {
    const total =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = total > 0
      ? (window.scrollY / total) * 100
      : 0;

    progress.style.width = `${Math.min(100, percentage)}%`;
    progressPending = false;
  };

  window.addEventListener('scroll', () => {
    if (progressPending) return;

    progressPending = true;
    requestAnimationFrame(updateProgress);
  }, { passive: true });

  updateProgress();

  /* HERO: LLUVIA DE ALITAS (se crea antes de comprobar GSAP para tener versión estática) */
  const canAnimate = !!(window.gsap && window.ScrollTrigger) && !reduceMotion;
  const rainWings = [];

  (() => {
    const back = $('.rain-back');
    const front = $('.rain-front');
    if (!back || !front) return;

    const small = window.innerWidth < 620;
    const scale = small ? .85 : Math.min(1.15, Math.max(.7, window.innerWidth / 1400));
    const rand = (min, max) => min + Math.random() * (max - min);
    const sources = ['assets/rain-wing-a.webp', 'assets/rain-wing-b.webp'];

    const make = (layer, count, minW, maxW, isFront) => {
      for (let i = 0; i < count; i++) {
        const wing = document.createElement('span');
        const img = document.createElement('img');
        wing.className = 'rain-wing';
        img.src = sources[(i + (isFront ? 1 : 0)) % sources.length];
        img.alt = '';
        img.decoding = 'async';
        wing.style.width = `${Math.round(rand(minW, maxW) * scale)}px`;
        wing.style.left = `${((i + rand(.05, .95)) / count) * 100 - 4}%`;
        if (!canAnimate) {
          wing.style.top = `${rand(4, 78)}%`;
          wing.style.transform = `rotate(${rand(-22, 22)}deg)`;
        }
        wing.appendChild(img);
        layer.appendChild(wing);
        rainWings.push({ wing, img, isFront });
      }
    };

    make(back, small ? 5 : 8, 60, 110, false);
    make(front, small ? 4 : 7, 110, 210, true);
  })();

  /* SEGURIDAD DEL PRELOADER */
  let loaderFinished = false;

  const removeLoader = () => {
    if (loaderFinished) return;

    loaderFinished = true;

    if (!loader) return;

    if (window.gsap && !reduceMotion) {
      window.gsap.to(loader, {
        yPercent: -105,
        duration: .8,
        ease: 'power4.inOut',
        onComplete: () => loader.remove()
      });
    } else {
      loader.remove();
    }
  };

  const loaderTimeout = window.setTimeout(removeLoader, 4800);

  /* SIN GSAP: LA PÁGINA SIGUE FUNCIONANDO */
  if (
    !window.gsap ||
    !window.ScrollTrigger ||
    reduceMotion
  ) {
    window.clearTimeout(loaderTimeout);

    window.setTimeout(removeLoader, 200);

    return;
  }

  /* SISTEMA DE ANIMACIÓN */
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);

  gsap.config({
    nullTargetWarn: false
  });

  /* INTRODUCCIÓN DEL HERO */
  const counter = { value: 0 };

  const loadNumber = $('.load-number');
  const loadBar = $('.preloader-track span');

  const playHero = () => {
    const intro = gsap.timeline();

    intro.from(
      '.header .nav-a a, .header .nav-b a, .brand',
      {
        y: -20,
        autoAlpha: 0,
        duration: .65,
        stagger: .09,
        ease: 'power3.out'
      }
    );

    intro.from(
      '.hero-title .line-one',
      {
        yPercent: 70,
        autoAlpha: 0,
        duration: 1.05,
        ease: 'power4.out'
      },
      '-=.25'
    );

    intro.from(
      '.hero-title .line-two',
      {
        yPercent: 70,
        autoAlpha: 0,
        duration: 1.05,
        ease: 'power4.out'
      },
      '-=.72'
    );

    intro.from(
      '.wing-rain',
      {
        autoAlpha: 0,
        duration: 1.4,
        ease: 'power2.out'
      },
      '-=.7'
    );

    intro.from(
      '.hero-kickers span',
      {
        y: 25,
        autoAlpha: 0,
        duration: .65,
        stagger: .15,
        ease: 'power3.out'
      },
      '-=.6'
    );

    intro.from(
      '.hero-bottom .button',
      {
        y: 25,
        autoAlpha: 0,
        duration: .65,
        ease: 'power3.out'
      },
      '-=.35'
    );
  };

  /* INTRO: LA MANO DE ADÁN Y LA ALITA SE ACERCAN */
  const creation = gsap.timeline({ delay: .1 });

  creation
    .fromTo('.intro-hand',
      { xPercent: -75, autoAlpha: 0 },
      { xPercent: 0, autoAlpha: 1, duration: 1.7, ease: 'power3.out' }, 0)
    .fromTo('.intro-wing',
      { xPercent: 75, yPercent: 6, rotation: 8, autoAlpha: 0, transformOrigin: '50% 60%' },
      { xPercent: 0, yPercent: 0, rotation: 0, autoAlpha: 1, duration: 1.8, ease: 'power3.out' }, .15)
    .to('.intro-hand', { xPercent: 2.5, duration: .55, ease: 'sine.inOut' }, '>-.1')
    .to('.intro-wing', { xPercent: -2.5, duration: .55, ease: 'sine.inOut' }, '<')
    .fromTo('.intro-spark',
      { scale: 0, autoAlpha: 0 },
      { scale: 1.6, autoAlpha: 1, duration: .28, ease: 'power2.out' }, '>-.05')
    .to('.intro-spark', { scale: 2.4, autoAlpha: 0, duration: .45, ease: 'power2.in' });

  gsap.to(counter, {
    value: 100,
    duration: 2.7,
    delay: .1,
    ease: 'power2.inOut',

    onUpdate: () => {
      const number = Math.round(counter.value)
        .toString()
        .padStart(2, '0');

      if (loadNumber) {
        loadNumber.textContent = `${number}%`;
      }

      if (loadBar) {
        loadBar.style.width = `${counter.value}%`;
      }
    },

    onComplete: () => {
      window.clearTimeout(loaderTimeout);

      if (!loader) {
        playHero();
        return;
      }

      gsap.to(loader, {
        yPercent: -105,
        duration: .8,
        delay: .2,
        ease: 'power4.inOut',

        onComplete: () => {
          loader.remove();
          loaderFinished = true;
          playHero();
        }
      });
    }
  });

  /* TITULARES: CADA PALABRA SUBE DESDE UNA MÁSCARA */
  const splitWords = element => {
    const text = element.textContent.trim();
    element.textContent = '';
    element.setAttribute('aria-label', text);

    return text.split(/\s+/).map((word, index, list) => {
      const mask = document.createElement('span');
      const inner = document.createElement('span');
      mask.className = 'mask';
      inner.className = 'in';
      inner.textContent = word;
      mask.appendChild(inner);
      element.appendChild(mask);
      if (index < list.length - 1) element.appendChild(document.createTextNode(' '));
      return inner;
    });
  };

  ['.flavors-list h2', '.plan h2', '.order-copy h2', '.visit-info h2'].forEach(selector => {
    $$(selector).forEach(element => {
      const pieces = splitWords(element);

      gsap.from(pieces, {
        yPercent: 115,
        duration: 1,
        stagger: .12,
        ease: 'power4.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true }
      });
    });
  });

  /* PIE: "MUNDO ALITAS" LETRA POR LETRA */
  const wordmark = $('.footer-wordmark');

  if (wordmark) {
    const label = wordmark.textContent.trim();
    wordmark.textContent = '';
    wordmark.setAttribute('aria-label', label);

    const letters = [...label].map(char => {
      const mask = document.createElement('span');
      const inner = document.createElement('span');
      mask.className = 'mask';
      inner.className = 'in';
      inner.innerHTML = char === ' ' ? '&nbsp;' : char;
      mask.appendChild(inner);
      wordmark.appendChild(mask);
      return inner;
    });

    gsap.from(letters, {
      yPercent: 110,
      duration: .9,
      stagger: .045,
      ease: 'power4.out',
      scrollTrigger: { trigger: wordmark, start: 'top 92%', once: true }
    });
  }

  /* FOTOS DEL LUGAR: SE ABREN DESDE ABAJO Y HACEN ZOOM */
  const revealPhotos = (selector, trigger) => {
    const items = $$(selector);
    if (!items.length) return;

    gsap.fromTo(
      items,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.15,
        stagger: .16,
        ease: 'power4.inOut',
        scrollTrigger: { trigger, start: 'top 82%', once: true }
      }
    );

    gsap.fromTo(
      items.map(item => item.querySelector('img, .ph-icon, figcaption')).filter(Boolean),
      { scale: 1.18 },
      {
        scale: 1,
        duration: 1.6,
        stagger: .16,
        ease: 'power3.out',
        scrollTrigger: { trigger, start: 'top 82%', once: true }
      }
    );
  };

  revealPhotos('.plan-grid > *', '.plan-grid');
  revealPhotos('.visit-gallery > *', '.visit-gallery');
  revealPhotos('.order > .order-photo-food', '.order');

  /* SABORES: FILAS EN SECUENCIA */
  gsap.fromTo(
    '.flavor-rows li',
    { y: 28, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: .7,
      stagger: .12,
      ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: {
        trigger: '.flavor-rows',
        start: 'top 85%',
        once: true
      }
    }
  );

  /* PLAN: LOS TRES PUNTOS */
  gsap.fromTo(
    '.plan-points article',
    { y: 30, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: .7,
      stagger: .14,
      ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: {
        trigger: '.plan-points',
        start: 'top 88%',
        once: true
      }
    }
  );

  /* PEDIDO: LAS ALITAS SUBEN DESDE ABAJO */
  gsap.fromTo(
    '.order-wings',
    { y: 90, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.order',
        start: 'top 60%',
        once: true
      }
    }
  );

  /* BANDAS: SE ABREN DESDE EL CENTRO */
  $$('.ticker').forEach(ticker => {
    gsap.fromTo(
      ticker,
      { clipPath: 'inset(0 50% 0 50%)' },
      {
        clipPath: 'inset(0 0% 0 0%)',
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: ticker,
          start: 'top 92%',
          once: true
        }
      }
    );
  });

  /* HERO: LLUVIA DE ALITAS */
  const rainTweens = [];
  const hero = $('.hero');
  const fall = Math.max(hero ? hero.offsetHeight : 0, 760);

  rainWings.forEach(({ wing, img, isFront }) => {
    const size = wing.offsetWidth;
    const dur = isFront ? gsap.utils.random(6.5, 10) : gsap.utils.random(11, 16);
    const startY = -(size * 1.6);

    gsap.set(wing, { y: startY });

    const drop = gsap.to(wing, {
      y: fall + size * .6,
      duration: dur,
      ease: 'none',
      repeat: -1
    });
    drop.progress(Math.random());

    const tilt = gsap.utils.random(10, 26);
    const spin = gsap.fromTo(img,
      { rotation: -tilt },
      { rotation: tilt, duration: gsap.utils.random(2.6, 4.6), ease: 'sine.inOut', yoyo: true, repeat: -1 }
    );
    spin.progress(Math.random());

    const sway = gsap.to(img, {
      x: gsap.utils.random(18, 46) * (Math.random() < .5 ? -1 : 1),
      duration: gsap.utils.random(1.8, 3.2),
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    rainTweens.push(drop, spin, sway);
  });

  /* Solo se anima mientras el hero se ve */
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: self => rainTweens.forEach(t => (self.isActive ? t.resume() : t.pause()))
  });

  if (window.matchMedia('(hover: hover)').matches) {
    const moveBack = gsap.quickTo('.rain-back', 'x', { duration: 1.2, ease: 'power3.out' });
    const moveFront = gsap.quickTo('.rain-front', 'x', { duration: .9, ease: 'power3.out' });
    const moveTitle = gsap.quickTo('.hero-title', 'x', { duration: 1.2, ease: 'power3.out' });

    $('.hero')?.addEventListener('pointermove', event => {
      const px = event.clientX / window.innerWidth - .5;

      moveBack(px * -14);
      moveFront(px * 40);
      moveTitle(px * -18);
    });
  }

  gsap.to('.rain-front', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  gsap.to('.order-wings', {
    y: -14,
    rotation: -1.5,
    duration: 2.6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });

  gsap.to('.plan-grid .ph-wide .ph-icon', {
    y: -6,
    duration: 1.6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });

  /* REFRESCAR CÁLCULOS CUANDO CARGUEN LAS IMÁGENES */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  }, { once: true });

  window.setTimeout(() => {
    ScrollTrigger.refresh();
  }, 700);

})();