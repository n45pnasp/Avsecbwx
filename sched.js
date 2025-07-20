// sched.js
document.addEventListener("DOMContentLoaded", () => {
  const tableContainer = document.getElementById("table-container");
  const iframe = document.createElement("iframe");
  iframe.src = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQabc1234/pubhtml?gid=0&single=true&widget=true&headers=false";
  iframe.width = "100%";
  iframe.height = "600";
  iframe.style.border = "none";
  tableContainer.appendChild(iframe);
});
