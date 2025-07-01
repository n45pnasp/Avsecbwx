// === Toggle Sidebar (mobile) ===
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");

  if (!sidebar) return;

  sidebar.classList.toggle("active");

  // Tambahan animasi halus
  sidebar.style.transition = sidebar.classList.contains("active")
    ? "left 0.3s ease-out"
    : "left 0.2s ease-in";
}

// === Set 'active' class di menu sidebar sesuai halaman ===
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  const menuLinks = document.querySelectorAll(".menu a");

  menuLinks.forEach(link => {
    const href = link.getAttribute("href");

    if (
      href === currentPage || 
      (currentPage === "" && href.includes("index.html")) ||
      (currentPage === "dashboard.html" && href.includes("dashboard.html"))
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
