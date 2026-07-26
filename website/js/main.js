/* ============================================================
   Hiệu ứng trang portfolio — thuần JavaScript, không thư viện
   ============================================================ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- dữ liệu brand book ---------- */
const BRANDBOOK = [
  { n: 1,  cap: 'Trang bìa — “Sống chậm, tận hưởng Việt”' },
  { n: 2,  cap: 'Tổng quan Tập đoàn Mường Thanh Hospitality' },
  { n: 3,  cap: 'Giới thiệu Mường Thanh Boutique & 4 dòng phòng' },
  { n: 4,  cap: 'Bộ nhận diện thương hiệu — logo, màu sắc, linh vật' },
  { n: 5,  cap: 'Chân dung khách hàng & Brand Key' },
  { n: 6,  cap: 'Boutique Culture — chiến lược IMC' },
  { n: 7,  cap: 'Boutique Wellness Zen — chiến lược IMC' },
  { n: 8,  cap: 'Boutique Family — chiến lược IMC' },
  { n: 9,  cap: 'Boutique Love — chiến lược IMC' },
  { n: 10, cap: 'Event “Zen Moment” & CSR “Dấu ấn bản địa”' },
  { n: 11, cap: 'Tài trợ chương trình “2 Ngày 1 Đêm 2026”' },
  { n: 12, cap: 'Bìa sau — nhóm thực hiện' },
];

const pad = n => String(n).padStart(2, '0');

/* ---------- dựng gallery ---------- */
const track = document.getElementById('galleryTrack');
BRANDBOOK.forEach((page, i) => {
  const btn = document.createElement('button');
  btn.className = 'gal-item';
  btn.setAttribute('aria-label', `Xem trang ${page.n}: ${page.cap}`);
  btn.dataset.index = i;
  btn.innerHTML = `
    <img src="assets/brandbook/thumbs/${pad(page.n)}.jpg" alt="Trang ${page.n} brand book Mường Thanh Boutique" loading="lazy">
    <figcaption><b>${pad(page.n)}</b> ${page.cap}</figcaption>`;
  track.appendChild(btn);
});

/* ---------- danh sách ảnh cho lightbox (brand book + slide TH) ---------- */
const LIGHTBOX_ITEMS = BRANDBOOK.map(p => ({
  src: `assets/brandbook/${pad(p.n)}.jpg`,
  cap: `Brand book Mường Thanh Boutique — trang ${pad(p.n)} · ${p.cap}`,
}));
document.querySelectorAll('[data-full]').forEach(el => {
  LIGHTBOX_ITEMS.push({ src: el.dataset.full, cap: el.dataset.caption });
  el.dataset.lbIndex = LIGHTBOX_ITEMS.length - 1;
});

/* ---------- lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
let lbIndex = 0;
let lastFocus = null;

function openLightbox(i) {
  lbIndex = i;
  renderLightbox();
  lastFocus = document.activeElement;
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
  setTimeout(() => { lightbox.hidden = true; }, 300);
  if (lastFocus) lastFocus.focus();
}
function renderLightbox() {
  const item = LIGHTBOX_ITEMS[lbIndex];
  lbImg.src = item.src;
  lbImg.alt = item.cap;
  lbCaption.textContent = item.cap;
}
function stepLightbox(dir) {
  lbIndex = (lbIndex + dir + LIGHTBOX_ITEMS.length) % LIGHTBOX_ITEMS.length;
  renderLightbox();
}

track.addEventListener('click', e => {
  const item = e.target.closest('.gal-item');
  if (item && !track.classList.contains('was-dragged')) openLightbox(+item.dataset.index);
});
document.querySelectorAll('[data-full]').forEach(el => {
  el.addEventListener('click', () => openLightbox(+el.dataset.lbIndex));
});
document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => stepLightbox(-1));
document.getElementById('lbNext').addEventListener('click', () => stepLightbox(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') stepLightbox(-1);
  if (e.key === 'ArrowRight') stepLightbox(1);
});

/* ---------- gallery: nút điều hướng + kéo ngang ---------- */
const stepWidth = () => (track.querySelector('.gal-item')?.offsetWidth ?? 240) + 18;
document.getElementById('galPrev').addEventListener('click', () =>
  track.scrollBy({ left: -stepWidth() * 2, behavior: prefersReduced ? 'auto' : 'smooth' }));
document.getElementById('galNext').addEventListener('click', () =>
  track.scrollBy({ left: stepWidth() * 2, behavior: prefersReduced ? 'auto' : 'smooth' }));

let dragStartX = 0, dragScroll = 0, dragging = false;
track.addEventListener('pointerdown', e => {
  dragging = true; dragStartX = e.clientX; dragScroll = track.scrollLeft;
  track.classList.remove('was-dragged');
});
window.addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - dragStartX;
  if (Math.abs(dx) > 6) {
    track.classList.add('is-dragging', 'was-dragged');
    track.scrollLeft = dragScroll - dx;
  }
});
window.addEventListener('pointerup', () => {
  dragging = false;
  track.classList.remove('is-dragging');
  setTimeout(() => track.classList.remove('was-dragged'), 50);
});

/* ---------- thanh tiến độ + trạng thái nav ---------- */
const progressBar = document.getElementById('progressBar');
const nav = document.getElementById('nav');
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = `${(scrollY / max) * 100}%`;
  nav.classList.toggle('is-scrolled', scrollY > 40);
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- menu mobile ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
}));

/* ---------- hiệu ứng xuất hiện khi cuộn ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- đếm số liệu hero ---------- */
function animateCount(el) {
  const target = +el.dataset.count;
  if (prefersReduced) { el.textContent = target; return; }
  const t0 = performance.now(), dur = 1400;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
const statsIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('dt').forEach(animateCount);
      statsIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
const stats = document.querySelector('.hero__stats');
if (stats) statsIO.observe(stats);

/* ---------- parallax nhẹ cho chân dung ---------- */
const arch = document.getElementById('parallaxArch');
if (arch && !prefersReduced) {
  addEventListener('scroll', () => {
    if (scrollY < innerHeight) arch.style.transform = `translateY(${scrollY * 0.08}px)`;
  }, { passive: true });
}

/* ---------- chuỗi mở màn ---------- */
addEventListener('load', () => document.body.classList.add('is-loaded'));
// dự phòng nếu 'load' đến muộn vì ảnh
setTimeout(() => document.body.classList.add('is-loaded'), 900);
