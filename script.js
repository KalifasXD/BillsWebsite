document.addEventListener("DOMContentLoaded", () => {
  // Navbar Sticky Effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navbar.classList.add("sticky");
    } else {
      navbar.classList.remove("sticky");
    }
  });
  
  // Hamburger Menu Toggle for Mobile
  const menuIcon = document.querySelector(".menu-icon");
  const menu = document.querySelector(".navbar ul");
  const navLinks = document.querySelectorAll('.navbar .nav-link');

  menuIcon.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  // Close the menu when any nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });

  document.getElementById('darkModeToggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode', this.checked);
  });
  
  // Smooth Scroll for Navbar Links and Quick Links (both handled in one loop)
  document.querySelectorAll(".nav-link, .quick-links").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  // Navbar Active Link Highlight on Scroll
  window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY + 100; // Add a bit of offset for better matching
    document.querySelectorAll("section").forEach(section => {
      // Check if section is in the viewport
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        document.querySelector(".navbar .nav-link.active")?.classList.remove("active");
        const activeLink = document.querySelector(`.navbar a[href="#${section.id}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  });
});
