async function loadScheduleData() {
  const url = 'https://docs.google.com/spreadsheets/d/1Jvh0Ve6GiN9y0djBURZBPToAUmyK2RuYjE-4I-h7Hq0/gviz/tq?sheet=Sheet1';
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const table = document.createElement('table');
    table.className = 'schedule-table';

    // Header manual (karena kita ambil kolom D-G)
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['No', 'Nama Personil', 'Posisi Tugas', 'Keterangan'].forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');

    // Ambil hanya baris 8-39 (array index mulai dari 0)
    for (let i = 7; i <= 38; i++) {
      const row = rows[i];
      if (!row) continue;

      const tr = document.createElement('tr');

      const d = row.c[3]?.v ?? '-'; // kolom D
      const e = row.c[4]?.v ?? '-'; // kolom E
      const f = row.c[5]?.v ?? '-'; // kolom F
      const g = row.c[6]?.v ?? '-'; // kolom G

      // deteksi section header (SUPERVISION, POSISI TUGAS, PERSONIL TUGAS)
      if (!d && e && (
        e.toUpperCase().includes('SUPERVISION') ||
        e.toUpperCase().includes('POSISI TUGAS') ||
        e.toUpperCase().includes('PERSONIL TUGAS')
      )) {
        const td = document.createElement('td');
        td.colSpan = 4;
        td.textContent = e;
        td.className = 'section-header';
        tr.appendChild(td);
      } else {
        // isi data baris normal
        const cells = [d, e, f, g];
        cells.forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
        });
      }

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    document.getElementById('table-container').appendChild(table);

  } catch (err) {
    document.getElementById('table-container').innerHTML =
      '<div class="error-msg">Gagal memuat data dari Google Sheets.</div>';
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', loadScheduleData);
