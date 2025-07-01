async function loadScheduleData() {
  const url = 'https://docs.google.com/spreadsheets/d/1Jvh0Ve6GiN9y0djBURZBPToAUmyK2RuYjE-4I-h7Hq0/gviz/tq?sheet=Sheet1';
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    // Ambil Supervisor
    const supervisorBHS = rows[1]?.c[5]?.v ?? '-';
    const supervisorCabin = rows[8]?.c[5]?.v ?? '-';
    const supervisorLandside = rows[17]?.c[5]?.v ?? '-';

    // Personil BHS (row 14-16)
    const bhsPersonnel = [];
    for (let i = 3; i <= 6; i++) {
      if (!rows[i]) continue;
      bhsPersonnel.push(extractRow(rows[i]));
    }

    // Personil Cabin (row 21-24)
    const cabinPersonnel = [];
    for (let i = 10; i <= 13; i++) {
      if (!rows[i]) continue;
      cabinPersonnel.push(extractRow(rows[i]));
    }

    // Personil Pos 1, Patroli, Cargo (30-32)
    const landsidePersonnel = [];
    for (let i = 29; i <= 31; i++) {
      if (!rows[i]) continue;
      landsidePersonnel.push(extractRow(rows[i]));
    }

    // Dinas Malam (35-38)
    const nightPersonnel = [];
    for (let i = 34; i <= 37; i++) {
      if (!rows[i]) continue;
      nightPersonnel.push(extractRow(rows[i]));
    }

    // Render ke halaman
    const container = document.getElementById('table-container');
    container.innerHTML = `
      <div class="supervisor">
        <p><strong>Supervisor BHS:</strong> ${supervisorBHS}</p>
        <p><strong>Supervisor Cabin:</strong> ${supervisorCabin}</p>
        <p><strong>Supervisor Landside:</strong> ${supervisorLandside}</p>
      </div>

      <h3>Posisi Tugas SCP BHS Domestik</h3>
      ${generateTable(bhsPersonnel)}

      <h3>Posisi Tugas SCP Cabin Domestik</h3>
      ${generateTable(cabinPersonnel)}

      <h3>Posisi Tugas Pos 1, Patroli & Cargo</h3>
      ${generateTable(landsidePersonnel)}

      <h3>Personil Dinas Malam</h3>
      ${generateTable(nightPersonnel)}
    `;

  } catch (err) {
    console.error('Gagal load data:', err);
    document.getElementById('table-container').innerHTML =
      '<div class="error-msg">Gagal memuat data dari Google Sheets.</div>';
  }
}

// Ekstrak data per baris
function extractRow(row) {
  return {
    nama: row.c[4]?.v ?? '-',
    posisi: row.c[5]?.v ?? '-',
    ket: row.c[6]?.v ?? '-'
  };
}

// Generate tabel HTML
function generateTable(data) {
  if (!data.length) return '<p>- Tidak ada data -</p>';
  let html = `
    <table class="schedule-table">
      <thead>
        <tr>
          <th>Nama Personil</th>
          <th>Posisi Tugas</th>
          <th>Keterangan</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(item => {
    html += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.posisi}</td>
        <td>${item.ket}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  return html;
}

window.addEventListener('DOMContentLoaded', loadScheduleData);
