// ========== TRANSLATIONS ==========
const translations = {
  en: {
    navHome: "Home", navMenu: "Menu", navOmakase: "Omakase", navReserve: "Reserve",
    heroTitle1: "Art of Edomae", heroTitle2: "Sushi Master", heroDesc: "Modern Japanese kaiseki & sushi craftsmanship. Omakase experiences by our head chef, rooted in tradition, lifted by innovation.",
    exploreMenuBtn: "Explore Menu", chefTastingBtn: "Chef's Tasting",
    menuTitle: "Our Culinary Journey", menuSub: "Chef's signatures & timeless classics",
    filterAll: "All", filterChef: "Chef's Selection", filterClassic: "Classic Favorites", filterNigiri: "Nigiri", filterMaki: "Maki & Rolls", filterApp: "Appetizers", filterDessert: "Dessert",
    omakaseTitle: "Chef's Omakase \"Sushi Master\"", omakaseDesc: "An exclusive 12-course tasting menu curated daily by head chef Kenji Tanaka. Featuring rare seafood, A5 Wagyu, truffle-infused tamago, and seasonal treasures from Toyosu market.",
    feature1: "12 seasonal courses + sake pairing option", feature2: "Private counter seating (2 hours)", feature3: "Edomae-style aged nigiri & hand rolls", feature4: "Complimentary matcha petit four",
    reserveTitle: "Reserve Omakase", secureBtn: "Secure reservation", address: "42 Ginza Central, Tokyo", footerTag: "Modern Japanese Omakase & Sushi Bar",
    chefBadge: "Chef's Selection", classicBadge: "Classic Favorite", locationText: "Ginza, Tokyo"
  },
  it: {
    navHome: "Home", navMenu: "Menu", navOmakase: "Omakase", navReserve: "Prenota",
    heroTitle1: "Arte dell'Edomae", heroTitle2: "Sushi Master", heroDesc: "Maestria giapponese moderna del kaiseki e sushi. Esperienze Omakase del nostro chef, radicate nella tradizione, elevate dall'innovazione.",
    exploreMenuBtn: "Esplora il Menu", chefTastingBtn: "Degustazione Chef",
    menuTitle: "Il Nostro Viaggio Culinario", menuSub: "Signature dello chef e classici senza tempo",
    filterAll: "Tutti", filterChef: "Selezione Chef", filterClassic: "Preferiti Classici", filterNigiri: "Nigiri", filterMaki: "Maki & Roll", filterApp: "Antipasti", filterDessert: "Dolci",
    omakaseTitle: "Omakase dello Chef \"Sushi Master\"", omakaseDesc: "Un esclusivo menu degustazione di 12 portate curato ogni giorno dallo chef Kenji Tanaka. Con frutti di mare rari, A5 Wagyu, tamago al tartufo e tesori stagionali del mercato di Toyosu.",
    feature1: "12 portate stagionali + opzione abbinamento sake", feature2: "Posti al bancone privato (2 ore)", feature3: "Nigiri e hand roll invecchiati stile Edomae", feature4: "Matcha petit four in omaggio",
    reserveTitle: "Prenota Omakase", secureBtn: "Prenotazione sicura", address: "42 Ginza Central, Tokyo", footerTag: "Omakase giapponese moderno & sushi bar",
    chefBadge: "Selezione Chef", classicBadge: "Preferito Classico", locationText: "Ginza, Tokyo"
  }
};

let currentLang = 'en';
let currentCurrency = 'JPY';
let currentFilter = "all";
let menuItems = []; // Will be loaded from JSON
const TASTING_PRICE_JPY = 22000;
const JPY_TO_EUR_RATE = 0.00625;

function formatPrice(amountJPY) {
  if (currentCurrency === 'JPY') return `¥${amountJPY.toLocaleString()}`;
  return `€${(amountJPY * JPY_TO_EUR_RATE).toFixed(2)}`;
}

function filterItems(category) {
  if (!menuItems.length) return [];
  if (category === "all") return menuItems;
  if (category === "chef") return menuItems.filter(i => i.type === "chef");
  if (category === "classic") return menuItems.filter(i => i.type === "classic");
  return menuItems.filter(item => item.subcats && item.subcats.includes(category));
}

function renderMenu() {
  const container = document.getElementById("menuGrid");
  if (!container) return;
  if (!menuItems.length) {
    container.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> Loading menu...</div>`;
    return;
  }
  const filtered = filterItems(currentFilter);
  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem;">No dishes in this category</div>`;
    return;
  }
  container.innerHTML = filtered.map(item => {
    const isChef = item.type === "chef";
    const badgeKey = isChef ? 'chefBadge' : 'classicBadge';
    const badgeText = translations[currentLang][badgeKey];
    const badgeClass = isChef ? "order-badge" : "order-badge classic-badge";
    return `
        <div class="menu-card">
          <div class="card-img" style="background-image: url('${item.img}'); background-size: cover; background-position: center;"></div>
          <div class="card-content">
            <div class="card-header"><span class="dish-name">${currentLang === 'en' ? item.nameEn : item.nameIt}</span><span class="price" data-jpy="${item.priceJPY}">${formatPrice(item.priceJPY)}</span></div>
            <p class="dish-desc">${currentLang === 'en' ? item.descEn : item.descIt}</p>
            <div class="badge-group"><span class="${badgeClass}"><i class="fas ${isChef ? 'fa-star' : 'fa-heart'}"></i> ${badgeText}</span></div>
          </div>
        </div>`;
  }).join('');
}

