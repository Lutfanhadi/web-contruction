document.addEventListener("DOMContentLoaded", () => {
  // --- 1. LOGIKA RESET KE HOME SAAT REFRESH ---
  // Cek jika halaman baru saja dimuat/direfresh
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual'; // Mencegah browser scroll otomatis ke posisi terakhir
  }
  
  window.scrollTo(0, 0); // Paksa scroll ke paling atas
  
  // Hapus hash (#) dari URL agar bersih kembali ke root url
  if (window.location.hash) {
    history.replaceState(null, null, ' ');
  }

  // --- 2. INISIALISASI VARIABEL ---
  const containerSidbar = document.getElementById("containerSidbar");
  const sidebarContent = document.getElementById("sidebarContent");
  const toggleMenu = document.getElementById("toggleMenu");
  const toggleClose = document.getElementById("toggleClose");
  const sidebarLinks = containerSidbar.querySelectorAll("a"); // Link Sidebar
  const navLinks = document.querySelectorAll(".nav-link");    // Link Desktop
  const sections = document.querySelectorAll("section");

  // --- 3. FUNGSI SIDEBAR (BUKA/TUTUP) ---
  const openSidebar = () => {
    containerSidbar.classList.remove("pointer-events-none", "opacity-0");
    containerSidbar.classList.add("pointer-events-auto", "opacity-100");
    sidebarContent.classList.remove("-translate-x-full");
  };

  const closeSidebar = () => {
    sidebarContent.classList.add("-translate-x-full");
    setTimeout(() => {
      containerSidbar.classList.remove("pointer-events-auto", "opacity-100");
      containerSidbar.classList.add("pointer-events-none", "opacity-0");
    }, 300);
  };

  toggleMenu.addEventListener("click", openSidebar);
  toggleClose.addEventListener("click", closeSidebar);
  
  containerSidbar.addEventListener("click", (e) => {
    if (e.target === containerSidbar) {
      closeSidebar();
    }
  });

  // Saat link sidebar diklik, tutup sidebar (active state akan diurus oleh scroll logic)
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeSidebar();
      // Kita biarkan logika scroll menangani perubahan warna agar konsisten
    });
  });

  // --- 4. LOGIKA UTAMA (SCROLL SPY UNTUK DESKTOP & SIDEBAR) ---
  function updateActiveLinks() {
    let currentSectionId = "";

    // Tentukan section mana yang sedang dilihat user
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      // Angka 150 adalah offset toleransi agar aktif sebelum benar-benar sampai atas
      if (window.pageYOffset >= sectionTop - 150) {
        currentSectionId = section.getAttribute("id");
      }
    });

    // Jika di paling atas (< 100px), paksa aktifkan home
    if (window.scrollY < 100) {
      currentSectionId = "home";
    }

    // A. Update Link Desktop
    navLinks.forEach((link) => {
      link.classList.remove("text-secondary", "border-b-2", "pb-2");
      if (link.getAttribute("href").includes(currentSectionId)) {
        link.classList.add("text-secondary", "border-b-2", "pb-2");
      }
    });

    // B. Update Link Sidebar (Ini perbaikan yang diminta)
    sidebarLinks.forEach((link) => {
      // Reset style sidebar ke default (abu-abu/tidak bold)
      link.classList.remove("text-primary", "font-bold");
      link.classList.add("text-white");

      // Cek apakah href link ini cocok dengan section saat ini
      if (link.getAttribute("href").includes(currentSectionId)) {
        link.classList.remove("text-white"); // Hapus warna abu
        link.classList.add("text-primary", "font-bold"); // Tambah warna primary & bold
      }
    });
  }

  // --- 5. EVENT LISTENERS ---
  window.addEventListener("scroll", updateActiveLinks);
  window.addEventListener("load", updateActiveLinks); // Jalankan sekali saat load
});