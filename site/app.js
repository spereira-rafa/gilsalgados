const products = [
  {name:'Finger Food', type:'salgados', photo:'finger-food.png', icon:'🥪', description:'Pequenos no tamanho, especiais em cada detalhe.', position:'70% 35%'},
  {name:'Tortas e Torteletes', type:'salgados', photo:'tortas.png', icon:'🥧', description:'Massa douradinha e recheios cheios de sabor.', position:'100% 45%'},
  {name:'Bolos Caseiros', type:'doces', photo:'bolos.png', icon:'🍰', description:'Um carinho em forma de bolo para compartilhar.'},
  {name:'Salgados Tradicionais', type:'salgados', photo:'salgados.png', icon:'🥟', description:'Os queridinhos que não podem faltar na festa.', position:'65% 75%'},
  {name:'Mini Hambúrguer', type:'salgados', photo:'mini-hamburguer.png', icon:'🍔', description:'Pequenos lanches para grandes momentos.', position:'70% 25%'},
  {name:'Lanches Especiais', type:'salgados', photo:'lanches.png', icon:'🥖', description:'Caprichados do primeiro ao último pedaço.'},
  {name:'Tortas Doces', type:'doces', photo:'torta-doce.png', icon:'🍫', description:'A doçura que transforma qualquer ocasião.'},
  {name:'Pastéis Doces', type:'doces', photo:'pasteis-doces.png', icon:'☕', description:'Uma pausa deliciosa para acompanhar seu café.'}
];
function orderUrl(message) { return `https://wa.me/5571985281777?text=${encodeURIComponent(message)}`; }
// Original product photographs imported from spereira-rafa-patch-1.
const availablePhotos = ['finger-food.png', 'tortas.png', 'bolos.png', 'salgados.png', 'mini-hamburguer.png', 'lanches.png', 'pasteis-doces.png', 'torta-doce.png'];
const grid = document.querySelector('#menu-grid');
products.forEach(product => {
  const card = document.createElement('a');
  card.className = 'product'; card.dataset.type = product.type;
  card.href = orderUrl(`Olá, Gil! Gostaria de saber mais sobre ${product.name} e fazer uma encomenda.`);
  card.target = '_blank'; card.rel = 'noopener noreferrer';
  const media = document.createElement('div'); media.className = 'product-media';
  if (product.position) { media.style.backgroundImage = 'url(/gilsalgados/assets/hero.png)'; media.style.backgroundPosition = product.position; media.classList.add('illustration'); }
  const fallback = document.createElement('span'); fallback.className = 'food-icon'; fallback.textContent = product.icon; fallback.setAttribute('aria-hidden','true');
  if (!product.position) media.append(fallback);
  const img = document.createElement('img'); if (availablePhotos.includes(product.photo)) img.src = `/gilsalgados/assets/${product.photo}`; img.alt = product.name; img.loading = 'lazy'; img.decoding = 'async'; img.width = 640; img.height = 480; if(product.name === 'Finger Food') img.style.objectPosition = '50% 12%';
  img.onerror = () => img.remove(); img.onload = () => { media.classList.remove('illustration'); fallback.remove(); }; if (availablePhotos.includes(product.photo)) media.append(img);
  const body = document.createElement('div'); body.className = 'product-body';
  const title = document.createElement('h3'); title.textContent = product.name;
  const description = document.createElement('p'); description.textContent = product.description;
  const cta = document.createElement('span'); cta.className = 'product-cta'; cta.textContent = 'Quero encomendar →';
  body.append(title, description, cta); card.append(media, body); grid.append(card);
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  document.querySelectorAll('.product').forEach(card => { card.hidden = button.dataset.filter !== 'todos' && card.dataset.type !== button.dataset.filter; });
  document.querySelector('#filter-status').textContent = `${document.querySelectorAll('.product:not([hidden])').length} opções no cardápio.`;
}));
document.querySelectorAll('[data-order]').forEach(link => { link.href = orderUrl(link.dataset.order); });
const toggle = document.querySelector('.nav-toggle'); const nav = document.querySelector('nav');
function setMenuOpen(open, returnFocus = false) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('open', open);
  if (returnFocus) toggle.focus();
}
toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  setMenuOpen(false);
  nav.querySelectorAll('a').forEach(item => item.classList.toggle('active', item === link));
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false, true);
});
document.addEventListener('click', event => {
  if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenuOpen(false);
});
window.matchMedia('(max-width: 700px)').addEventListener('change', () => setMenuOpen(false));
const quoteForm = document.querySelector('#quote-form');
const eventDate = quoteForm.elements.date;
function setMinimumDate() {
  const now = new Date();
  eventDate.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
setMinimumDate();
eventDate.addEventListener('focus', setMinimumDate);
quoteForm.addEventListener('submit', event => {
  event.preventDefault();
  setMinimumDate();
  const customer = quoteForm.elements.customer;
  customer.setCustomValidity(customer.value.trim() ? '' : 'Informe seu nome.');
  if (!quoteForm.reportValidity()) return;
  const data = new FormData(quoteForm);
  const date = data.get('date');
  const message = [
    `Olá, Gil! Meu nome é ${data.get('customer').trim()} e gostaria de um orçamento.`,
    `Evento: ${data.get('occasion')}`,
    date ? `Data: ${date.split('-').reverse().join('/')}` : 'Data: a combinar',
    `Quantidade de pessoas: ${data.get('guests')}`,
    data.get('preferences').trim() ? `Preferências: ${data.get('preferences').trim()}` : '',
    'Podemos conversar sobre as opções e a disponibilidade?'
  ].filter(Boolean).join('\n');
  window.location.assign(orderUrl(message));
});
quoteForm.elements.customer.addEventListener('input', () => quoteForm.elements.customer.setCustomValidity(''));
document.querySelector('#year').textContent = new Date().getFullYear();
