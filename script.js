document.addEventListener("DOMContentLoaded", () => {
  const controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".slide");
  const navButtons = document.querySelectorAll(".nav-btn");
  const menuIcon = document.querySelector(".menu-icon");
  const menu = document.querySelector(".navbar ul");
  const navLinks = document.querySelectorAll(".navbar .nav-link");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const hamburger = document.querySelector(".hamburger-menu");
  const navigation = document.querySelector(".navigation");
  const skills = document.querySelectorAll(".skill");

  let currentSlideIndex = 0;
  let experiencePin;

  // Helper function to update active slide
  const changeSlide = (index) => {
      if (index >= 0 && index < slides.length) {
          slides.forEach((slide, i) => {
              slide.classList.toggle("active", i === index);
          });
          navButtons.forEach((button, i) => {
              button.classList.toggle("active", i === index);
          });
          currentSlideIndex = index;
      }
  };


  skills.forEach(skill => {
    const totalScore = parseInt(skill.getAttribute('score'));
    const currentScore = parseInt(skill.getAttribute('current-score'));
    for(let i = 0; i < totalScore; i++){
      const circle = document.createElement('div');
      if(i < currentScore)
        circle.classList.add("filled");
      skill.getElementsByClassName('skill-images-container')[0].appendChild(circle);
    }
  });

  // Initialize ScrollMagic Scene
  const initScrollMagic = () => {
      const experienceSection = document.querySelector("#experience");

      if (experiencePin) {
          experiencePin.destroy(true); // Clear the old scene
      }

      experiencePin = new ScrollMagic.Scene({
          triggerElement: "#experience",
          triggerHook: 0.1,
          duration: '55%',
      })
          .on("start", (e) => {
            document.querySelector(`.navbar a[href="#experience2"]`).classList.add("active");
          })
          .on("enter", (e) => {
            document.querySelector(`.navbar a[href="#experience2"]`).classList.add("active");
          })
          .on("progress", (e) => {
              const nextSlideIndex = Math.round(e.progress * (slides.length - 1));
              if (nextSlideIndex !== currentSlideIndex) {
                  changeSlide(nextSlideIndex);
              }
          })
          .on("leave", (e) => {
            document.querySelector(`.navbar a[href="#experience2"]`).classList.remove("active");
          })
          .setPin("#experience")
          .addTo(controller);
  };

  // Navigation button events
  navButtons.forEach((button, index) => {
      button.addEventListener("click", () => changeSlide(index));
  });

  // Hamburger menu toggle
  menuIcon.addEventListener("click", () => {
      menu.classList.toggle("active");
  });

  // Close menu when a link is clicked
  navLinks.forEach((link) => {
      link.addEventListener("click", () => {
          menu.classList.remove("active");
      });
  });

  // Dark mode toggle
  darkModeToggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode", this.checked);
  });

  // Smooth scroll for links
  document.querySelectorAll(".nav-link, .quick-links, .hamburger-menu").forEach((link) => {
      link.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute("href"));
          if (target) {
              target.scrollIntoView({ behavior: "smooth" });
          }
      });
  });

  // Update active navigation link on scroll
  window.addEventListener("scroll", () => {
      const scrollPos = window.scrollY + 100;
      document.querySelectorAll("section").forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          const activeLink = document.querySelector(`.navbar a[href="#${section.id}"]`);
          if (activeLink) {
              activeLink.classList.toggle("active", scrollPos >= sectionTop && scrollPos < sectionBottom);
          }
      });
  });

  // Hamburger menu for the navigation panel
  hamburger.addEventListener("click", () => {
      navigation.classList.toggle("active");
  });

  // Handle window resizing
  window.addEventListener("resize", initScrollMagic);

  // Initialize on page load
  initScrollMagic();
});
