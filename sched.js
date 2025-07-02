async function loadScheduleData() {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQRMLp8YZ6z0bDSErm7ExaAg9z7LturHHz4ZE4ULMXZlxi2yeyNuiEOC0PylKtPoSIiR6qb5VJ6jeel/pub?gid=924083131&single=true&output=csv';

  try {
    const res = await fetch(url);
    const csvText = await res.text();

    const rows = csvText.trim().split('\n').map(row => row.split(','));

    // Buat table HTML
    const table = document.createElement('table');
    table.className = 'schedule-table';

    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    rows[0].forEach(cellText => {
      const th = document.createElement('th');
      th.textContent = cellText.trim();
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const tr = document.createElement('tr');
      row.forEach(cellText => {
        const td = document.createElement('td');
        td.textContent = cellText.trim();
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    // Masukkan ke halaman
    const container = document.getElementById('table-container');
    container.innerHTML = ''; // Bersihkan dulu
    container.appendChild(table);

  } catch (error) {
    console.error('Gagal memuat CSV:', error);
    document.getElementById('table-container').innerHTML =
      '<div class="error-msg">Gagal memuat data jadwal.</div>';
  }
}

window.addEventListener('DOMContentLoaded', loadScheduleData);
