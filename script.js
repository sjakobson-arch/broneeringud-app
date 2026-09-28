const BOOKING_URL = 'https://metshein.com/kordamine/json/broneeringud.json';
const tableBody = document.querySelector('#bookingTable tbody');
const statsEl = document.querySelector('#stats');
const serviceGrid = document.querySelector('#serviceGrid');
let selectedService = 'all';

const SERVICE_CLASS_MAP = {
  Juuksur: 'service-juuksur',
  Massaaž: 'service-massaz',
  Spa: 'service-spa',
  Kosmeetika: 'service-kosmeetika',
};

const SERVICE_ICON_SVGS = {
  'Kõik broneeringud': `
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="51" r="45" fill="#fff" opacity=".55" />
      <rect x="22" y="24" width="56" height="59" rx="10" fill="#fffdf8" stroke="#527565" stroke-width="3" />
      <path d="M22 35a11 11 0 0 1 11-11h34a11 11 0 0 1 11 11v7H22z" fill="#789984" />
      <path d="M36 19v12m28-12v12" stroke="#527565" stroke-width="5" stroke-linecap="round" />
      <path d="M34 52h9m-9 15h9" stroke="#d49b31" stroke-width="6" stroke-linecap="round" />
      <path d="M50 52h16m-16 15h16" stroke="#dfe9df" stroke-width="5" stroke-linecap="round" />
      <circle cx="72" cy="52" r="3.5" fill="#d98783" />
      <circle cx="72" cy="67" r="3.5" fill="#6997a0" />
    </svg>`,
  Juuksur: `
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="51" r="45" fill="#fff" opacity=".55" />
      <path d="M47 48 27 31m24 21L31 74m20-19 23 17M49 51l28-27" fill="none" stroke="#557565" stroke-width="4" stroke-linecap="round" />
      <circle cx="27" cy="26" r="9" fill="none" stroke="#d49b31" stroke-width="4" />
      <circle cx="27" cy="79" r="9" fill="none" stroke="#d49b31" stroke-width="4" />
      <circle cx="50" cy="51" r="5" fill="#d49b31" />
      <path d="M68 72c4-8 4-17 0-25m8 27c6-11 6-25 1-36" fill="none" stroke="#bd8c5c" stroke-width="3" stroke-linecap="round" />
    </svg>`,
  'Massaaž': `
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="51" r="45" fill="#fff" opacity=".55" />
      <path d="M28 44h30l5 9v27a8 8 0 0 1-8 8H31a8 8 0 0 1-8-8V53z" fill="#d8a278" stroke="#557565" stroke-width="3" stroke-linejoin="round" />
      <path d="M34 35h18v9H34z" fill="#789984" stroke="#557565" stroke-width="3" />
      <path d="M39 27h8v8h-8z" fill="#557565" />
      <path d="M32 58h22" stroke="#fff4e8" stroke-width="3" stroke-linecap="round" />
      <path d="M39 69c4-5 9-5 13 0" fill="none" stroke="#fff4e8" stroke-width="2.5" stroke-linecap="round" />
      <path d="M58 68c4-5 8-6 13-4l8 3c4 2 4 7 0 9l-14 7-8-2-8 3-4-9 9-5z" fill="#f1c6a5" stroke="#557565" stroke-width="3" stroke-linejoin="round" />
      <path d="m71 46 3 5 5 1-4 3 1 5-5-3-4 3 1-5-4-3 5-1z" fill="#79a7a8" />
    </svg>`,
  Spa: `
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="51" r="45" fill="#fff" opacity=".55" />
      <path d="M22 45c-7-7 7-11 0-19m10 17c-7-7 7-11 0-19m18 19c-7-7 7-11 0-19m18 19c-7-7 7-11 0-19m10 19c-7-7 7-11 0-19" fill="none" stroke="#789984" stroke-width="4" stroke-linecap="round" />
      <path d="M28 85c2-12 10-18 22-18s20 6 22 18" fill="#9cc9c4" stroke="#557565" stroke-width="3" />
      <circle cx="50" cy="54" r="22" fill="#f1c6a5" stroke="#557565" stroke-width="3" />
      <path d="M29 48c1-13 9-21 21-21s20 8 21 21c-8-2-15-7-21-14-5 7-12 12-21 14z" fill="#fff4e8" stroke="#557565" stroke-width="3" stroke-linejoin="round" />
      <path d="M39 55c3 4 6 4 9 0m5 0c3 4 6 4 9 0" fill="none" stroke="#557565" stroke-width="2.5" stroke-linecap="round" />
      <path d="M44 64c4 4 8 4 12 0" fill="none" stroke="#a85e5c" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="36" cy="62" r="3" fill="#d98783" opacity=".8" />
      <circle cx="64" cy="62" r="3" fill="#d98783" opacity=".8" />
      <path d="M19 82c7-5 13 5 20 0s13 5 20 0 13 5 20 0" fill="none" stroke="#557565" stroke-width="3.5" stroke-linecap="round" />
    </svg>`,
  Kosmeetika: `
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="51" r="45" fill="#fff" opacity=".55" />
      <path d="m65 61 14-35" fill="none" stroke="#557565" stroke-width="7" stroke-linecap="round" />
      <path d="m75 29 10 4m-12 3 9 4m-12 1 9 4" fill="none" stroke="#557565" stroke-width="3" stroke-linecap="round" />
      <rect x="23" y="47" width="39" height="39" rx="9" fill="#d68d83" />
      <path d="M27 49h31v9H27z" fill="#bd716c" />
      <rect x="28" y="26" width="29" height="21" rx="5" fill="#789984" />
      <path d="M34 69h17" fill="none" stroke="#fff2dc" stroke-width="3" stroke-linecap="round" />
      <path d="m68 17 2 5 5 1-4 3 1 5-4-3-5 3 1-5-4-3 5-1z" fill="#d49b31" />
    </svg>`,
};

