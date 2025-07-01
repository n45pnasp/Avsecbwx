async function loadScheduleData() {
  const url = 'https://docs.google.com/spreadsheets/d/1Jvh0Ve6GiN9y0djBURZBPToAUmyK2RuYjE-4I-h7Hq0/gviz/tq?sheet=Sheet1';
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    // Ambil Supervisor BHS, Cabin, Landside
    const supervisorBHS = rows[11]?.c[4]?.v ?? '-';
    const supervisorCabin = rows[18]?.c[4]?.v ?? '-';
    const supervisorLandside = rows[27]?.c[4]?.v ?? '-';

    // Buat tampilan supervisor di atas tabel
    const container = document.getElementById('table-container');

    const supHeader = document.createElement('div');
    supHeader.innerHTML = `
      <h3>Supervisor BHS: <strong>${supervisorBHS}</strong></h3>
      <h3>Supervisor Cabin: <strong>${supervisorCabin}</strong></h3>
      <h3>Supervisor Landside: <strong>${supervisorLandside}</strong></h3>
      <br/>
    `;
    container.appendChild(supHeader);

    // Buat tabel schedule
    const table = document.createElement('table');
    table.className = 'schedule-table';

    // Header
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['No', 'Nama Personil', 'Posisi Tugas', 'Keterangan'].forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Body: ambil D8:G39 (rows 7–38)
    const tbody = document.createElement('tbody');
    for (let i = 7; i <= 38; i++) {
      const row = rows[i];
      if (!row) continue;

      const tr = document.createElement('tr');

      const d = row.c[3]?.v ?? '-'; // kolom D
      const e = row.c[4]?.v ?? '-'; // kolom E
      const f = row.c[5]?.v ?? '-'; // kolom F
      const g = row.c[6]?.v ?? '-'; // kolom G

      // section header deteksi
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
        // data biasa
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
    container.appendChild(table);

  } catch (err) {
    document.getElementById('table-container').innerHTML =
      '<div class="error-msg">Gagal memuat data dari Google Sheets.</div>';
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', loadScheduleData);
