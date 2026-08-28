  document.documentElement.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  reveals.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
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

    // Scroll to top button visibility logic
    if (scrollTopBtn) {
      if (currentScrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    scrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollUI);
      scrollTicking = true;
    }
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

  const openOverlay = overlay => {
    overlay.classList.add('visible');
    syncOverlayLock();
  };

  const closeOverlay = overlay => {
    overlay.classList.remove('visible');
    syncOverlayLock();
  };

  // Resume download modal
  const hireMeBtn = document.getElementById('hire-me-btn');
  const resumeModal = document.getElementById('resume-modal');
  const closeModalBtn = document.getElementById('modal-cancel-btn');
  const confirmDownloadBtn = document.getElementById('modal-download-btn');

  if (hireMeBtn && resumeModal && closeModalBtn && confirmDownloadBtn) {
    // Show modal on "Hire me" click
    hireMeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openOverlay(resumeModal);
    });

    // Function to hide modal
    const hideModal = () => {
      closeOverlay(resumeModal);
    };

    // Hide modal on Cancel or clicking the overlay
    closeModalBtn.addEventListener('click', hideModal);
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        hideModal();
      }
    });

    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && resumeModal.classList.contains('visible')) hideModal();
    });

    // Handle the download on Confirm
    confirmDownloadBtn.addEventListener('click', () => {
      hideModal();
      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = hireMeBtn.href;
      link.download = hireMeBtn.getAttribute('download');
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      // Add a slight delay before removing so mobile browsers have time to register the tap
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    });
  }

  // Image Lightbox Logic
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const projectImages = document.querySelectorAll('.project-visual img');

  if (lightboxModal && lightboxImg) {
    projectImages.forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault(); // Stop the link from redirecting
        e.stopPropagation();
        lightboxImg.src = img.src;
        openOverlay(lightboxModal);
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

  // Hamburger Menu Logic
  const hamburgerBtn = document.querySelector('.hamburger');
  if (hamburgerBtn && navLinksMenu) {
    const setMenuState = open => {
      hamburgerBtn.classList.toggle('active', open);
      navLinksMenu.classList.toggle('active', open);
      document.body.classList.toggle('menu-open', open);
      hamburgerBtn.setAttribute('aria-expanded', String(open));
      if (open && navbar) navbar.classList.remove('nav-hidden');
    };

    hamburgerBtn.addEventListener('click', () => setMenuState(!navLinksMenu.classList.contains('active')));

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('click', event => {
      if (navLinksMenu.classList.contains('active') && !navbar.contains(event.target)) {
        setMenuState(false);
      }
    });

    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navLinksMenu.classList.contains('active')) {
        setMenuState(false);
        hamburgerBtn.focus();
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

  // WIP Modal Logic for AgapAI
  const agapaiProjectCard = document.getElementById('agapai-project');
  const wipModal = document.getElementById('wip-modal');
  const wipModalCloseBtn = document.getElementById('wip-modal-close-btn');

  if (agapaiProjectCard && wipModal && wipModalCloseBtn) {
    const closeWipModal = () => closeOverlay(wipModal);

    agapaiProjectCard.addEventListener('click', (e) => {
      e.preventDefault();
      openOverlay(wipModal);
    });

    wipModalCloseBtn.addEventListener('click', closeWipModal);

    wipModal.addEventListener('click', (e) => {
      if (e.target === wipModal) closeWipModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wipModal.classList.contains('visible')) closeWipModal();
    });
  }