function updateAllPrices() {
  document.querySelectorAll('.menu-card .price').forEach(span => {
    const jpy = parseInt(span.getAttribute('data-jpy'));
    if (!isNaN(jpy)) span.innerText = formatPrice(jpy);
  });
  const priceLabel = document.getElementById('tastingPriceLabel');
  if (priceLabel) priceLabel.innerText = `${formatPrice(TASTING_PRICE_JPY)} per guest`;
  document.getElementById('currencySymbolTop').innerText = currentCurrency === 'JPY' ? '¥' : '€';
  document.getElementById('currencySymbolNear').innerText = currentCurrency === 'JPY' ? '¥' : '€';
}

function applyLanguage() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (translations[currentLang][key]) el.innerText = translations[currentLang][key];
  });
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const catKey = btn.getAttribute('data-key');
    if (catKey && translations[currentLang][catKey]) btn.innerText = translations[currentLang][catKey];
  });
  document.querySelectorAll('input[data-placeholder-en]').forEach(inp => {
    inp.placeholder = currentLang === 'en' ? inp.getAttribute('data-placeholder-en') : inp.getAttribute('data-placeholder-it');
  });
  document.getElementById('langLabel').innerText = currentLang === 'en' ? 'EN/IT' : 'IT/EN';
  renderMenu();
}

function toggleLanguage() { currentLang = currentLang === 'en' ? 'it' : 'en'; applyLanguage(); localStorage.setItem('sushiMasterLang', currentLang); }
function toggleCurrency() { currentCurrency = currentCurrency === 'JPY' ? 'EUR' : 'JPY'; updateAllPrices(); localStorage.setItem('sushiMasterCurrency', currentCurrency); }

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-category');
      renderMenu();
    });
  });
}

function setupBookingForm() {
  const form = document.getElementById('tastingBookingForm');
  const msgDiv = document.getElementById('bookingMessage');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guestName')?.value.trim();
    const email = document.getElementById('guestEmail')?.value.trim();
    const date = document.getElementById('reserveDate')?.value;
    const time = document.getElementById('reserveTime')?.value;
    const guests = document.getElementById('guestCount')?.value;
    if (!name || !email || !date || !time || !guests) {
      msgDiv.innerHTML = currentLang === 'en' ? '<i class="fas fa-exclamation-triangle"></i> Fill all required fields.' : '<i class="fas fa-exclamation-triangle"></i> Compila tutti i campi richiesti.';
      return;
    }
    const total = formatPrice(TASTING_PRICE_JPY * parseInt(guests));
    msgDiv.innerHTML = currentLang === 'en' ? `<i class="fas fa-check-circle"></i> Thank you ${name}! Omakase for ${guests} on ${date} at ${time} confirmed. Total: ${total}.` : `<i class="fas fa-check-circle"></i> Grazie ${name}! Omakase per ${guests} il ${date} alle ${time} confermato. Totale: ${total}.`;
    msgDiv.style.color = "#c4a27a";
    setTimeout(() => { form.reset(); }, 3000);
  });
}

function setMinDate() { const inp = document.getElementById('reserveDate'); if (inp) inp.min = new Date().toISOString().split('T')[0]; }
function smoothScroll() { document.querySelectorAll('.nav-links a, .btn-primary, .btn-outline').forEach(a => a.addEventListener('click', function (e) { const href = this.getAttribute('href'); if (href?.startsWith('#')) { e.preventDefault(); document.getElementById(href.substring(1))?.scrollIntoView({ behavior: 'smooth' }); if (window.innerWidth <= 767) document.getElementById('navLinks')?.classList.remove('open'); } })); }
function loadPreferences() { const savedLang = localStorage.getItem('sushiMasterLang'); if (savedLang === 'en' || savedLang === 'it') currentLang = savedLang; const savedCurr = localStorage.getItem('sushiMasterCurrency'); if (savedCurr === 'JPY' || savedCurr === 'EUR') currentCurrency = savedCurr; applyLanguage(); updateAllPrices(); }
function mobileMenu() { const btn = document.getElementById('mobileMenuToggle'); const nav = document.getElementById('navLinks'); if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open')); document.addEventListener('click', (e) => { if (window.innerWidth <= 767 && !nav.contains(e.target) && e.target !== btn && !btn.contains(e.target)) nav.classList.remove('open'); }); }

// Load menu data from external JSON file
async function loadMenuData() {
  try {
    const response = await fetch('data/data.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    menuItems = await response.json();
    renderMenu();
  } catch (error) {
    console.error('Error loading menu data:', error);
    const container = document.getElementById('menuGrid');
    if (container) {
      container.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Unable to load menu. Please ensure data/data.json exists. <br> <small>${error.message}</small></div>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  initFilters();
  setupBookingForm();
  setMinDate();
  smoothScroll();
  mobileMenu();
  await loadMenuData(); // Load data first
  loadPreferences();    // Apply language/currency after data is loaded

  document.getElementById('languageSwitcherTop')?.addEventListener('click', toggleLanguage);
  document.getElementById('currencySwitcherTop')?.addEventListener('click', toggleCurrency);
  document.getElementById('currencySwitcherNearProducts')?.addEventListener('click', toggleCurrency);
});