$(function () { // wait for document ready
  // init
  var controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll('.slide');
  const navButtons = document.querySelectorAll('.nav-btn');
  const totalSlides = slides.length;
  let currentSlideIndex = 0;

  // define movement of panels
  const wipeAnimation = new TimelineMax()
 

  // ScrollMagic scene to control the animation
  const experiencePin = new ScrollMagic.Scene({
    triggerElement: "#experience",
    triggerHook: 0,
    duration: "55%" // Adjust duration for finer scroll control
  })
  .on('enter', () => {
    // Add active class to the experience link when entering the section
    document.querySelectorAll(".navbar .nav-link").forEach(link => link.classList.remove("active"));
    const experienceLink = document.querySelector('.navbar .nav-link[href="#experience2"]');
    if (experienceLink) {
      experienceLink.classList.add("active");
    }
  })
  .on('leave', () => {
    // Remove active class when leaving the section
    const experienceLink = document.querySelector('.navbar .nav-link[href="#experience2"]');
    if (experienceLink) {
      experienceLink.classList.remove("active");
    }
  })
  .on('progress', (e) => {
    const progress = e.progress * (totalSlides - 1);
    const nextSlideIndex = Math.round(progress); // Snap to the nearest integer for slide index
    
    if (nextSlideIndex !== currentSlideIndex) {
      changeSlide(nextSlideIndex); // Change slide only if the index changes
    }

    // Add active class to the experience link when entering the section
    document.querySelectorAll(".navbar .nav-link").forEach(link => link.classList.remove("active"));
    const experienceLink = document.querySelector('.navbar .nav-link[href="#experience2"]');
    if (experienceLink) {
      experienceLink.classList.add("active");
    }

  })
  .setPin("#experience")
  .setTween(wipeAnimation)
  .addTo(controller);


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
    let scrollPos = window.scrollY + 100;

    // Clear any previously 'active' link
    document.querySelectorAll(".navbar .nav-link").forEach(link => link.classList.remove("active"));

    // Check each section
    document.querySelectorAll("section").forEach(section => {
      
    const state = experiencePin.state();

    // Simple mapping of state to a number
    const stateMap = {
      'BEFORE': 0,
      'DURING': 1,
      'AFTER': 2
    };

    const stateNumber = stateMap[state] || -1; // Default to -1 if the state is not recognized

    console.log(stateNumber);
      if(stateNumber == 1)
        return
      console.log(`Checking section #${section.id}: offsetTop=${section.offsetTop}, height=${section.offsetHeight}`);

      // Determine if the current scroll position is within the section bounds
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const activeLink = document.querySelector(`.navbar a[href="#${section.id}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
          console.log(`Activated link for section #${section.id}`);
        } else {
          console.warn(`No matching link found for section #${section.id}`);
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


