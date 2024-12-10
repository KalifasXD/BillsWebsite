let isRedirecting = false;
let scrollTimeout;

function handleRedirection(scrollToTarget, offset) {
  if (isRedirecting) {
    console.log("Already in motion. Can't initiate a new redirection");
    return;
  }

  isRedirecting = true;
  const finalOffsetPOS = scrollToTarget.getBoundingClientRect().top + window.scrollY - offset;
  scrollToTarget.scrollIntoView({behavior: 'smooth'});
  
  // Listen for the scrolling to end using requestAnimationFrame
  const checkScrollEnd = () => {
    // If the page is still scrolling, continue checking
    if (Math.abs(window.scrollY - finalOffsetPOS) > (offset || 10)) {
      requestAnimationFrame(checkScrollEnd); // Keep checking if not yet scrolled to the target
    } else {
      window.scrollTo({ top: finalOffsetPOS, behavior: 'smooth' });
      setTimeout(() => {
        isRedirecting = false;
        console.log("Can redirect again!");
      }, 500);
    }
  };

  // Start checking once the scrolling starts
  checkScrollEnd();
}

document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".menu-icon");
  const menu = document.querySelector(".navbar ul");
  const navLinks = document.querySelectorAll(".navbar .nav-link");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const hamburger = document.querySelector(".hamburger-menu");
  const navigation = document.querySelector(".navigation");
  const skills = document.querySelectorAll(".skill");


  // Overview button click logic
  document.querySelector("#home h2").addEventListener("click", (event) => {
    document.querySelector("#what-i-offer").scrollIntoView({behavior: 'smooth'});
  });


  const observerOptions = {
    root: null, // Observe viewport
    threshold: 0.1, // Trigger when 10% of the element is visible
  };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skill = entry.target;
        const currentScore = parseInt(skill.getAttribute('current-score'));
        const totalScore = parseInt(skill.getAttribute("score"));
        const container = skill.querySelector('.skill-images-container');
        const title = skill.querySelector('h2'); // Target the title for fading
  
        // Add fade-in effect to the title
        title.classList.add('fade_in');
  
        // Add circles dynamically and animate them
        for (let i = 0; i < totalScore; i++) {
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
          const targetId = document.querySelector(link.getAttribute("href"));

          if (targetId) {
            handleRedirection(targetId, 0);
            //target.scrollIntoView({ behavior: "smooth" });
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
  let startY = 0; // For touch handling

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
    document.body.style.overflowY = "hidden";
    document.body.style.overflowX = "hidden";
    //sectionObserver.disconnect();
    //experienceSection.addEventListener("wheel", handleScroll);
    ['scroll', 'wheel'].forEach(event => {
      experienceSection.addEventListener(event, handleScroll, { passive: false} );
    });
    // Add touchstart and touchmove listeners
    experienceSection.addEventListener("touchstart", handleTouchStart, { passive: false });
    experienceSection.addEventListener("touchmove", handleTouchMove, { passive: false });
  
    setTimeout(() => {
      const targetPosition = experienceSection.getBoundingClientRect().top + window.scrollY - 25;
      handleRedirection(experienceSection, 50);
      //window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }, 100);
    
  };

  const handleTouchStart = (event) => {
    startY = event.touches[0].clientY; // Record initial touch Y position
  };
  
  const handleTouchMove = (event) => {
    const currentY = event.touches[0].clientY;
    const deltaY = startY - currentY; // Calculate deltaY (similar to wheel event deltaY)
  
    // Simulate a scroll event and call handleScroll
    handleScroll({ deltaY });
  
    // Update startY for continuous scrolling
    startY = currentY;
  
    event.preventDefault(); // Prevent default scrolling behavior
  };

  const unlockScroll = () => {
    console.log("Scroll unlocked");
    document.body.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";
    //sectionObserver.observe(experienceSection);
    //experienceSection.removeEventListener("wheel", handleScroll);
    ['scroll', 'wheel'].forEach(event => {
      experienceSection.removeEventListener(event, handleScroll);
    });
    experienceSection.removeEventListener("touchstart", handleTouchStart, { passive: false });
    experienceSection.removeEventListener("touchmove", handleTouchMove, { passive: false });
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

  const handleScroll = (event, simulatedDeltaY = null) => {
    // Use provided deltaY (from touchmove) or extract from event
    const deltaY = simulatedDeltaY !== null ? simulatedDeltaY : event.deltaY;
  
    if (!isSectionInView || isAtBoundary) {
      console.log("Scroll ignored. Section not fully in view or at boundary.");
      unlockScroll();
      return;
    }
  
    if (isScrolling) {
      console.log("Scroll is locked or in progress.");
      return;
    }
  
    if (!deltaY) {
      console.log("No deltaY detected.");
      return;
    }
  
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
          unlockScroll();
        }
        return
      }
  
      // If the section is in view and not at the boundary, lock scrolling
      if (entry.intersectionRatio > 0.925) {
        isSectionInView = true;
        lockScroll();
      } else {
        isSectionInView = false;
        unlockScroll();
      }
    },
    {
      threshold: 0.925 // Fine-grained thresholds
    }
  );
  

  sectionObserver.observe(experienceSection);

  // Attach scroll listener only when section is in view
  // experienceSection.addEventListener("wheel", handleScroll);
  // experienceSection.addEventListener("touchmove", handleScroll);
  ['scroll', 'wheel'].forEach(event => {
    experienceSection.addEventListener(event, handleScroll, {passive: false});
  });

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
  const aboutHeader = document.querySelector('#home h2');
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
      aboutHeader.classList.add('full-view');
      hasScrolledToAbout = true;
      setTimeout(() => {
        const targetPosition = aboutSection.getBoundingClientRect().top + window.scrollY - offset;
        //window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        handleRedirection(aboutSection, offset);
        isInFullView = true;
      }, 300);           
    }

    // Scroll up: Reset the about section when home is fully visible
    if (homeVisible && isInFullView) {
      aboutSection.classList.remove('full-view');
      aboutHeader.classList.remove('full-view');
      hasScrolledToAbout = false;
      isInFullView = false;
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // Add 'visible' class when in view
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    },
    { threshold: 0.1 } // Trigger when 10% of the element is visible
  );

  // Target specific elements
  const targets = document.querySelectorAll(".education, .languages, .achievements");
  targets.forEach(target => observer.observe(target));
});