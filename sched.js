const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQRMLp8YZ6z0bDSErm7ExaAg9z7LturHHz4ZE4ULMXZlxi2yeyNuiEOC0PylKtPoSIiR6qb5VJ6jeel/pub?gid=924083131&single=true&output=csv';

async function loadScheduleData() {
  try {
    const response = await fetch(CSV_URL);
    const text = await response.text();

    const rows = text.trim().split('\n');
    const slicedRows = rows.slice(6, 43); // baris 7–43 (indeks dimulai dari 0)

    const data = slicedRows.map(row => row.split(','));

    renderTable(data);
  } catch (error) {
    document.getElementById('table-container').innerHTML = `<p style="color:red;">Gagal memuat data: ${error.message}</p>`;
  }
}

function renderTable(data) {
  const table = document.createElement('table');
  table.classList.add('styled-table');

  // Tabel header (jika baris 7 adalah header)
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  data[0].forEach(header => {
    const th = document.createElement('th');
    th.textContent = header.trim();
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Isi tabel
  const tbody = document.createElement('tbody');
  for (let i = 1; i < data.length; i++) {
    const row = document.createElement('tr');
    data[i].forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell.trim();
      row.appendChild(td);
    });
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  document.getElementById('table-container').appendChild(table);
}

loadScheduleData();
