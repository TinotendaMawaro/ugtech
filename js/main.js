/* ============================================
   UG TECH - Main JavaScript
   ============================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---------- Service Catalog Filter ----------
function filterCatalog(category) {
  const cards = document.querySelectorAll('.catalog-card[data-category]');
  const tabs = document.querySelectorAll('.filter-tab');

  tabs.forEach(tab => {
    tab.className = "filter-tab px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-400 hover:text-white transition-all";
  });

  const currentTab = document.getElementById(`tab-${category}`);
  if (currentTab) {
    currentTab.className = "filter-tab px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-orange text-white transition-all";
  }

  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 50);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 200);
    }
  });
}

// Initialize default tab
function initCatalogTabs() {
  const allTab = document.getElementById('tab-all');
  if (allTab) {
    allTab.className = "filter-tab px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-orange text-white transition-all";
  }
}

// ---------- Banner Particles ----------
function initBannerParticles() {
  const container = document.getElementById('banner-particles');
  if (!container) return;

  const particleCount = 20;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'banner-particle';
    
    const size = 3 + Math.random() * 5;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 6 + Math.random() * 6;
    
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      top: ${top}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: ${0.2 + Math.random() * 0.4};
    `;
    
    fragment.appendChild(particle);
  }

  container.appendChild(fragment);
}

// ---------- Background Particle Canvas ----------
const bgCanvas = document.getElementById('bg-particles');
let bgCtx = null;
let bgWidth = 0;
let bgHeight = 0;
const bgParticles = [];
let maxParticles = 75;

function ensureBgCanvas() {
  if (!bgCanvas) return false;
  bgCtx = bgCanvas.getContext('2d');
  bgWidth = bgCanvas.width = window.innerWidth;
  bgHeight = bgCanvas.height = window.innerHeight;
  maxParticles = window.innerWidth < 768 ? 35 : 75;
  return true;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * bgWidth;
    this.y = Math.random() * bgHeight;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 2 + 1;
    this.color = Math.random() > 0.4 ? 'rgba(255, 107, 0, 0.25)' : 'rgba(255, 255, 255, 0.1)';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > bgWidth) this.vx *= -1;
    if (this.y < 0 || this.y > bgHeight) this.vy *= -1;
  }

  draw() {
    if (!bgCtx) return;
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    bgCtx.fillStyle = this.color;
    bgCtx.fill();
  }
}

function initParticles() {
  bgParticles.length = 0;
  for (let i = 0; i < maxParticles; i++) {
    bgParticles.push(new Particle());
  }
}

let mouseBgX = null;
let mouseBgY = null;

window.addEventListener('mousemove', (e) => {
  mouseBgX = e.clientX;
  mouseBgY = e.clientY;
});

window.addEventListener('mouseout', () => {
  mouseBgX = null;
  mouseBgY = null;
});

function animateParticles() {
  if (!bgCtx) return;
  bgCtx.clearRect(0, 0, bgWidth, bgHeight);

  for (let i = 0; i < bgParticles.length; i++) {
    const p = bgParticles[i];
    p.update();
    p.draw();

    if (mouseBgX !== null && mouseBgY !== null) {
      const dx = mouseBgX - p.x;
      const dy = mouseBgY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        p.x += dx * 0.003;
        p.y += dy * 0.003;
      }
    }

    for (let j = i + 1; j < bgParticles.length; j++) {
      const p2 = bgParticles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        const alpha = (1 - dist / 110) * 0.15;
        bgCtx.strokeStyle = `rgba(255, 107, 0, ${alpha})`;
        bgCtx.lineWidth = 0.5;
        bgCtx.beginPath();
        bgCtx.moveTo(p.x, p.y);
        bgCtx.lineTo(p2.x, p2.y);
        bgCtx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  if (ensureBgCanvas()) {
    initParticles();
  }
});

if (ensureBgCanvas()) {
  initParticles();
  animateParticles();
}

// ---------- Custom Cursor ----------
const cursorRing = document.getElementById('custom-cursor-ring');
const cursorDot = document.getElementById('custom-cursor-dot');

let ringX = 0, ringY = 0;
let targetCursorX = 0, targetCursorY = 0;

window.addEventListener('mousemove', (e) => {
  targetCursorX = e.clientX;
  targetCursorY = e.clientY;

  if (cursorDot) {
    cursorDot.style.left = `${targetCursorX}px`;
    cursorDot.style.top = `${targetCursorY}px`;
    cursorDot.style.opacity = '1';
  }
  if (cursorRing) {
    cursorRing.style.opacity = '1';
  }
});

function updateCursorRing() {
  ringX += (targetCursorX - ringX) * 0.15;
  ringY += (targetCursorY - ringY) * 0.15;

  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }

  requestAnimationFrame(updateCursorRing);
}
updateCursorRing();

function reapplyCursorListeners() {
  if (!cursorRing) return;
  document.querySelectorAll('a, button, [role="button"], input, select, textarea, .catalog-card, .diag-opt-btn, .bat-btn').forEach(item => {
    item.addEventListener('mouseenter', () => {
      cursorRing.classList.add('scale-150');
      cursorRing.style.borderColor = '#ff8533';
      cursorRing.style.backgroundColor = 'rgba(255, 107, 0, 0.05)';
    });
    item.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('scale-150');
      cursorRing.style.borderColor = '#ff6b00';
      cursorRing.style.backgroundColor = 'transparent';
    });
  });
}

// ---------- 3D Holographic Card Tilting ----------
document.querySelectorAll('.catalog-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPercent = mouseX / rect.width;
    const yPercent = mouseY / rect.height;

    const maxRotation = 10;
    const rotateY = ((xPercent - 0.5) * maxRotation * 2).toFixed(2);
    const rotateX = ((0.5 - yPercent) * maxRotation * 2).toFixed(2);

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    card.style.boxShadow = '0 20px 45px rgba(255, 107, 0, 0.15)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.boxShadow = '';
  });
});

// ---------- Leaflet Map (Vainona) ----------
document.addEventListener("DOMContentLoaded", function() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer || typeof L === 'undefined') return;

  const map = L.map('map', {
    center: [-17.7562, 31.0772],
    zoom: 15,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);

  const orangeIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div class='w-5 h-5 bg-brand-orange rounded-full border-2 border-white shadow-neon-glow animate-pulse'></div>",
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  L.marker([-17.7562, 31.0772], {icon: orangeIcon}).addTo(map)
    .bindPopup("<div class='text-black font-space'><b class='text-brand-orange text-sm font-bold'>UG tech</b><br><span class='text-xs text-gray-600'>7 Rhino Close, Vainona<br>Harare, Zimbabwe</span><br><a href='https://www.google.com/maps/search/?api=1&query=-17.7562,31.0772' target='_blank' class='inline-block text-xs font-bold text-brand-orange hover:underline mt-1'>Open in Google Maps &rarr;</a></div>")
    .openPopup();
  
  calculateBackup();
});

// ---------- AI Video Canvas / CCTV Simulator ----------
const canvas = document.getElementById('ai-video-canvas');
const aiModeState = { current: 'face' };
let aiWidth = 0;
let aiHeight = 0;
let mouseX = 150;
let mouseY = 100;
let targetX = 150;
let targetY = 100;
let aiAnimationFrame = null;

function resizeAiCanvas() {
  if (!canvas || !canvas.parentElement) return;
  aiWidth = canvas.parentElement.clientWidth;
  aiHeight = canvas.parentElement.clientHeight;
  canvas.width = aiWidth;
  canvas.height = aiHeight;
}

window.addEventListener('resize', resizeAiCanvas);

if (canvas) {
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    const normX = ((mouseX / aiWidth) * 100).toFixed(4);
    const normY = ((mouseY / aiHeight) * 100).toFixed(4);
    const hudCoords = document.getElementById('hud-coords');
    if (hudCoords) hudCoords.innerText = `${normX}° E, ${normY}° S`;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
      const normX = ((mouseX / aiWidth) * 100).toFixed(4);
      const normY = ((mouseY / aiHeight) * 100).toFixed(4);
      const hudCoords = document.getElementById('hud-coords');
      if (hudCoords) hudCoords.innerText = `${normX}° E, ${normY}° S`;
    }
  }, { passive: true });
}

const targets = [
  { rx: -30, rz: 180, ry: 0, speed: 0.015, color: '#ff6b00', size: 1.8, label: "Target #12 [HUMAN_PTZ]" },
  { rx: 60, rz: 110, ry: 0, speed: -0.011, color: '#00ffff', size: 1.5, label: "Target #45 [HUMAN_STAFF]" },
  { rx: -80, rz: 70, ry: 0, speed: 0.02, color: '#ffc107', size: 1.4, label: "Target #89 [HUMAN_GUEST]" }
];

const roomWireframe = [
  {p1: [-150, -50, 50], p2: [150, -50, 50]},
  {p1: [150, -50, 50], p2: [150, -50, 250]},
  {p1: [150, -50, 250], p2: [-150, -50, 250]},
  {p1: [-150, -50, 250], p2: [-150, -50, 50]},
  {p1: [-150, 50, 50], p2: [150, 50, 50]},
  {p1: [150, 50, 50], p2: [150, 50, 250]},
  {p1: [150, 50, 250], p2: [-150, 50, 250]},
  {p1: [-150, 50, 250], p2: [-150, 50, 50]},
  {p1: [-150, -50, 50], p2: [-150, 50, 50]},
  {p1: [150, -50, 50], p2: [150, 50, 50]},
  {p1: [150, -50, 250], p2: [150, 50, 250]},
  {p1: [-150, -50, 250], p2: [-150, 50, 250]},
  {p1: [80, -30, 150], p2: [120, -30, 150]},
  {p1: [120, -30, 150], p2: [120, 40, 150]},
  {p1: [120, 40, 150], p2: [80, 40, 150]},
  {p1: [80, 40, 150], p2: [80, -30, 150]},
  {p1: [80, -30, 180], p2: [120, -30, 180]},
  {p1: [120, -30, 180], p2: [120, 40, 180]},
  {p1: [120, 40, 180], p2: [80, 40, 180]},
  {p1: [80, 40, 180], p2: [80, -30, 180]},
  {p1: [80, -30, 150], p2: [80, -30, 180]},
  {p1: [120, -30, 150], p2: [120, -30, 180]},
  {p1: [120, 40, 150], p2: [120, 40, 180]},
  {p1: [80, 40, 150], p2: [80, 40, 180]},
  {p1: [-150, -10, 120], p2: [-150, -10, 170]},
  {p1: [-150, -10, 170], p2: [-150, 50, 170]},
  {p1: [-150, 50, 170], p2: [-150, 50, 120]},
  {p1: [-150, 50, 120], p2: [-150, -10, 120]}
];

function animateAiSimulator() {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const timeTick = performance.now() * 0.001;

  targetX += (mouseX - targetX) * 0.1;
  targetY += (mouseY - targetY) * 0.1;

  ctx.clearRect(0, 0, aiWidth, aiHeight);

  if (aiModeState.current === 'thermal') {
    const thermalGrad = ctx.createRadialGradient(targetX, targetY, 5, targetX, targetY, aiWidth / 2);
    thermalGrad.addColorStop(0, '#ff3700');
    thermalGrad.addColorStop(0.2, '#7a0099');
    thermalGrad.addColorStop(0.6, '#000080');
    thermalGrad.addColorStop(1, '#02020f');
    ctx.fillStyle = thermalGrad;
    ctx.fillRect(0, 0, aiWidth, aiHeight);
  } else {
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, aiWidth, aiHeight);
  }

  const fov = 180;
  const cx = aiWidth / 2;
  const cy = aiHeight / 2;
  const cameraPanAngle = Math.sin(timeTick * 0.4) * 0.45;

  function project3D(x, y, z) {
    const rotX = x * Math.cos(cameraPanAngle) - z * Math.sin(cameraPanAngle);
    const rotZ = x * Math.sin(cameraPanAngle) + z * Math.cos(cameraPanAngle);

    if (rotZ <= 5) return null;

    const scale = fov / rotZ;
    return {
      x: cx + rotX * scale,
      y: cy + y * scale,
      scale: scale
    };
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = aiModeState.current === 'thermal' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 107, 0, 0.22)';

  roomWireframe.forEach(edge => {
    const p1 = project3D(edge.p1[0], edge.p1[1], edge.p1[2]);
    const p2 = project3D(edge.p2[0], edge.p2[1], edge.p2[2]);

    if (p1 && p2) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });

  targets.forEach(tar => {
    tar.rz += Math.sin(timeTick * tar.speed) * 0.8;
    tar.rx += Math.cos(timeTick * tar.speed) * 0.8;

    if (tar.rx > 140) tar.rx = 140;
    if (tar.rx < -140) tar.rx = -140;
    if (tar.rz > 240) tar.rz = 240;
    if (tar.rz < 60) tar.rz = 60;

    const projected = project3D(tar.rx, 20, tar.rz);

    if (projected) {
      const boxWidth = projected.scale * tar.size * 5;
      const boxHeight = projected.scale * tar.size * 12;

      ctx.strokeStyle = aiModeState.current === 'motion' ? '#00e1ff' : '#ff6b00';
      ctx.lineWidth = 1.2;

      ctx.strokeRect(projected.x - boxWidth / 2, projected.y - boxHeight, boxWidth, boxHeight);

      if (aiModeState.current === 'motion') {
        ctx.beginPath();
        ctx.moveTo(projected.x, projected.y);
        ctx.lineTo(projected.x + (tar.speed * 2000), projected.y);
        ctx.strokeStyle = 'rgba(0, 225, 255, 0.5)';
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '8px monospace';
      ctx.fillText(tar.label, projected.x - boxWidth / 2, projected.y - boxHeight - 4);
    }
  });

  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(0, Math.random() * aiHeight, aiWidth, Math.random() * 2);
  }

  ctx.strokeStyle = aiModeState.current === 'thermal' ? '#ffffff' : '#ff6b00';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(targetX, targetY, 30, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(targetX, targetY, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ff6b00';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(targetX - 45, targetY);
  ctx.lineTo(targetX - 15, targetY);
  ctx.moveTo(targetX + 15, targetY);
  ctx.lineTo(targetX + 45, targetY);
  ctx.moveTo(targetX, targetY - 45);
  ctx.lineTo(targetX, targetY - 15);
  ctx.moveTo(targetX, targetY + 15);
  ctx.lineTo(targetX, targetY + 45);
  ctx.stroke();

  if (aiModeState.current === 'face') {
    ctx.strokeStyle = 'rgba(255, 107, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(targetX, targetY - 5, 18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#00ff00';
    const eyeOffset = 6;
    ctx.fillRect(targetX - eyeOffset, targetY - 10, 2, 2);
    ctx.fillRect(targetX + eyeOffset, targetY - 10, 2, 2);
    ctx.fillRect(targetX, targetY - 4, 2, 2);
    ctx.fillRect(targetX - 4, targetY + 3, 8, 2);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(targetX + 50, targetY - 40, 140, 65);
    ctx.strokeStyle = '#ff6b00';
    ctx.strokeRect(targetX + 50, targetY - 40, 140, 65);

    ctx.fillStyle = '#ff6b00';
    ctx.font = 'bold 9px monospace';
    ctx.fillText("FACIAL ID: ACTIVE", targetX + 56, targetY - 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px monospace';
    ctx.fillText("MATCH: USER_D_HARARE", targetX + 56, targetY - 16);
    ctx.fillText("CONFIDENCE: 99.87%", targetX + 56, targetY - 6);
    ctx.fillText("STATUS: AUTHORIZED", targetX + 56, targetY + 4);
    ctx.fillText("LOC Node: Vainona #7", targetX + 56, targetY + 14);

    ctx.strokeStyle = '#ff6b00';
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.lineTo(targetX + 50, targetY - 10);
    ctx.stroke();
  }

  aiAnimationFrame = requestAnimationFrame(animateAiSimulator);
}

function setAiMode(mode) {
  aiModeState.current = mode;
  const modes = ['face', 'thermal', 'motion'];
  modes.forEach(m => {
    const btn = document.getElementById(`btn-mode-${m}`);
    if (!btn) return;
    if (m === mode) {
      btn.className = "px-2 py-1 rounded bg-brand-orange text-black font-bold border border-brand-orange/50 transition-all";
    } else {
      btn.className = "px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all";
    }
  });

  const statusLabel = document.getElementById('ai-scan-status');
  if (!statusLabel) return;

  if (mode === 'face') {
    statusLabel.innerText = "Realtime biometric facial grid mapping active.";
  } else if (mode === 'thermal') {
    statusLabel.innerText = "Thermal scanner: tracking thermal profiles & leaks.";
  } else if (mode === 'motion') {
    statusLabel.innerText = "Vector analysis motion tracker mapping targets.";
  }
}

// ---------- Quote Estimator ----------
let selectedChannelPrice = 0;
let selectedChannelName = '';
let counters = { outdoor: 0, indoor: 0, solar: 0 };
let addonPrice = { web: 0, school: 0 };

const prices = {
  outdoor: 35,
  indoor: 30,
  solar: 85
};

function selectCctvChannels(channels, basePrice) {
  selectedChannelPrice = basePrice;
  selectedChannelName = `${channels}-Channel Hub`;

  const channelButtons = document.querySelectorAll('.channel-btn');
  channelButtons.forEach(btn => {
    btn.className = "channel-btn p-4 rounded-xl border border-white/10 bg-white/5 hover:border-brand-orange/50 text-center transition-all";
  });

  const activeBtn = document.getElementById(`ch-${channels}`);
  if (activeBtn) {
    activeBtn.className = "channel-btn p-4 rounded-xl border-2 border-brand-orange bg-brand-orange/10 text-center transition-all shadow-neon-orange";
  }

  updateEstimatorTotal();
}

function adjustCounter(type, change) {
  counters[type] = Math.max(0, counters[type] + change);
  const counterEl = document.getElementById(`counter-${type}`);
  if (counterEl) counterEl.innerText = counters[type];
  updateEstimatorTotal();
}

function toggleAddon(type, price) {
  const checkbox = document.getElementById(type === 'web' ? 'add-web-dev' : 'add-school-system');
  if (!checkbox) return;
  addonPrice[type] = checkbox.checked ? price : 0;
  updateEstimatorTotal();
}

function updateEstimatorTotal() {
  let total = selectedChannelPrice;
  total += counters.outdoor * prices.outdoor;
  total += counters.indoor * prices.indoor;
  total += counters.solar * prices.solar;
  total += addonPrice.web;
  total += addonPrice.school;

  const quoteTotalEl = document.getElementById('quote-total');
  if (quoteTotalEl) quoteTotalEl.innerText = `$${total.toFixed(2)}`;
}

selectCctvChannels(4, 220);

function sendWhatsAppQuote() {
  let totalVal = selectedChannelPrice + 
                 (counters.outdoor * prices.outdoor) + 
                 (counters.indoor * prices.indoor) + 
                 (counters.solar * prices.solar) + 
                 addonPrice.web + 
                 addonPrice.school;

  let text = `Hi UG Tech! I just used your Premium Interactive Quote Builder on your website and would like a customized system setup quote. Here are my specs:\n\n`;
  
  if (selectedChannelPrice > 0) {
    text += `• CCTV System: ${selectedChannelName} (Base: $${selectedChannelPrice})\n`;
  }
  if (counters.outdoor > 0) {
    text += `• Outdoor Cameras: ${counters.outdoor}x ($${counters.outdoor * prices.outdoor})\n`;
  }
  if (counters.indoor > 0) {
    text += `• Indoor Dome Cameras: ${counters.indoor}x ($${counters.indoor * prices.indoor})\n`;
  }
  if (counters.solar > 0) {
    text += `• Standalone Solar Cameras: ${counters.solar}x ($${counters.solar * prices.solar})\n`;
  }
  if (addonPrice.web > 0) {
    text += `• Service Option: Custom Web Development Integration ($${addonPrice.web})\n`;
  }
  if (addonPrice.school > 0) {
    text += `• Service Option: School Management Automation System ($${addonPrice.school})\n`;
  }

  text += `\nEstimated Total: $${totalVal.toFixed(2)}\n`;
  text += `Address: 7 Rhino Close, Vainona, Harare.\n\nPlease confirm availability and details!`;

  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/263778141047?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}

// ---------- Load Shedding Calculator ----------
function selectBatterySize(ah) {
  const batteryInput = document.getElementById('calc-battery-capacity');
  if (batteryInput) batteryInput.value = ah;

  document.querySelectorAll('.bat-btn').forEach(btn => {
    btn.className = "bat-btn py-2 text-xs font-mono font-bold rounded-lg border border-white/10 bg-white/5 text-center transition-all hover:border-brand-orange/40";
  });

  const activeBtn = document.getElementById(`bat-${ah}`);
  if (activeBtn) {
    activeBtn.className = "bat-btn py-2 text-xs font-mono font-bold rounded-lg border-2 border-brand-orange bg-brand-orange/10 text-center transition-all shadow-neon-orange";
  }

  calculateBackup();
}

function calculateBackup() {
  const camerasInput = document.getElementById('calc-cameras');
  const labelCameras = document.getElementById('label-cameras');
  const batteryInput = document.getElementById('calc-battery-capacity');
  const resultHours = document.getElementById('calc-result-hours');
  const batteryFill = document.getElementById('calc-battery-fill');
  const batteryFillPct = document.getElementById('calc-battery-fill-pct');

  if (!camerasInput || !labelCameras || !batteryInput || !resultHours || !batteryFill || !batteryFillPct) return;

  const cameras = parseInt(camerasInput.value);
  labelCameras.innerText = `${cameras} Cam${cameras > 1 ? 's' : ''}`;

  const batteryAh = parseFloat(batteryInput.value);
  const techInput = document.querySelector('input[name="calc-tech"]:checked');
  const tech = techInput ? techInput.value : 'lead';

  const deviceLoadWatts = cameras * 6;
  const dod = tech === 'lithium' ? 0.9 : 0.5;
  const totalWh = batteryAh * 12 * dod;
  const backupHours = totalWh / deviceLoadWatts;

  resultHours.innerText = `${backupHours.toFixed(1)} Hrs`;

  const fillPct = tech === 'lithium' ? 90 : 50;
  batteryFill.style.width = `${fillPct}%`;
  batteryFillPct.innerText = `${fillPct}% Max Safe Discharge`;
}

selectBatterySize(20);

// ---------- Diagnostic Symptom Hub ----------
let selectedDiagnostic = '';

const diagnosticsData = {
  beeping: {
    title: "DVR/NVR Unit is Beeping Symptom Audit",
    tips: "• <b>High Probability:</b> Hard Drive (HDD) Failure, unformatted disk error, or cooling fan stall.<br>• <b>Immediate Fixes:</b> Log into your Admin screen, click <i>Storage System Setup</i> and trigger a Disk Format. If failure warnings persist, the drive must be replaced.<br>• <b>UG Tech Standard Action:</b> We supply and replace original 1TB to 4TB Western Digital surveillance storage units directly.",
    whatsapp: "Hi UG Tech! My DVR is continuously beeping. I need a technician to inspect/replace my storage hard drive."
  },
  dark: {
    title: "Offline Cameras & Video Loss",
    tips: "• <b>High Probability:</b> Centralized 12V power supply box blown fuse, loose BNC/RJ45 nodes, or damage from storm lightning surge.<br>• <b>Immediate Fixes:</b> Inspect if other cameras are running. If all went black simultaneously, check your main camera power supply unit's green LED status.<br>• <b>UG Tech Standard Action:</b> We carry complete backup replacement adapters and perform structural cabling checks.",
    whatsapp: "Hi UG Tech! My cameras went completely dark / offline. I need an engineering dispatch to check the system cabling & power supply."
  },
  solar: {
    title: "Solar Battery Draining Rapidly",
    tips: "• <b>High Probability:</b> Panel accumulation of thick dust/grease, incorrect compass orientation (must face North in Zim for max sun), or degraded Lithium cells.<br>• <b>Immediate Fixes:</b> Use a micro-cloth to clear dust from solar glass. Check app logs to ensure charging rates exceed 4 hours/day.<br>• <b>UG Tech Standard Action:</b> We supply premium high-capacity standalone panels and provide complete replacement batteries.",
    whatsapp: "Hi UG Tech! My Solar Camera is dying early at night. I need an inspection of the panel angle, cleaning, or battery replacement."
  },
  blurry: {
    title: "Blurry night-vision feed",
    tips: "• <b>High Probability:</b> Dust/spiderwebs on the outer protective dome ring reflecting infrared light back into the lens, or manual focusing slips.<br>• <b>Immediate Fixes:</b> Wipe down the outer casing glass carefully with dry microfiber. Do not use chemical solvents that cloud plastic.<br>• <b>UG Tech Standard Action:</b> We carry professional optical clearing solutions and perform lens re-alignment/focus tuning.",
    whatsapp: "Hi UG Tech! My CCTV feeds are blurry / foggy, especially at night. I need a lens cleaning and focus calibration service."
  }
};

function setDiagnostic(symptom) {
  selectedDiagnostic = symptom;
  const data = diagnosticsData[symptom];

  document.querySelectorAll('.diag-opt-btn').forEach(btn => {
    btn.className = "diag-opt-btn p-4 rounded-xl border border-white/10 bg-white/5 hover:border-brand-orange/40 text-left transition-all flex gap-3 items-center";
  });

  const activeBtn = document.getElementById(`diag-${symptom}`);
  if (activeBtn) {
    activeBtn.className = "diag-opt-btn p-4 rounded-xl border-2 border-brand-orange bg-brand-orange/10 text-left transition-all flex gap-3 items-center shadow-neon-orange";
  }

  const outBox = document.getElementById('diag-output-box');
  const outText = document.getElementById('diag-output-text');

  if (outBox && outText && data) {
    outText.innerHTML = `
      <p class="font-bold text-white text-sm">${data.title}</p>
      <p class="mt-2 text-xs text-gray-300 leading-relaxed">${data.tips}</p>
    `;
    outBox.classList.remove('hidden');
    reapplyCursorListeners();
  }
}

function dispatchTech() {
  if (!selectedDiagnostic) return;
  const data = diagnosticsData[selectedDiagnostic];
  if (!data) return;
  const text = data.whatsapp + "\n\nMy location is around Harare.";
  window.open(`https://wa.me/263778141047?text=${encodeURIComponent(text)}`, '_blank');
}

// ---------- FAQ Toggle ----------
function toggleFaq(id) {
  const ans = document.getElementById(`${id}-ans`);
  const icon = document.getElementById(`${id}-icon`);
  
  if (!ans || !icon) return;

  const isHidden = ans.classList.contains('hidden');
  
  if (isHidden) {
    ans.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
  } else {
    ans.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
  }
}

// ---------- Chatbot ----------
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotLauncher = document.getElementById('chatbot-launcher');
const chatFeed = document.getElementById('chat-feed');
const chatInput = document.getElementById('chat-input');
const typingIndicator = document.getElementById('typing-indicator');

let chatHistory = [];

function toggleChatbot() {
  if (!chatbotWindow || !chatbotLauncher) return;

  chatbotWindow.classList.toggle('hidden');

  if (!chatbotWindow.classList.contains('hidden') && window.innerWidth < 640) {
    chatbotLauncher.classList.add('hidden');
  } else {
    chatbotLauncher.classList.remove('hidden');
  }

  scrollToBottom();
}

function handleChatKey(event) {
  if (event.key === 'Enter') {
    submitUserMessage();
  }
}

function submitUserMessage() {
  if (!chatInput) return;
  const rawText = chatInput.value.trim();
  if (!rawText) return;

  appendMessageBubble(rawText, 'user');
  chatInput.value = '';
  chatHistory.push(`User: ${rawText}`);

  showTyping(true);
  setTimeout(() => {
    const response = generateBotResponse(rawText);
    showTyping(false);
    appendMessageBubble(response, 'bot');
    chatHistory.push(`Assistant: ${response}`);
  }, 900);
}

function sendQuickReply(questionText) {
  appendMessageBubble(questionText, 'user');
  chatHistory.push(`User: ${questionText}`);
  
  showTyping(true);
  setTimeout(() => {
    const response = generateBotResponse(questionText);
    showTyping(false);
    appendMessageBubble(response, 'bot');
    chatHistory.push(`Assistant: ${response}`);
  }, 850);
}

function showTyping(state) {
  if (!typingIndicator || !chatFeed) return;
  if (state) {
    typingIndicator.classList.remove('hidden');
  } else {
    typingIndicator.classList.add('hidden');
  }
  scrollToBottom();
}

function appendMessageBubble(text, sender) {
  if (!chatFeed) return;
  const bubbleWrap = document.createElement('div');
  
  if (sender === 'user') {
    bubbleWrap.className = "flex items-end justify-end max-w-[85%] ml-auto";
    bubbleWrap.innerHTML = `
      <div class="bg-brand-orange text-white text-xs rounded-2xl rounded-tr-none p-3 msg-bubble shadow-md leading-relaxed">
        ${text}
      </div>
    `;
  } else {
    bubbleWrap.className = "flex items-start gap-2.5 max-w-[85%] mr-auto";
    bubbleWrap.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange text-[10px] shrink-0">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3 text-xs text-gray-200 msg-bubble leading-relaxed">
        ${text}
      </div>
    `;
  }

  chatFeed.appendChild(bubbleWrap);
  scrollToBottom();
}

function scrollToBottom() {
  if (chatFeed) {
    chatFeed.scrollTop = chatFeed.scrollHeight;
  }
}

function generateBotResponse(input) {
  const clean = input.toLowerCase();

  if (clean.includes('price') || clean.includes('how much') || clean.includes('cost') || clean.includes('quote')) {
    return `Our base prices are incredibly competitive! For example: \n\n• **2-Channel DVR set**: starting from **$120**\n• **4-Channel setup**: from **$220**\n• **Standalone solar smart cameras**: only **$85/ea**\n• **Custom Web Dev**: projects from **$350**\n\nYou can use our **Quote Configurator** tool right on this page to build a custom bundle and check instant estimates!`;
  }
  if (clean.includes('solar') || clean.includes('loadshedding') || clean.includes('power')) {
    return `Our standalone **Solar Cameras** are 100% load-shedding proof! They charge during the day and work 24/7 on built-in backups with smartphone streaming over WiFi/4G data. No cabling required!`;
  }
  if (clean.includes('where') || clean.includes('address') || clean.includes('location') || clean.includes('office') || clean.includes('harare')) {
    return `Our dispatch office and physical workshop is located at **7 Rhino Close, Vainona, Harare, Zimbabwe**. You can view the interactive map directly below on this page!`;
  }
  if (clean.includes('web') || clean.includes('site') || clean.includes('school') || clean.includes('system') || clean.includes('it')) {
    return `We provide custom premium web services! We build enterprise corporate sites, portals, comprehensive **School Management Systems** (grading, portals, finance tracking), and perform general IT network consultancies.`;
  }
  if (clean.includes('accessory') || clean.includes('phone') || clean.includes('charger')) {
    return `Yes! We supply ultra high-quality phone accessories (GaN rapid fast chargers, shockproof rugged protective cases, vehicle mounts, premium screen guards, and durable sync cables).`;
  }
  if (clean.includes('repair') || clean.includes('fix') || clean.includes('setup') || clean.includes('install')) {
    return `We are full-service **Fix and Supply** experts! Our team will supply the products and carry out onsite repairs, cabling, camera tuning, and system maintenance.`;
  }
  if (clean.includes('contact') || clean.includes('phone') || clean.includes('whatsapp') || clean.includes('email') || clean.includes('number')) {
    return `You can reach our sales desk directly at **sales@ugtech.co.zw** or chat with us on WhatsApp at **0778141047**. Tap the green icon or click 'Continue on WhatsApp' below to export our chat!`;
  }

  return `Got it! I can help you with anything regarding our CCTV setups (2-16 CH, indoor/outdoor/solar), IT consultancy, Web Dev, School Portals, or phone accessories. \n\nWould you like a price estimate, or to speak to our Vainona team directly?`;
}

function handoffToWhatsApp() {
  if (!chatHistory.length) {
    window.open("https://wa.me/263778141047", "_blank");
    return;
  }

  let intro = `Hi UG Tech! I was chatting with your virtual assistant on your website. Here is my query log:\n\n`;
  let conversation = chatHistory.join('\n');
  let fullText = intro + conversation + `\n\nPlease let me know how we can proceed!`;

   window.open(`https://wa.me/263778141047?text=${encodeURIComponent(fullText)}`, '_blank');
}

// ---------- Final Boot ----------
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  let menuOpen = false;

  mobileMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;

    if (menuOpen) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('open');
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-xmark');
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('open');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    }
  });

  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('open');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    });
  });

  const revealElements = document.querySelectorAll('.reveal-element');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  window.addEventListener('load', () => {
    setTimeout(() => {
      ['hero-left', 'hero-right'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('revealed');
      });
    }, 100);
  });

  initBannerParticles();
  initCatalogTabs();
  reapplyCursorListeners();

  resizeAiCanvas();
  animateAiSimulator();
});

