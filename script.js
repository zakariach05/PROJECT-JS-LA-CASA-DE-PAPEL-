/**
 * La Casa de Papel - Logic (Restored)
 */

const initScrollReveal = () => {
  const observerOptions = {
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animating once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToReveal = document.querySelectorAll('.reveal-text, .reveal-left, .reveal-right');
  elementsToReveal.forEach(el => observer.observe(el));
};

const initAccordion = () => {
  const cards = document.querySelectorAll(".acc-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      // Remove active from all
      cards.forEach(c => c.classList.remove("active"));
      // Add active to current
      card.classList.add("active");

      // GSAP Animation for smoother feel
      gsap.to(".acc-card", {
        flex: 1,
        duration: 0.6,
        ease: "expo.out"
      });

      gsap.to(card, {
        flex: 3,
        duration: 0.6,
        ease: "expo.out"
      });
    });
  });
};

const initFooterAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  // Animate footer columns
  const footerCols = document.querySelectorAll('.footer-col');
  if (footerCols.length > 0) {
    gsap.to(footerCols, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".footer-premium",
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }

  // Animate social icons
  const socialIcons = document.querySelector('.footer-social');
  if (socialIcons) {
    gsap.to(socialIcons, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: ".footer-middle",
        start: "top 90%",
        toggleActions: "play none none none"
      }
    });
  }

  // Animate footer badge
  const footerBadge = document.querySelector('.footer-badge');
  if (footerBadge) {
    gsap.to(footerBadge, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".footer-middle",
        start: "top 90%",
        toggleActions: "play none none none"
      }
    });
  }

  // Animate footer bottom
  const footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom) {
    gsap.to(footerBottom, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: footerBottom,
        start: "top 95%",
        toggleActions: "play none none none"
      }
    });
  }

  // Newsletter form submit animation
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('.footer-btn');

      gsap.to(btn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Show success message
          const input = newsletterForm.querySelector('input');
          const originalPlaceholder = input.placeholder;
          input.value = '';
          input.placeholder = '✓ Merci de votre inscription !';
          input.style.color = '#4caf50';

          setTimeout(() => {
            input.placeholder = originalPlaceholder;
            input.style.color = '';
          }, 3000);
        }
      });
    });
  }
};

const initSeasonsAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  const seasonCards = document.querySelectorAll('.season-card');
  if (seasonCards.length === 0) return;

  // Animate each season card with stagger
  gsap.fromTo(seasonCards,
    {
      opacity: 0,
      y: 80,
      rotateX: 15,
      scale: 0.9
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration: 1,
      ease: "power3.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: "#saisons",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none"
      }
    }
  );

  // Animate season numbers on hover
  seasonCards.forEach(card => {
    const number = card.querySelector('.season-number');

    card.addEventListener('mouseenter', () => {
      gsap.to(number, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(number, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
};

const initMobileNav = () => {
  // Active state for mobile navigation
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarNav = document.getElementById('navbarNav');
  const body = document.body;

  function setActiveLink() {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Toggle mobile menu
  if (navbarToggler && navbarNav) {
    navbarToggler.addEventListener('click', () => {
      const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarNav.classList.remove('show');
        body.classList.remove('menu-open');
      } else {
        navbarToggler.setAttribute('aria-expanded', 'true');
        navbarNav.classList.add('show');
        body.classList.add('menu-open');
      }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarNav.classList.remove('show');
        body.classList.remove('menu-open');
      });
    });

    // Close menu when clicking overlay
    body.addEventListener('click', (e) => {
      if (body.classList.contains('menu-open') &&
        !navbarNav.contains(e.target) &&
        !navbarToggler.contains(e.target)) {
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarNav.classList.remove('show');
        body.classList.remove('menu-open');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink(); // Call on load
};

const initCharacterAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  const track = document.querySelector(".horizontal-track");
  const cards = document.querySelectorAll(".char-horizontal-card");
  if (!track || cards.length === 0) return;

  // Set initial state via GSAP to avoid CSS opacity:0 issues
  gsap.set(cards, { opacity: 0, scale: 0.8, y: 50 });

  // Horizontal Scroll with Pin Effect
  const scrollTween = gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.1),
    ease: "none",
    scrollTrigger: {
      trigger: "#personnages",
      start: "top top",
      end: () => `+=${track.scrollWidth}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    }
  });

  // Reveal for each card as it enters the view
  cards.forEach((card) => {
    gsap.to(card, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: card,
        containerAnimation: scrollTween,
        start: "left 100%", // Trigger immediately when entering from right
        toggleActions: "play none none none"
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initAnimations();
  initUI();
  initScrollReveal();
  initAccordion();
  initCharacterAnimations();
  initSeasonsAnimations();
  initFooterAnimations();
  initMobileNav();
});

const initSplashScreen = () => {
  const splash = document.querySelector(".splash");
  const mask = document.getElementById("masquesplash");
  if (!splash || !mask) return;

  // Wait 1.5s then start the immersive zoom
  setTimeout(() => {
    // 1. Zoom the mask to fill the screen
    gsap.to(mask, {
      scale: 50,
      duration: 1.5,
      ease: "power2.inOut"
    });

    // 2. Fade out the splash container
    gsap.to(splash, {
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        splash.style.display = "none";
        // 3. Reveal hero elements
        gsap.to(".hero-subtitle, .hero-btns", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        });

        // Glitch effect on title as it appears
        const heroTitle = document.querySelector(".hero-content h1");
        if (heroTitle) {
          gsap.from(heroTitle, {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "expo.out"
          });
        }
      }
    });
  }, 1500);
};

const initAnimations = () => {
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Simple typing simulation for hero
  const heroTitle = document.querySelector(".hero-content h1");
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = "";
    let i = 0;
    const type = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(type, 100);
      }
    };
    setTimeout(type, 2000);
  }
};

const initUI = () => {
  const btnTop = document.getElementById("btnTop");
  if (btnTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 800) {
        btnTop.classList.add("show");
      } else {
        btnTop.classList.remove("show");
      }
    });
    btnTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Sound Toggle for Hero Video
  const video = document.getElementById("hero-video");
  const soundBtn = document.getElementById("soundToggle");

  if (video && soundBtn) {
    // La video doit commencer en muet pour autoriser l'autplay par le navigateur
    video.muted = true;

    // Essayer de lancer la vidéo
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.log("Autoplay bloqué, attente d'interaction");
      });
    }

    soundBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      const icon = soundBtn.querySelector("i");
      const navDot = document.getElementById("navSoundLogo");

      if (video.muted) {
        icon.className = "fas fa-volume-xmark";
        soundBtn.classList.add("muted");
        if (navDot) navDot.classList.add("muted");
      } else {
        icon.className = "fas fa-volume-high";
        soundBtn.classList.remove("muted");
        if (navDot) navDot.classList.remove("muted");
        video.play(); // S'assurer que ça joue quand on active le son
      }
    });

    // Forcer la lecture au premier clic n'importe où sur la page
    document.body.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(_e => console.log("Lecture forcée échouée"));
      }
    }, { once: true });
  }
};
