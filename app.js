// === Sidebar Toggle untuk Mobile ===
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");

  // Tambahan animasi delay jika dibutuhkan
  if (sidebar.classList.contains("active")) {
    sidebar.style.transition = "left 0.3s ease-out";
  } else {
    sidebar.style.transition = "left 0.2s ease-in";
  }
}

// === Tambahkan class 'active' pada menu sesuai URL ===
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop();
  const menuLinks = document.querySelectorAll(".menu a");

  menuLinks.forEach(link => {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPath || (linkHref === "index.html" && currentPath === "")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