const bookingDataStore = [];

function cleanText(value = '') {
  return String(value ?? '').trim();
}

function formatDate(dateString = '') {
  const cleanDate = cleanText(dateString);
  if (!cleanDate) return '—';

  const date = new Date(`${cleanDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return cleanDate;
  }

  return new Intl.DateTimeFormat('et-EE', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(date);
}

function getBookingTimestamp(booking) {
  const date = cleanText(booking['kuupäev']);
  const isoDate = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const localDate = date.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  let year;
  let month;
  let day;

  if (isoDate) {
    [, year, month, day] = isoDate;
  } else if (localDate) {
    [, day, month, year] = localDate;
  } else {
    return Number.POSITIVE_INFINITY;
  }

  const time = cleanText(booking.aeg).match(/^(\d{1,2}):(\d{2})/);
  const hours = time ? Number(time[1]) : 0;
  const minutes = time ? Number(time[2]) : 0;
  return new Date(Number(year), Number(month) - 1, Number(day), hours, minutes).getTime();
}

function buildServiceCards(bookings) {
  const uniqueServices = [...new Set(bookings.map((booking) => cleanText(booking.teenus)).filter(Boolean))];
  uniqueServices.sort((a, b) => a.localeCompare(b, 'et'));

  const cards = [
    { service: 'all', label: 'Kõik broneeringud', count: bookings.length },
    ...uniqueServices.map((service) => ({
      service,
      label: service,
      count: bookings.filter((booking) => cleanText(booking.teenus) === service).length,
    })),
  ];

  serviceGrid.replaceChildren();
  cards.forEach(({ service, label, count }, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `service-card ${SERVICE_CLASS_MAP[label] || ''}`.trim();
    card.dataset.service = service;
    card.setAttribute('aria-pressed', String(service === selectedService));

    const title = document.createElement('span');
    title.className = 'service-card-title';
    title.textContent = label;

    const art = document.createElement('span');
    art.className = 'service-card-art';
    const mainArtIcon = document.createElement('span');
    mainArtIcon.className = 'service-art-main';
    mainArtIcon.classList.add('service-art-vector');
    mainArtIcon.style.animationDelay = `${index * 75}ms`;
    mainArtIcon.setAttribute('role', 'img');
    mainArtIcon.setAttribute('aria-label', `${label} kategooria illustratsioon`);
    mainArtIcon.innerHTML = SERVICE_ICON_SVGS[label] || SERVICE_ICON_SVGS['Kõik broneeringud'];

    art.append(mainArtIcon);

    const amount = document.createElement('strong');
    amount.className = 'service-card-count';
    amount.textContent = String(count);

    const caption = document.createElement('span');
    caption.className = 'service-card-caption';
    caption.textContent = count === 1 ? 'broneering' : 'broneeringut';

    card.append(title, art, amount, caption);
    serviceGrid.appendChild(card);
  });
}

function renderRows(bookings) {
  const filteredRows = selectedService === 'all'
    ? bookings
    : bookings.filter((booking) => cleanText(booking.teenus) === selectedService);
  const visibleRows = [...filteredRows].sort((a, b) => getBookingTimestamp(a) - getBookingTimestamp(b));

  if (!visibleRows.length) {
    tableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">Selle teenuse jaoks ei ole broneeringuid.</td>
      </tr>
    `;
    statsEl.textContent = 'Näitan 0 broneeringut.';
    return;
  }

  tableBody.innerHTML = visibleRows
    .map((booking) => {
      const client = cleanText(booking.klient);
      const service = cleanText(booking.teenus);
      const date = formatDate(cleanText(booking['kuupäev']));
      const time = cleanText(booking.aeg);
      const rowClass = SERVICE_CLASS_MAP[service] || 'service-default';

      return `
        <tr class="${rowClass}">
          <td>${client}</td>
          <td>${service}</td>
          <td>${date}</td>
          <td>${time}</td>
        </tr>
      `;
    })
    .join('');

  statsEl.textContent = `Näitan ${visibleRows.length} broneeringut.`;
}

