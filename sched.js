async function loadScheduleData() {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQRMLp8YZ6z0bDSErm7ExaAg9z7LturHHz4ZE4ULMXZlxi2yeyNuiEOC0PylKtPoSIiR6qb5VJ6jeel/pub?gid=924083131&single=true&output=csv';

  try {
    const res = await fetch(url);
    const csvText = await res.text();
    const rows = csvText.trim().split('\n').map(row => row.split(','));

    const header = rows[0];
    const data = rows.slice(1);

    // Ambil tanggal dari baris pertama
    const tanggal = data[0][0] || '-';

    // Kategorikan data
    const supervisors = {
      bhs: [],
      cabin: [],
      pos: []
    };

    const tables = {
      bhs: [],
      cabin: [],
      pos: [],
      malam: []
    };

    data.forEach(row => {
      const kategori = row[1]?.trim().toLowerCase();
      const nama = row[2] ?? '-';
      const posisi = row[3] ?? '-';
      const ket = row[4] ?? '-';

      if (kategori.includes('supervisor bhs')) supervisors.bhs.push(nama);
      else if (kategori.includes('supervisor cabin')) supervisors.cabin.push(nama);
      else if (kategori.includes('supervisor pos')) supervisors.pos.push(nama);

      else if (kategori.includes('personil bhs')) tables.bhs.push({ nama, posisi, ket });
      else if (kategori.includes('personil cabin')) tables.cabin.push({ nama, posisi, ket });
      else if (kategori.includes('personil pos')) tables.pos.push({ nama, posisi, ket });
      else if (kategori.includes('malam')) tables.malam.push({ nama, posisi, ket });
    });

    // Buat HTML
    const container = document.getElementById('table-container');
    container.innerHTML = `
      <div class="tanggal"><strong>Tanggal:</strong> ${tanggal}</div>

      <div class="supervisors">
        <h3>Supervisor BHS</h3>
        <ul>${supervisors.bhs.map(n => `<li>${n}</li>`).join('')}</ul>

        <h3>Supervisor Cabin</h3>
        <ul>${supervisors.cabin.map(n => `<li>${n}</li>`).join('')}</ul>

        <h3>Supervisor Pos 1 & Cargo</h3>
        <ul>${supervisors.pos.map(n => `<li>${n}</li>`).join('')}</ul>
      </div>

      <h3>Personil BHS</h3>
      ${generateTable(tables.bhs)}

      <h3>Personil Cabin</h3>
      ${generateTable(tables.cabin)}

      <h3>Personil Pos 1, Patroli & Cargo</h3>
      ${generateTable(tables.pos)}

      <h3>Personil Dinas Malam</h3>
      ${generateTable(tables.malam)}
    `;
  } catch (error) {
    console.error('Gagal load data CSV:', error);
    document.getElementById('table-container').innerHTML = '<p class="error-msg">Gagal memuat data jadwal.</p>';
  }
}

// Buat tabel HTML dari array data personil
function generateTable(data) {
  if (!data.length) return '<p>- Tidak ada data -</p>';
  let html = `
    <table class="schedule-table">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Posisi</th>
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
