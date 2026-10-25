/**
 * João Vitor - Portfolio Script
 * Tokyo/Kura creative architecture with smooth SPA transitions,
 * magic cursor, dynamic typewriter, filterable portfolio and modal popups.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 400);
  }

  // Section Switching (SPA Navigation)
  const navLinks = document.querySelectorAll('.nav-link, .menu-link, .action-link');
  const sections = document.querySelectorAll('.tm_section');
  const mobileMenu = document.querySelector('.tm_mobile_menu');
  const hamburger = document.querySelector('.hamburger');

  function activateSection(targetId) {
    const cleanId = targetId.replace('#', '');
    const targetSection = document.getElementById(cleanId);
    if (!targetSection) return;

    // Update Nav Active States
    document.querySelectorAll('.nav-item').forEach(item => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === `#${cleanId}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Sections
    sections.forEach(sec => {
      if (sec.id === cleanId) {
        sec.classList.remove('hidden');
        sec.classList.add('animated', 'fadeInUp');
        sec.scrollTop = 0;
      } else {
        sec.classList.add('hidden');
        sec.classList.remove('animated', 'fadeInUp');
      }
    });

    // Close mobile menu if open
    if (mobileMenu && mobileMenu.classList.contains('opened')) {
      mobileMenu.classList.remove('opened');
      if (hamburger) hamburger.classList.remove('is-active');
    }

    // Update URL hash without jumping
    history.pushState(null, null, `#${cleanId}`);
  }

  // Handle all navigation clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        activateSection(href);
      }
    });
  });

  // Handle direct initial hash or default to home
  if (window.location.hash) {
    activateSection(window.location.hash);
  } else {
    activateSection('#home');
  }

  // Mobile Menu Hamburger Toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      mobileMenu.classList.toggle('opened');
    });
  }

  // Magic Cursor
  const cursorInner = document.querySelector('.cursor-inner');
  const cursorOuter = document.querySelector('.cursor-outer');

  if (cursorInner && cursorOuter && window.innerWidth > 1040) {
    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;

    cursorInner.style.visibility = 'visible';
    cursorOuter.style.visibility = 'visible';

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorInner.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function loopOuterCursor() {
      outerX += (mouseX - outerX) * 0.15;
      outerY += (mouseY - outerY) * 0.15;
      cursorOuter.style.transform = `translate3d(${outerX}px, ${outerY}px, 0)`;
      requestAnimationFrame(loopOuterCursor);
    }
    requestAnimationFrame(loopOuterCursor);

    // Hover effect on interactable elements
    const hoverables = document.querySelectorAll('a, button, .clickable, input, textarea, .project-card, .service-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorInner.classList.add('cursor-hover');
        cursorOuter.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorInner.classList.remove('cursor-hover');
        cursorOuter.classList.remove('cursor-hover');
      });
    });
  }

  // Rotating Typewriter Words Effect
  const wordsWrapper = document.querySelector('.cd-words-wrapper');
  if (wordsWrapper) {
    const words = wordsWrapper.querySelectorAll('b');
    let currentIndex = 0;

    setInterval(() => {
      words[currentIndex].classList.remove('is-visible');
      words[currentIndex].classList.add('is-hidden');

      currentIndex = (currentIndex + 1) % words.length;

      words[currentIndex].classList.remove('is-hidden');
      words[currentIndex].classList.add('is-visible');
    }, 2800);
  }

  // Portfolio Category Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          card.classList.add('animated', 'fadeIn');
        } else {
          card.style.display = 'none';
          card.classList.remove('animated', 'fadeIn');
        }
      });
    });
  });

  // Modal Management (About & Projects)
  const modalBox = document.querySelector('.tm_modalbox');
  const modalClose = document.querySelectorAll('.modal-close, .modal-backdrop');
  const aboutPopupTrigger = document.querySelector('.about-popup-trigger');

  function openModal(contentHtml) {
    if (!modalBox) return;
    const modalContent = modalBox.querySelector('.modal-content-area');
    if (modalContent) modalContent.innerHTML = contentHtml;
    modalBox.classList.add('opened');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBox) return;
    modalBox.classList.remove('opened');
    document.body.style.overflow = '';
  }

  modalClose.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // About Modal Trigger
  if (aboutPopupTrigger) {
    aboutPopupTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const aboutTemplate = document.getElementById('about-modal-template');
      if (aboutTemplate) {
        openModal(aboutTemplate.innerHTML);
      }
    });
  }

  // Project Modal Triggers
  document.querySelectorAll('.project-modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const card = trigger.closest('.project-card');
      if (!card) return;

      const title = card.getAttribute('data-title') || 'Projeto';
      const category = card.getAttribute('data-category-name') || 'Desenvolvimento';
      const image = card.getAttribute('data-image') || '';
      const desc = card.getAttribute('data-desc') || '';
      const tags = (card.getAttribute('data-tags') || '').split(',').map(t => `<span class="badge-tag">${t.trim()}</span>`).join('');
      const githubUrl = card.getAttribute('data-github') || '';
      const demoUrl = card.getAttribute('data-demo') || '';

      const content = `
        <div class="project_popup_details">
          <div class="top_image">
            <img src="${image}" alt="${title}" />
          </div>
          <div class="details_content">
            <span class="category_pill">${category}</span>
            <h3 class="popup_title">${title}</h3>
            <p class="popup_desc">${desc}</p>
            <div class="tags_wrap">${tags}</div>
            <div class="popup_buttons">
              ${githubUrl ? `<a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Ver no GitHub</a>` : ''}
              ${demoUrl ? `<a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Abrir Demonstração</a>` : ''}
            </div>
          </div>
        </div>
      `;
      openModal(content);
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById('contact_form');
  const returnMessage = document.querySelector('.return-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Por favor, preencha todos os campos do formulário.');
        return;
      }

      // Show success notification
      if (returnMessage) {
        returnMessage.style.display = 'block';
        returnMessage.innerHTML = '<span>Mensagem recebida com sucesso! Abrindo o WhatsApp para envio imediato...</span>';
      }

      // Format WhatsApp redirect
      const whatsappNumber = '5574998000519'; // Or user preferred contact
      const text = encodeURIComponent(`Olá João Vitor! Meu nome é ${name} (${email}).\n\nMensagem: ${message}`);
      
      setTimeout(() => {
        window.open(`https://wa.me/5574998000519?text=${text}`, '_blank');
        contactForm.reset();
      }, 1200);
    });
  }

  // Ambient Waves Canvas Animation
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Soft ambient radial glow
      const grad = ctx.createRadialGradient(width * 0.3, height * 0.3, 50, width * 0.3, height * 0.3, width * 0.7);
      grad.addColorStop(0, 'rgba(47, 211, 233, 0.04)');
      grad.addColorStop(1, 'rgba(10, 13, 20, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Floating particles
      ctx.fillStyle = '#2fd3e9';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }
});
