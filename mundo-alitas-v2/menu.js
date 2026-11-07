/* ==========================================================
   MENÚ DE MUNDO ALITAS
   Edita aquí productos, descripciones y precios (en pesos).
   Estos son datos de EJEMPLO mientras confirmas el menú real.
========================================================== */
(() => {
  'use strict';

  const MA = window.MA;
  const tabsEl = document.getElementById('menuTabs');
  const panelsEl = document.getElementById('menuPanels');
  if (!MA || !tabsEl || !panelsEl) return;

  /* Sabores disponibles: al elegirlos cambia la foto de la tarjeta */
  const FLAVORS = [
    { name: 'BBQ clásica',     img: 'assets/flavor-bbq.jpg',    pos: '50% 38%' },
    { name: 'Picante furiosa', img: 'assets/flavor-hot.jpg',    pos: '45% 45%' },
    { name: 'Mango honey',     img: 'assets/flavor-mango.jpg',  pos: '50% 35%' },
    { name: 'BBQ coreana',     img: 'assets/flavor-korean.jpg', pos: '50% 55%' }
  ];

  /*  flavors: true      → muestra los chips de sabor
      swap: true         → la foto cambia con el sabor
      img / pos          → foto fija (si no hay, se usa el emoji "icon")
      price (número)     → precio en COP; priceNote = texto pequeño bajo el precio  */
  const MENU = [
    {
      id: 'alitas', label: 'Alitas',
      items: [
        { name: 'Alitas de jueves', desc: 'Solo los jueves. Elige tu sabor y pide las que quieras.', price: 1500, priceNote: 'solo jueves', badge: 'Jueves', flavors: true, swap: true },
        { name: '6 alitas',  desc: 'Para el antojo de hoy. Con la salsa que elijas.', price: 17000, flavors: true, swap: true },
        { name: '12 alitas', desc: 'La porción para compartir de a dos.', price: 32000, badge: 'Más pedido', flavors: true, swap: true },
        { name: '24 alitas', desc: 'Para la mesa completa. Puedes mezclar sabores por WhatsApp.', price: 60000, flavors: true, swap: true }
      ]
    },
    {
      id: 'combos', label: 'Combos',
      items: [
        { name: 'Combo Mundo',    desc: '12 alitas, papas y gaseosa.',                price: 38000, badge: 'Favorito', flavors: true, img: 'assets/order-food.jpg', pos: '50% 50%' },
        { name: 'Combo Pareja',   desc: '10 alitas, papas y 2 gaseosas.',             price: 34000, flavors: true, img: 'assets/plan-share.jpg', pos: '50% 55%' },
        { name: 'Combo Familiar', desc: '24 alitas, papas grandes y 4 gaseosas.',     price: 72000, flavors: true, img: 'assets/order-food.jpg', pos: '30% 60%' }
      ]
    },
    {
      id: 'tiras', label: 'Tiras',
      items: [
        { name: 'Tiras crujientes x4', desc: 'Pollo apanado, bien crocante, con salsa.', price: 16000, img: 'assets/plan-share.jpg', pos: '70% 55%' },
        { name: 'Tiras crujientes x8', desc: 'Para compartir, con dos salsas.',          price: 29000, img: 'assets/plan-share.jpg', pos: '50% 55%' }
      ]
    },
    {
      id: 'acompanantes', label: 'Acompañantes',
      items: [
        { name: 'Papas francesas', desc: 'Doradas y calientes.',                   price: 8000, icon: '🍟' },
        { name: 'Yuca frita',      desc: 'Crocante por fuera, suave por dentro.',  price: 7000, icon: '🥔' },
        { name: 'Salsa extra',     desc: 'BBQ, picante, mango honey o coreana.',   price: 2000, icon: '🌶️' }
      ]
    },
    {
      id: 'bebidas', label: 'Bebidas',
      items: [
        { name: 'Gaseosa personal', desc: 'Bien fría.',            price: 4000, icon: '🥤' },
        { name: 'Limonada natural', desc: 'Con hielo.',            price: 6000, icon: '🍋' },
        { name: 'Jugo natural',     desc: 'En agua o en leche.',   price: 7000, icon: '🍹' },
        { name: 'Té helado',        desc: 'Refrescante.',          price: 5000, icon: '🧊' }
      ]
    }
  ];

  const money = n => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const buildCard = (item, index) => {
    const card = el('article', 'menu-card');
    card.style.setProperty('--i', index);

    /* foto o emoji */
    const media = el('div', 'menu-media');
    let img = null;

    if (item.swap) {
      img = el('img');
      img.src = FLAVORS[0].img;
      img.style.objectPosition = FLAVORS[0].pos;
      img.alt = item.name;
      img.loading = 'lazy';
      media.appendChild(img);
    } else if (item.img) {
      img = el('img');
      img.src = item.img;
      img.style.objectPosition = item.pos || '50% 50%';
      img.alt = item.name;
      img.loading = 'lazy';
      media.appendChild(img);
    } else {
      media.appendChild(el('span', 'menu-tile', item.icon || '🍗'));
    }

    if (item.badge) media.appendChild(el('span', 'menu-badge', item.badge));
    card.appendChild(media);

    /* cuerpo */
    const body = el('div', 'menu-body');
    body.appendChild(el('h3', '', item.name));
    body.appendChild(el('p', '', item.desc));

    let flavor = item.flavors ? FLAVORS[0].name : '';
    const order = el('a', 'btn btn-dark btn-small', 'Pedir');
    order.target = '_blank';
    order.rel = 'noopener';

    const updateLink = () => {
      const detail = flavor ? ` — sabor ${flavor}` : '';
      order.href = MA.waLink(`Hola Mundo Alitas 👋 Quiero pedir: ${item.name}${detail}.`);
    };

    if (item.flavors) {
      const chips = el('div', 'chips');
      chips.setAttribute('role', 'group');
      chips.setAttribute('aria-label', 'Sabor');

      FLAVORS.forEach((f, i) => {
        const chip = el('button', 'chip', f.name);
        chip.type = 'button';
        chip.setAttribute('aria-pressed', String(i === 0));
        chip.addEventListener('click', () => {
          flavor = f.name;
          [...chips.children].forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
          if (item.swap && img) {
            img.src = f.img;
            img.style.objectPosition = f.pos;
          }
          updateLink();
        });
        chips.appendChild(chip);
      });

      body.appendChild(chips);
    }

    const foot = el('div', 'menu-foot');
    const price = el('div', 'menu-price', money(item.price));
    if (item.priceNote) price.appendChild(el('small', '', item.priceNote));
    foot.append(price, order);
    body.appendChild(foot);
    card.appendChild(body);

    updateLink();
    return card;
  };

  MENU.forEach((category, i) => {
    const tab = el('button', 'tab-btn', category.label);
    tab.type = 'button';
    tab.id = `tab-${category.id}`;
    tab.setAttribute('role', 'tab');
    tab.dataset.tab = category.id;
    tab.setAttribute('aria-selected', String(i === 0));
    if (i !== 0) tab.tabIndex = -1;
    tabsEl.appendChild(tab);

    const panel = el('div', 'tab-panel');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.dataset.panel = category.id;
    panel.hidden = i !== 0;

    const grid = el('div', 'menu-grid');
    category.items.forEach((item, n) => grid.appendChild(buildCard(item, n)));
    panel.appendChild(grid);
    panelsEl.appendChild(panel);
  });

  MA.initTabs(document.getElementById('menuTabsRoot'), true);
})();
