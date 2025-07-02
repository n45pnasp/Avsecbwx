const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQRMLp8YZ6z0bDSErm7ExaAg9z7LturHHz4ZE4ULMXZlxi2yeyNuiEOC0PylKtPoSIiR6qb5VJ6jeel/pub?gid=924083131&single=true&output=csv';

async function loadScheduleData() {
  try {
    const response = await fetch(CSV_URL);
    const text = await response.text();

    const rows = text.trim().split('\n');
    const slicedRows = rows.slice(6, 43); // Ambil baris 7–43 (0-based)

    const data = slicedRows.map(row => row.split(','));
    renderTable(data);
  } catch (error) {
    document.getElementById('table-container').innerHTML = `<p style="color:red;">Gagal memuat data: ${error.message}</p>`;
  }
}

function renderTable(data) {
  const table = document.createElement('table');
  table.classList.add('styled-table');

  // Header diambil dari baris pertama (anggap baris ke-7 adalah judul, bukan header)
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headerData = data.find(row => row.length > 2); // cari baris dengan isi tabel biasa
  headerData.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header.trim();
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  const colCount = headerData.length;

  for (let i = 0; i < data.length; i++) {
    const row = document.createElement('tr');

    // Baris ke-7 (index 0-based = 6) dan ke-11 (index 10)
    if (i === 0 || i === 4) {
      const td = document.createElement('td');
      td.colSpan = colCount;
      td.textContent = data[i][0].trim(); // ambil isi kolom pertama
      td.style.fontWeight = 'bold';
      td.style.backgroundColor = '#e3f2fd';
      td.style.textAlign = 'center';
      td.style.color = '#1e3a8a';
      row.appendChild(td);
    } else {
      // Baris normal
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