function loadBookings() {
  fetch(BOOKING_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Viga: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Broneeringud andmed:', data);
      const bookings = Array.isArray(data) ? data : data.broneeringud || [];
      bookingDataStore.length = 0;
      bookings.forEach((booking) => bookingDataStore.push(booking));
      buildServiceCards(bookings);
      renderRows(bookings);
    })
    .catch((error) => {
      console.error('Andmete laadimine ebaõnnestus:', error);
      tableBody.innerHTML = `
        <tr class="empty-row">
          <td colspan="4">Andmete laadimine ebaõnnestus. Kontrolli ühendust.</td>
        </tr>
      `;
      statsEl.textContent = 'Andmetega ei õnnestunud ühendust luua.';
    });
}

serviceGrid.addEventListener('click', (event) => {
  const card = event.target.closest('.service-card');
  if (!card) return;

  selectedService = card.dataset.service;
  serviceGrid.querySelectorAll('.service-card').forEach((serviceCard) => {
    serviceCard.setAttribute('aria-pressed', String(serviceCard === card));
  });
  renderRows(bookingDataStore);
});

const careDialog = document.querySelector('#careDialog');
const closeCareDialog = () => careDialog.close();
careDialog.querySelector('.care-dialog-close').addEventListener('click', closeCareDialog);
careDialog.querySelector('.care-dialog-action').addEventListener('click', closeCareDialog);

window.setTimeout(() => {
  if (!sessionStorage.getItem('care-dialog-shown')) {
    sessionStorage.setItem('care-dialog-shown', 'true');
    careDialog.showModal();
  }
}, 5000);

let lastSparkleTime = 0;
document.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse') return;

  const now = performance.now();
  if (now - lastSparkleTime < 45) return;
  lastSparkleTime = now;

  const sparkle = document.createElement('span');
  sparkle.className = 'cursor-sparkle';
  sparkle.textContent = Math.random() > 0.5 ? '✦' : '✧';
  sparkle.style.left = `${event.clientX}px`;
  sparkle.style.top = `${event.clientY}px`;
  sparkle.style.setProperty('--sparkle-drift', `${Math.round(Math.random() * 32 - 16)}px`);
  document.body.appendChild(sparkle);
  sparkle.addEventListener('animationend', () => sparkle.remove(), { once: true });
});

loadBookings();
