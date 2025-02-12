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
  document.body.classList.toggle("dark-mode", this.checked);
  const menuIcon = document.querySelector(".menu-icon");
  const menu = document.querySelector(".navbar ul");
  const navLinks = document.querySelectorAll(".navbar .nav-link");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const skills = document.querySelectorAll(".skill");


  // Overview button click logic
  document.querySelector("#home h2").addEventListener("click", (event) => {
    const element = document.querySelector("#what-i-offer");
    const offset = element.offsetTop - 
                  (window.innerHeight / 2) + 
                  (element.clientHeight / 2) - 
                  document.querySelector('.navbar').offsetHeight / 2;
    window.scrollTo({
        top: offset,
        behavior: "smooth"
    });
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
  document.querySelectorAll(".nav-link, .quick-links, .bio-contact-links").forEach((link) => {
      link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = document.querySelector(link.getAttribute("href"));

          if (targetId) {
            handleRedirection(targetId, 0);
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

  document.getElementById("CTA-Modal-Open").addEventListener("click", function() {
    const modal = document.getElementById("CTA-Modal");
    modal.classList.add("show");
  });
  
  document.getElementById("CTA-Modal-Close").addEventListener("click", function() {
    const modal = document.getElementById("CTA-Modal");
    modal.classList.add("hide");
    setTimeout(() => {
      modal.classList.remove("show", "hide");
    }, 500);
  });
  
  window.onclick = function(event) {
    const modal = document.getElementById("CTA-Modal");
    if (event.target == modal) {
      modal.classList.add("hide");
      setTimeout(() => {
        modal.classList.remove("show", "hide");
      }, 500);
    }
  }
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
    document.body.style.overflowY = "visible";
    document.body.style.overflowX = "hidden";
    
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
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // Add 'visible' class when in view
          if(entry.target.classList.contains('what-i-offer-sub-container')){
            entry.target.style.animationDelay = `${index * 0.1}s`; // Stagger the delay for 'what-i-offer-sub-container'
          }
           // Handle staggered animations for tags
           const tags = entry.target.querySelectorAll(".tags span");
           tags.forEach((tag, index) => {
             tag.style.opacity = 0; // Ensure it starts hidden
             tag.style.animation = `fadeInUp 0.3s ease-in-out forwards`;
             tag.style.animationDelay = `${index * 0.1}s`; // Staggered delay
           });
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    },
    { threshold: 0.1 } // Trigger when 10% of the element is visible
  );

  // Target specific elements
  const targets = document.querySelectorAll(".education, .languages, .achievements, .about-container ,.what-i-offer-sub-container, .project-card, .CTA-HireMe-container");
  targets.forEach(target => observer.observe(target));
});

document.addEventListener("DOMContentLoaded", function () {
  const toTopButton = document.getElementById("toTopButton");

    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY;
        let docHeight = document.documentElement.scrollHeight - window.innerHeight;
        let scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollTop > 100) {
            toTopButton.classList.add("show");
            toTopButton.style.setProperty("--progress", `${100 - scrollPercent}%`);
        } else {
            toTopButton.classList.remove("show");
        }
    });

  toTopButton.addEventListener("click", function () {
    handleRedirection(document.getElementById("home"), 0);
  });
});

// CONVEYOR BELT LOGIC

const SETTINGS = {
  baseSpeed: 1,
  spacing: 250,
  touchSensitivity: 1.5,
  snapDuration: 300
};

const TECH_STACK = [
  { name: 'Python', icon: 'devicon-python-plain colored'},
  { name: 'Django', icon: 'devicon-django-plain', color: '#092E20' },
  { name: 'Java', icon: 'fab fa-java', color: '#FF0000' },
  { name: 'C++', icon: 'devicon-cplusplus-plain colored'},
  { name: 'JavaScript', icon: 'fab fa-js', color: '#F7DF1E' },
  { name: 'PHP', icon: 'fab fa-php', color: '#777BB4' },
  { name: 'MongoDB', icon: 'devicon-mongodb-plain', color: '#47A248' },
  { name: 'WordPress', icon: 'fab fa-wordpress', color: '#21759B' },
  { name: 'Unreal Engine', icon: 'devicon-unrealengine-original'},
  { name: 'VS Code', icon: 'devicon-vscode-plain colored'}
];

class TechConveyor {
  constructor() {
    this.container = document.querySelector('.conveyor-container');
    this.track = document.querySelector('.conveyor-track');
    this.position = 0;
    this.startX = 0;
    this.isDragging = false;
    this.isPaused = false;
    this.itemWidth = 0;
    // Create multiple sets for seamless looping
    this.items = [...TECH_STACK, ...TECH_STACK];
    this.lastDragTime = 0;
    this.dragVelocity = 0;
    this.containerWidth = 0;

    this.init();
  }

