  document.documentElement.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  reveals.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${(index % 3) * 45}ms`);
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(element => element.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach(element => observer.observe(element));
  }

  const aboutImage = document.querySelector('.about-img-wrapper img');
  if (aboutImage) {
    const showAboutImage = () => aboutImage.classList.add('loaded');
    if (aboutImage.complete) {
      showAboutImage();
    } else {
      aboutImage.addEventListener('load', showAboutImage, { once: true });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      if (!id) {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        return;
      }
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' }); }
    });
  });

  // Smart Navbar (hide on scroll down, show on scroll up)
  let lastScrollY = window.scrollY;
  const navbar = document.querySelector('nav');
  const scrollTopBtn = document.getElementById('page-up-action');
  const scrollProgress = document.querySelector('.scroll-progress span');
  const navLinksMenu = document.querySelector('.nav-links');

  let scrollTicking = false;

  const updateScrollUI = () => {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    const isMenuOpen = navLinksMenu && navLinksMenu.classList.contains('active');

    if (navbar && currentScrollY > lastScrollY && currentScrollY > 96 && !isMenuOpen) {
      navbar.classList.add('nav-hidden');
    } else if (navbar && currentScrollY < lastScrollY - 4) {
      navbar.classList.remove('nav-hidden');
    }
    lastScrollY = currentScrollY;

    // Scroll progress bar
    if (scrollProgress) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, currentScrollY / scrollable) : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
    }

    // Scroll to top button: show after 400px, hide again near the footer
    if (scrollTopBtn) {
      const nearBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 240;
      if (currentScrollY > 400 && !nearBottom) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // At the very top no section should read as current
    if (currentScrollY < 160) {
      document.querySelectorAll('.nav-links a.active').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      });
    }

    scrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollUI);
      scrollTicking = true;
    }
  }, { passive: true });

  // Reveal the navbar whenever the pointer nears the top edge
  window.addEventListener('mousemove', event => {
    if (navbar && event.clientY <= 90) navbar.classList.remove('nav-hidden');
  }, { passive: true });

  // Scroll to top click handler
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  const syncOverlayLock = () => {
    document.body.classList.toggle('overlay-open', Boolean(document.querySelector('.modal-overlay.visible')));
  };

  let lastFocusedElement = null;
  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const openOverlay = overlay => {
    lastFocusedElement = document.activeElement;
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
    syncOverlayLock();
    const firstFocusable = overlay.querySelector(focusableSelector) || overlay.querySelector('.modal-content');
    if (firstFocusable) window.requestAnimationFrame(() => firstFocusable.focus());
  };

  const closeOverlay = overlay => {
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    syncOverlayLock();
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
  };

  document.addEventListener('keydown', event => {
    const overlay = document.querySelector('.modal-overlay.visible');
    if (!overlay || event.key !== 'Tab') return;
    const focusable = [...overlay.querySelectorAll(focusableSelector)].filter(element => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
  const sections = sectionLinks.map(link => document.getElementById(link.dataset.sectionLink)).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(link => {
          const isActive = link.dataset.sectionLink === entry.target.id;
          link.classList.toggle('active', isActive);
          if (isActive) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -58% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Image Lightbox Logic
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const projectImages = document.querySelectorAll('.project-visual img');
  const certificateButtons = document.querySelectorAll('.certification-view-btn');

  window.openCertificateLightbox = (imageSrc, altText) => {
    if (!lightboxModal || !lightboxImg || !imageSrc) return;
    lightboxImg.src = imageSrc;
    lightboxImg.alt = altText || 'Full Screen Preview';
    openOverlay(lightboxModal);
  };

  if (lightboxModal && lightboxImg) {
    const openLightbox = (imageSrc, altText) => {
      lightboxImg.src = imageSrc;
      lightboxImg.alt = altText || 'Full Screen Preview';
      openOverlay(lightboxModal);
    };

    projectImages.forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(img.src, img.alt || 'Project preview');
      });
    });

    certificateButtons.forEach(button => {
      button.addEventListener('click', () => {
        const imageSrc = button.dataset.certImage;
        const title = button.dataset.certTitle || 'Certificate preview';
        if (imageSrc) openLightbox(imageSrc, `${title} certificate`);
      });
    });

    const closeLightbox = () => {
      closeOverlay(lightboxModal);
      setTimeout(() => { if (!lightboxModal.classList.contains('visible')) lightboxImg.src = ''; }, prefersReducedMotion ? 0 : 300);
    };

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('visible')) closeLightbox();
    });
  }

  // Project Filter Chips
  const filterContainer = document.querySelector('.projects-filter');
  if (filterContainer) {
    const chips = [...filterContainer.querySelectorAll('.filter-chip')];
    const projectCards = [...document.querySelectorAll('#projects .project-card')];
    const filterStatus = filterContainer.querySelector('.filter-status');

    const countFor = filter => projectCards.filter(card => filter === 'all' || card.dataset.category === filter).length;
    const applyFilter = filter => {
      chips.forEach(chip => {
        const isActive = chip.dataset.filter === filter;
        chip.classList.toggle('is-active', isActive);
        chip.setAttribute('aria-pressed', String(isActive));
      });
      projectCards.forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
      if (filterStatus) filterStatus.textContent = `Showing ${countFor(filter)} of ${projectCards.length} projects`;
    };

    chips.forEach(chip => {
      chip.insertAdjacentHTML('beforeend', `<span class="filter-count"> ${countFor(chip.dataset.filter)}</span>`);
      chip.addEventListener('click', () => applyFilter(chip.dataset.filter));
    });
  }

  // Hamburger Menu Logic
  const hamburgerBtn = document.querySelector('.hamburger');
  if (hamburgerBtn && navLinksMenu) {
    const menuFocusables = () => [...navLinksMenu.querySelectorAll(focusableSelector)].filter(element => element.offsetParent !== null);
    let returnFocusToHamburger = false;

    const setMenuState = open => {
      hamburgerBtn.classList.toggle('active', open);
      navLinksMenu.classList.toggle('active', open);
      document.body.classList.toggle('menu-open', open);
      hamburgerBtn.setAttribute('aria-expanded', String(open));
      if (open && navbar) navbar.classList.remove('nav-hidden');
      if (open) {
        const first = menuFocusables()[0];
        if (first && document.activeElement !== first) first.focus({ preventScroll: true });
      } else if (returnFocusToHamburger) {
        hamburgerBtn.focus({ preventScroll: true });
        returnFocusToHamburger = false;
      }
    };

    hamburgerBtn.addEventListener('click', () => {
      returnFocusToHamburger = false;
      setMenuState(!navLinksMenu.classList.contains('active'));
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        returnFocusToHamburger = true;
        setMenuState(false);
      });
    });

    document.addEventListener('click', event => {
      if (navLinksMenu.classList.contains('active') && !navbar.contains(event.target)) {
        returnFocusToHamburger = false;
        setMenuState(false);
      }
    });

    window.addEventListener('keydown', event => {
      if (!navLinksMenu.classList.contains('active')) return;
      if (event.key === 'Tab') {
        const focusable = menuFocusables();
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      } else if (event.key === 'Escape') {
        returnFocusToHamburger = true;
        setMenuState(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && navLinksMenu.classList.contains('active')) setMenuState(false);
    }, { passive: true });
  }

  // Typing Effect for Hero Sub-heading
  const typeWriterElement = document.getElementById('typewriter');
  const titles = ["IT Student", "Full-Stack Developer", "Game Developer","Web Developer", "AI Enthusiast","Emerging Technologist", "Creative Coder", "Lifelong Learner"];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeWriter() {
    const currentText = titles[titleIndex];
    
    if (isDeleting) {
      typeWriterElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typeWriterElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : Math.random() * 40 + 50;

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000; // Pause before deleting
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 500; // Pause before typing the next word
    }

    setTimeout(typeWriter, typeSpeed);
  }

  // Start typing after initial CSS slideUpFade animation finishes (1000ms)
  if (prefersReducedMotion) {
    typeWriterElement.textContent = 'Full-Stack Developer';
  } else {
    setTimeout(typeWriter, 1000);
  }

  // Resume View Modal Logic
  const viewResumeBtn = document.getElementById('view-resume-btn');
  const resumeViewModal = document.getElementById('resume-view-modal');
  const closeResumeViewBtn = document.getElementById('close-resume-view-btn');

  if (viewResumeBtn && resumeViewModal && closeResumeViewBtn) {
    const closeResumeView = () => closeOverlay(resumeViewModal);

    viewResumeBtn.addEventListener('click', () => {
      openOverlay(resumeViewModal);
    });

    closeResumeViewBtn.addEventListener('click', closeResumeView);

    resumeViewModal.addEventListener('click', (e) => {
      if (e.target === resumeViewModal) closeResumeView();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeViewModal.classList.contains('visible')) closeResumeView();
    });
  }

