async function loadScheduleData() {
  const url = 'https://docs.google.com/spreadsheets/d/1Jvh0Ve6GiN9y0djBURZBPToAUmyK2RuYjE-4I-h7Hq0/gviz/tq?sheet=Sheet1';
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    if (!rows || !rows.length) {
      throw new Error("Data kosong atau tidak terbaca.");
    }

    const supervisorBHS = getCellValue(rows, 5, 4);
    const supervisorCabin = getCellValue(rows, 12, 4); //rows, 8, 4
    const supervisorLandside = getCellValue(rows, 21, 4); //rows, 15, 4

    const bhsPersonnel = extractRange(rows, 5, 7);
    const cabinPersonnel = extractRange(rows, 10, 13);
    const landsidePersonnel = extractRange(rows, 29, 31);
    const nightPersonnel = extractRange(rows, 34, 37);

    const container = document.getElementById('table-container');
    container.innerHTML = `
      <div class="supervisor">
        <table class="schedule-table">
          <tr><td><strong>Supervisor BHS :</strong></td><td>${supervisorBHS}</td></tr>
          <tr><td><strong>Supervisor Cabin :</strong></td><td>${supervisorCabin}</td></tr>
          <tr><td><strong>Supervisor Landside :</strong></td><td>${supervisorLandside}</td></tr>
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

function getCellValue(rows, rowIndex, colIndex) {
  return rows[rowIndex]?.c?.[colIndex]?.v ?? '-';
}

function extractRange(rows, start, end) {
  const result = [];
  for (let i = start; i <= end; i++) {
    const row = rows[i];
    if (!row) continue;
    result.push({
      nama: row.c?.[4]?.v ?? '-',
      posisi: row.c?.[5]?.v ?? '-',
      ket: row.c?.[6]?.v ?? '-'
    });
  }
  return result;
}

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
  for (const item of data) {
    html += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.posisi}</td>
        <td>${item.ket}</td>
      </tr>
    `;
  }
  html += '</tbody></table>';
  return html;
}

window.addEventListener('DOMContentLoaded', loadScheduleData);
