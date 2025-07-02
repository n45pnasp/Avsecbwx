const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQRMLp8YZ6z0bDSErm7ExaAg9z7LturHHz4ZE4ULMXZlxi2yeyNuiEOC0PylKtPoSIiR6qb5VJ6jeel/pub?gid=924083131&single=true&output=csv';

async function loadScheduleData() {
  try {
    const response = await fetch(CSV_URL);
    const text = await response.text();

    const rows = text.trim().split('\n');
    const slicedRows = rows.slice(6, 43); // baris 7–43 (0-based index)

    const data = slicedRows.map(row => row.split(','));
    renderTable(data);
  } catch (error) {
    document.getElementById('table-container').innerHTML = `<p style="color:red;">Gagal memuat data: ${error.message}</p>`;
  }
}

function renderTable(data) {
  const table = document.createElement('table');
  table.classList.add('styled-table');

  // Header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  data[0].forEach(header => {
    const th = document.createElement('th');
    th.textContent = header.trim();
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  const colCount = data[0].length;

  for (let i = 1; i < data.length; i++) {
    const row = document.createElement('tr');

    // Baris ke-7 (indeks ke-6) dan ke-11 (indeks ke-10) -> gabung sel
    if (i === 6 || i === 10) {
      const td = document.createElement('td');
      td.colSpan = colCount;
      td.textContent = data[i][0].trim(); // ambil isi kolom pertama (biasanya judul)
      td.style.fontWeight = 'bold';
      td.style.background = '#e3f2fd';
      row.appendChild(td);
    } else {
      data[i].forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell.trim();
        row.appendChild(td);
      });
    }

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  document.getElementById('table-container').appendChild(table);
}

loadScheduleData();
