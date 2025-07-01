// sched.js
async function loadScheduleData() {
  const url = 'https://docs.google.com/spreadsheets/d/1Jvh0Ve6GiN9y0djBURZBPToAUmyK2RuYjE-4I-h7Hq0/gviz/tq?sheet=Sheet1';
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    // Ambil Supervisor
    const supervisorBHS = rows[11]?.c[4]?.v ?? '-';
    const supervisorCabin = rows[18]?.c[4]?.v ?? '-';
    const supervisorLandside = rows[27]?.c[4]?.v ?? '-';

    // Persiapan array personil
    const bhsPersonnel = [];
    const cabinPersonnel = [];
    const landsidePersonnel = [];
    const nightPersonnel = [];

    // Data personil SCP BHS (baris 13-15)
    for (let i = 12; i <= 14; i++) {
      if (!rows[i]) continue;
      bhsPersonnel.push({
        no: rows[i].c[3]?.v ?? '-',
        nama: rows[i].c[4]?.v ?? '-',
        posisi: rows[i].c[5]?.v ?? '-',
        ket: rows[i].c[6]?.v ?? '-'
      });
    }

    // Data personil SCP Cabin (baris 19-23)
    for (let i = 18; i <= 22; i++) {
      if (!rows[i]) continue;
      cabinPersonnel.push({
        no: rows[i].c[3]?.v ?? '-',
        nama: rows[i].c[4]?.v ?? '-',
        posisi: rows[i].c[5]?.v ?? '-',
        ket: rows[i].c[6]?.v ?? '-'
      });
    }

    // Data personil Pos 1, Cargo & Patroli (baris 28-30)
    for (let i = 27; i <= 29; i++) {
      if (!rows[i]) continue;
      landsidePersonnel.push({
        no: rows[i].c[3]?.v ?? '-',
        nama: rows[i].c[4]?.v ?? '-',
        posisi: rows[i].c[5]?.v ?? '-',
        ket: rows[i].c[6]?.v ?? '-'
      });
    }

    // Data Dinas Malam (baris 33-36)
    for (let i = 32; i <= 35; i++) {
      if (!rows[i]) continue;
      nightPersonnel.push({
        no: rows[i].c[3]?.v ?? '-',
        nama: rows[i].c[4]?.v ?? '-',
        posisi: rows[i].c[5]?.v ?? '-',
        ket: rows[i].c[6]?.v ?? '-'
      });
    }

    // Render ke DOM
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

// Fungsi untuk generate tabel HTML dari array data
function generateTable(data) {
  if (!data.length) return '<p>- Tidak ada data -</p>';

  let html = `
    <table class="schedule-table">
      <thead>
        <tr>
          <th>No</th>
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
        <td>${item.no}</td>
        <td>${item.nama}</td>
        <td>${item.posisi}</td>
        <td>${item.ket}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  return html;
}

// Load saat halaman dibuka
window.addEventListener('DOMContentLoaded', loadScheduleData);
