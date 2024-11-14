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
  
// Initialize ScrollMagic Controller
const controller = new ScrollMagic.Controller();

// Get elements
const slides = document.querySelectorAll('.slide');
const navButtons = document.querySelectorAll('.nav-btn');
const totalSlides = slides.length;
let currentSlideIndex = 0;

// Function to change slide based on index
function changeSlide(index) {
    if (index >= 0 && index < totalSlides) {
        // Hide all slides and show the current one
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlideIndex = index;

        // Update active state of navigation buttons
        navButtons.forEach((button, i) => {
            button.classList.toggle('active', i === currentSlideIndex);
        });
    }
}

// Create ScrollMagic Scenes
function createScenes() {
    // Scene for pinning the #experience section
    const pinScene = new ScrollMagic.Scene({
        triggerElement: "#experience",
        triggerHook: 0,
        duration: "100%", // Adjust as needed
    })
    .setPin("#experience")
    .on("enter leave", (e) => {
        console.log(`Pin state: ${e.type === "enter" ? "Activated" : "Deactivated"}`);
    })
    .addTo(controller);

    // Scene for controlling slide transition based on scroll
    const slideScene = new ScrollMagic.Scene({
        triggerElement: "#experience",
        triggerHook: 0,
        duration: "100%",
    })
    .on("progress", (e) => {
        // Calculate the slide index based on the progress, snapping to the nearest integer
        const progress = e.progress * (totalSlides - 1);
        const nextSlideIndex = Math.ceil(progress); // Snap to nearest integer
        
        if (nextSlideIndex !== currentSlideIndex) {
            changeSlide(nextSlideIndex); // Change slide only if the index changes
        }
    })
    .addTo(controller);

    // Save scenes for resizing updates
    return { pinScene, slideScene };
}

// Initialize scenes and save for resizing
let scenes = createScenes();

// Navigation Buttons for Direct Slide Change
navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        changeSlide(index);
    });
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
  document.querySelectorAll(".nav-link, .quick-links, .hamburger-menu").forEach(link => {
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

  // Select hamburger and navigation menu
  const hamburger = document.querySelector('.hamburger-menu');
  const navigation = document.querySelector('.navigation');

  // Toggle navigation visibility on click
  hamburger.addEventListener('click', () => {
    navigation.classList.toggle('active');
  });
});



