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
  cards.forEach(({ service, label, count }) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `service-card ${SERVICE_CLASS_MAP[label] || ''}`.trim();
    card.dataset.service = service;
    card.setAttribute('aria-pressed', String(service === selectedService));

    const title = document.createElement('span');
    title.className = 'service-card-title';
    title.textContent = label;

    const amount = document.createElement('strong');
    amount.className = 'service-card-count';
    amount.textContent = String(count);

    const caption = document.createElement('span');
    caption.className = 'service-card-caption';
    caption.textContent = count === 1 ? 'broneering' : 'broneeringut';

    card.append(title, amount, caption);
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

loadBookings();
