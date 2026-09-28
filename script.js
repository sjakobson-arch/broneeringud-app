const BOOKING_URL = 'https://metshein.com/kordamine/json/broneeringud.json';
const tableBody = document.querySelector('#bookingTable tbody');
const filterSelect = document.querySelector('#serviceFilter');
const statsEl = document.querySelector('#stats');

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

function buildServiceOptions(bookings) {
  const uniqueServices = [...new Set(bookings.map((booking) => cleanText(booking.teenus)))];
  uniqueServices.sort((a, b) => a.localeCompare(b, 'et'));

  filterSelect.innerHTML = '<option value="all">Kõik teenused</option>';

  uniqueServices.forEach((service) => {
    const option = document.createElement('option');
    option.value = service;
    option.textContent = service;
    filterSelect.appendChild(option);
  });
}

function renderRows(bookings) {
  const selectedService = filterSelect.value || 'all';
  const visibleRows = selectedService === 'all'
    ? bookings
    : bookings.filter((booking) => cleanText(booking.teenus) === selectedService);

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

  statsEl.textContent = `Näitan ${visibleRows.length} broneeringut${visibleRows.length === 1 ? '' : 'ut'}.`;
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
      buildServiceOptions(bookings);
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

filterSelect.addEventListener('change', () => {
  renderRows(bookingDataStore);
});

loadBookings();
