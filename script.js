document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".menu-icon");
  const menu = document.querySelector(".navbar ul");
  const navLinks = document.querySelectorAll(".navbar .nav-link");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const hamburger = document.querySelector(".hamburger-menu");
  const navigation = document.querySelector(".navigation");
  const skills = document.querySelectorAll(".skill");

  const observerOptions = {
    root: null, // Observe viewport
    threshold: 0.1, // Trigger when 10% of the element is visible
  };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skill = entry.target;
        const currentScore = parseInt(skill.getAttribute('current-score'));
        const container = skill.querySelector('.skill-images-container');

        // Add circles dynamically and animate them
        for (let i = 0; i < 10; i++) {
          const circle = document.createElement('div');
          container.appendChild(circle);

          if (i < currentScore) {
            setTimeout(() => {
              circle.classList.add('filled');
            }, i * 200); // Delay each circle by 200ms
          }
        }

        // Stop observing once the animation is triggered
        skillObserver.unobserve(skill);
      }
    });
  }, observerOptions);

  // Observe each skill element
  skills.forEach(skill => skillObserver.observe(skill));

  

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
});

document.addEventListener("DOMContentLoaded", () => {
  const experienceSection = document.getElementById("experience");
  const slides = Array.from(experienceSection.querySelectorAll(".slide"));
  const navButtons = Array.from(experienceSection.querySelectorAll(".nav-btn"));
  const navLinks = document.querySelectorAll(".nav-link");

  let currentIndex = 0;
  let isScrolling = false;
  let isSectionInView = false;
  let isAtBoundary = false;


  navButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (currentIndex !== index) {
        const direction = index > currentIndex ? "down" : "up";
        currentIndex = index; // Update current index
        isScrolling = true;
        updateSlideClasses(currentIndex, direction);

        // Set timeout to match the transition duration
        setTimeout(() => {
          isScrolling = false;
        }, 800); // Match with CSS animation duration

        console.log("Nav button clicked, moved to slide:", currentIndex);
      }
    });
  });

  const lockScroll = () => {
    console.log("Scroll locked");
    setTimeout(() => {
      const targetPosition = experienceSection.getBoundingClientRect().top + window.scrollY - 25;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }, 100);
    document.body.style.overflow = "hidden";
    sectionObserver.disconnect();
    experienceSection.addEventListener("wheel", handleScroll);
  };

  const unlockScroll = () => {
    console.log("Scroll unlocked");
    document.body.style.overflow = "auto";
    sectionObserver.observe(experienceSection);
    experienceSection.removeEventListener("wheel", handleScroll);
  };

  const updateSlideClasses = (newIndex, direction) => {
    slides.forEach((slide, idx) => {
      slide.classList.remove(
        "slide-in-right",
        "slide-in-left",
        "slide-out-right",
        "slide-out-left",
        "active"
      );

      if (idx === newIndex) {
        slide.classList.add("active", direction === "down" ? "slide-in-right" : "slide-in-left");
      } else if (idx === currentIndex) {
        slide.classList.add(direction === "down" ? "slide-out-left" : "slide-out-right");
      }
    });

    navButtons.forEach((button, idx) => {
      button.classList.remove("active");
      if (idx === newIndex) {
        button.classList.add("active");
      }
    });
  };

  const handleScroll = (event) => {
    if (!isSectionInView || isAtBoundary) {
      console.log("Scroll ignored. Section not fully in view or at boundary.");
      return;
    }
  
    if (isScrolling) {
      console.log("Scroll is locked or in progress.");
      return;
    }
  
    const deltaY = event.deltaY;
  
    let direction = null;
  
    // Determine direction and update index if possible
    if (deltaY > 0 && currentIndex < slides.length - 1) {
      direction = "down";
      currentIndex++;
    } else if (deltaY < 0 && currentIndex > 0) {
      direction = "up";
      currentIndex--;
    }
  
    // Handle scrolling
    if (direction) {
      isScrolling = true;
      updateSlideClasses(currentIndex, direction);
  
      setTimeout(() => {
        isScrolling = false;
      }, 800); // Match with CSS animation duration
    }
  
    // Handle boundaries (first and last slides)
    if (currentIndex === 0 || currentIndex === slides.length - 1) {
      isAtBoundary = true; // Set the flag to true at boundaries
      unlockScroll();
    } else {
      isAtBoundary = false; // Reset the flag for middle slides
    }
  };
  
  // Observer to handle section visibility
  const sectionObserver = new IntersectionObserver(
    ([entry]) => {  
      // Reset isAtBoundary when section is outside of view
      if (isAtBoundary) {
        if(entry.intersectionRatio <= 0.925){
          isAtBoundary = false; // Section is no longer in view, reset boundary flag
        }
        return
      }
  
      // If the section is in view and not at the boundary, lock scrolling
      if (entry.intersectionRatio > 0.925) {
        isSectionInView = true;
        lockScroll();
      } else {
        isSectionInView = false;
      }
    },
    {
      threshold: Array.from({ length: 101 }, (_, i) => i / 100), // Fine-grained thresholds
    }
  );
  

  sectionObserver.observe(experienceSection);

  // Attach scroll listener only when section is in view
  experienceSection.addEventListener("wheel", handleScroll);

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      setTimeout(() => {
        const targetIndex = Array.from(navLinks).indexOf(link); // Get index of the clicked nav item
        const experienceIndex = Array.from(navLinks).findIndex((navLink) =>
        navLink.getAttribute("href").includes("experience"));
        if(targetIndex > experienceIndex) {
          currentIndex = slides.length - 1; // Reset to first slide
          updateSlideClasses(currentIndex, "up"); // Update slide classes
        }else{
          currentIndex = 0;
          updateSlideClasses(currentIndex, "down");
        }
        unlockScroll();
      }, 300); // Delay to make sure we unlock after a while so we are outside of the section
    })
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const homeSection = document.querySelector('#home');
  const aboutSection = document.querySelector('.about.extra-padding');
  const offset = 200;

  // Helper function to check if a section is fully visible
  function isFullyVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  }

  // Helper function to check if a section is partially visible
  function isPartiallyVisible(el, threshold = 0.05) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const topVisible = rect.top >= 0 && rect.top < windowHeight * threshold;
    const bottomVisible = rect.bottom > windowHeight * (1 - threshold) && rect.bottom <= windowHeight;
    return topVisible || bottomVisible;
  }

  let hasScrolledToAbout = false; // Prevents multiple triggers
  let isInFullView = false; // Tracks if about section is in full view

  // Scroll event listener
  window.addEventListener('scroll', () => {
    const homeVisible = isFullyVisible(homeSection);
    const aboutPartiallyVisible = isPartiallyVisible(aboutSection, 0.9);

    // Scroll down: Expand the about section fully
    if (!hasScrolledToAbout && aboutPartiallyVisible) {
      aboutSection.classList.add('full-view');
      hasScrolledToAbout = true;
      setTimeout(() => {
        const targetPosition = aboutSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        isInFullView = true;
      }, 300);           
    }

    // Scroll up: Reset the about section when home is fully visible
    if (homeVisible && isInFullView) {
      aboutSection.classList.remove('full-view');
      hasScrolledToAbout = false;
      isInFullView = false;
    }
  });
});
