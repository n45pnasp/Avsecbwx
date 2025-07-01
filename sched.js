async function loadScheduleData() {
  const url = 'https://docs.google.com/spreadsheets/d/1Jvh0Ve6GiN9y0djBURZBPToAUmyK2RuYjE-4I-h7Hq0/gviz/tq?sheet=Sheet1';
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;
    const columns = json.table.cols.map(col => col.label);

    const table = document.createElement('table');
    table.className = 'schedule-table';

    // Header
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col || '-';
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');
    rows.forEach(row => {
      const tr = document.createElement('tr');

      // Deteksi jika row adalah section header (SUPERVISION, POSISI TUGAS, PERSONIL TUGAS)
      const firstCell = row.c[0]?.v;
      const secondCell = row.c[1]?.v;

      if (!firstCell && secondCell && (
          secondCell.toUpperCase().includes('SUPERVISION') ||
          secondCell.toUpperCase().includes('POSISI TUGAS') ||
          secondCell.toUpperCase().includes('PERSONIL TUGAS')
        )) {
        const td = document.createElement('td');
        td.colSpan = columns.length;
        td.textContent = secondCell;
        td.className = 'section-header';
        tr.appendChild(td);
      } else {
        row.c.forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell?.v ?? '-';
          tr.appendChild(td);
        });
      }

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    document.getElementById('table-container').appendChild(table);

  } catch (err) {
    document.getElementById('table-container').innerHTML =
      '<div class="error-msg">Gagal memuat data dari Google Sheets.</div>';
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', loadScheduleData);