  init() {
    this.calculateContainerWidth();
    this.updateItemWidth();
    this.renderItems();
    this.setupEventListeners();
    this.startAnimation();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.calculateContainerWidth();
        this.updateItemWidth();
      }, 250);
    });
  }

  calculateContainerWidth() {
    // Set container width based on visibleItems
    const containerStyles = window.getComputedStyle(this.container);
    const paddingLeft = parseFloat(containerStyles.paddingLeft);
    const paddingRight = parseFloat(containerStyles.paddingRight);
    
    // Calculate the desired container width based on visibleItems
    this.containerWidth = this.container.parentElement.offsetWidth;
    const maxWidth = (this.containerWidth - paddingLeft - paddingRight);
    this.container.style.maxWidth = `${maxWidth}px`;
  }

  updateItemWidth() {
    const availableWidth = this.container.offsetWidth;

    // Dynamically adjust SETTINGS.spacing as a percentage of available width
    const spacingRatio = availableWidth / window.innerWidth; // Proportional to viewport width
    SETTINGS.spacing = availableWidth * spacingRatio * 0.25; // 10% of available width

    // Ensure a minimum spacing based on viewport constraints
    SETTINGS.spacing = Math.max(SETTINGS.spacing, SETTINGS.spacing * 0.25);

    // Calculate icon size dynamically based on available width
    const estimatedIconSize = availableWidth * 0.08; // Proportional to available width

    // Determine how many icons fit within the available space
    const numItems = Math.floor(availableWidth / (SETTINGS.spacing + estimatedIconSize));

    // Recalculate exact item width to fit evenly
    if (numItems > 0) {
        const totalSpacing = (numItems - 1) * SETTINGS.spacing;
        this.itemWidth = (availableWidth - totalSpacing) / numItems;
    } else {
        this.itemWidth = estimatedIconSize; // Fallback to estimated size if necessary
    }

    this.updateItemStyles();
    this.position = 0;
    this.updateTrackPosition(true);
}


  getSetWidth() {
    return (this.itemWidth + SETTINGS.spacing) * TECH_STACK.length;
  }

  updateItemStyles() {
    const items = this.track.children;
    for (let item of items) {
        item.style.width = `${this.itemWidth}px`;
        item.style.flexShrink = '0';
    }
    this.track.style.gap = `${SETTINGS.spacing}px`;
}

  renderItems() {
    this.track.innerHTML = this.items.map(tech => `
      <div class="tech-item">
        <i class="${tech.icon}" style="color: ${tech.color || ''}"></i>
        <span>${tech.name}</span>
      </div>
    `).join('');
  }

  setupEventListeners() {
    this.container.addEventListener('mouseenter', () => this.isPaused = true);
    this.container.addEventListener('mouseleave', () => {
      this.isPaused = false;
      this.isDragging = false;
    });
    
    this.container.addEventListener('mousedown', e => {
      e.preventDefault();
      this.handleDragStart(e.clientX);
    });
    
    document.addEventListener('mousemove', e => {
      if (this.isDragging) {
        e.preventDefault();
        this.handleDragMove(e.clientX);
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.handleDragEnd();
      }
    });
    
    // Touch Events
    document.querySelector(".tech-conveyor").addEventListener('touchstart', e => {
      e.preventDefault(); // Prevent any default behavior
      this.isPaused = true;
      this.handleDragStart(e.touches[0].clientX); // Handle drag start on touch
    }, { passive: false });
  
    document.querySelector(".tech-conveyor").addEventListener('touchmove', e => {
      if (this.isDragging) {
        e.preventDefault();  // Prevent default scroll behavior
        this.handleDragMove(e.touches[0].clientX);  // Handle drag move on touch
      }
    }, { passive: false });
  
    document.querySelector(".tech-conveyor").addEventListener('touchend', () => {
      this.isPaused = false;
      this.handleDragEnd();  // Handle drag end on touch
    }, { passive: false });
  }

  handleDragStart(clientX) {
    this.isDragging = true;
    this.startX = clientX - this.position;
    this.lastDragTime = performance.now();
    this.lastDragX = clientX;
    this.dragVelocity = 0;
    this.track.style.transition = 'none';
  }

  handleDragMove(clientX) {
    const currentTime = performance.now();
    const timeDelta = currentTime - this.lastDragTime;
    const dragDelta = clientX - this.lastDragX;
    
    if (timeDelta > 0) {
      this.dragVelocity = dragDelta / timeDelta;
    }
    
    this.lastDragTime = currentTime;
    this.lastDragX = clientX;

    this.position = clientX - this.startX;
    this.checkAndUpdatePosition();
    this.updateTrackPosition(true);
  }

  handleDragEnd() {
    this.isDragging = false;
    this.track.style.transition = `transform ${SETTINGS.snapDuration}ms ease-out`;
    
    if (Math.abs(this.dragVelocity) > 0.1) {
      const momentum = this.dragVelocity * 100;
      this.position += momentum;
      this.checkAndUpdatePosition();
    }
  }

  checkAndUpdatePosition() {
    const setWidth = this.getSetWidth();
  
    // Reset position when the first set reaches the end
    if (this.position <= -setWidth) {
      this.position += setWidth;  // Move to the start of the second set
      this.track.style.transition = 'none'; // No transition during reset
      this.updateTrackPosition(true);  // Update position instantly
    }
  
    // When the position is reset, just scroll the second set.
    if (this.position >= 0) {
      this.position -= setWidth;  // Move to the start of the first set
      this.track.style.transition = 'none'; // No transition during reset
      this.updateTrackPosition(true);  // Update position instantly
    }
  }
  
  

  updateTrackPosition(immediate = false) {
    if (immediate) {
      this.track.style.transition = 'none'; // No transition on reset
    }
    this.track.style.transform = `translateX(${this.position}px)`; // Update position
  
    if (immediate) {
      this.track.offsetHeight; // Force browser to apply styles
      this.track.style.transition = `transform ${SETTINGS.snapDuration}ms ease-out`; // Add transition back
    }
  }  
  

  startAnimation() {
    let lastTime = performance.now();

    const animate = (currentTime) => {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        if (!this.isPaused && !this.isDragging) {
            // Normalize speed as a percentage of the container width
            const speedFactor = this.container.offsetWidth / window.innerWidth; 
            
            // Adjust speed proportionally so it stays the same across all screen sizes
            const normalizedSpeed = SETTINGS.baseSpeed * speedFactor * 0.05;  

            this.position -= deltaTime * normalizedSpeed;

            this.checkAndUpdatePosition();
            this.updateTrackPosition();
        }

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

}

window.addEventListener('load', () => {
  new TechConveyor();
});