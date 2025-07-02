<script>
async function loadScheduleData() {
  const url = 'https://docs.google.com/spreadsheets/d/1Jvh0Ve6GiN9y0djBURZBPToAUmyK2RuYjE-4I-h7Hq0/gviz/tq?sheet=Sheet1';
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    // Ambil Supervisor
    const supervisorBHS = getCellValue(rows[1], 4);
    const supervisorCabin = getCellValue(rows[8], 4);
    const supervisorLandside = getCellValue(rows[15], 4);

    // Personil BHS (baris 4-6)
    const bhsPersonnel = extractRange(rows, 3, 6);

    // Personil Cabin (baris 11-14)
    const cabinPersonnel = extractRange(rows, 10, 13);

    // Personil Pos 1, Patroli, Cargo (baris 30-32)
    const landsidePersonnel = extractRange(rows, 29, 31);

    // Personil Dinas Malam (baris 35-38)
    const nightPersonnel = extractRange(rows, 34, 37);

    // Render ke halaman
    const container = document.getElementById('table-container');
    container.innerHTML = `
      <div class="supervisor">
        <table class="schedule-table">
          <tr><td><strong>Supervisor BHS</strong></td><td>${supervisorBHS}</td></tr>
          <tr><td><strong>Supervisor Cabin</strong></td><td>${supervisorCabin}</td></tr>
          <tr><td><strong>Supervisor Landside</strong></td><td>${supervisorLandside}</td></tr>
        </table>
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

// Fungsi untuk ambil nilai sel aman
function getCellValue(row, colIndex) {
  return row?.c?.[colIndex]?.v ?? '-';
}

// Ambil data dari rentang baris
function extractRange(rows, start, end) {
  const result = [];
  for (let i = start; i <= end; i++) {
    const row = rows[i];
    if (!row) continue;
    result.push({
      nama: getCellValue(row, 4),
      posisi: getCellValue(row, 5),
      ket: getCellValue(row, 6)
    });
  }
  return result;
}

// Generate tabel dari data
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
  html += '</tbody></table>';
  return html;
}

window.addEventListener('DOMContentLoaded', loadScheduleData);
</script>
