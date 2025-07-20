const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzzA8xFUkQKccXmMbpc8KMfUyyloD8zUbo4WIIjkO8-MLMTs-I1wPIqYEupfUkm9oXH/exec";

// Tampilkan form berdasarkan kategori (Cabin, HBS, Cargo)
function showForm(kategori) {
  document.getElementById("randomForm").style.display = "flex";
  document.getElementById("kategori").value = kategori;
}

// Submit form dan kirim ke Google Sheets
async function submitForm(event) {
  event.preventDefault();

  const data = {
    kategori: document.getElementById("kategori").value,
    nama: document.getElementById("nama").value.trim(),
    flight: document.getElementById("flight").value,
    objek: document.getElementById("objek").value,
    metode: document.getElementById("metode").value,
    timestamp: new Date().toLocaleString("id-ID")
  };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      alert("Data berhasil disimpan!");
      document.getElementById("randomForm").reset();
      document.getElementById("randomForm").style.display = "none";
    } else {
      throw new Error(result.message || "Terjadi kesalahan");
    }
  } catch (error) {
    console.error("Gagal:", error);
    alert("Gagal menyimpan data. Silakan coba lagi.");
  }
}
