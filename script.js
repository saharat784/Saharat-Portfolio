/**
 * Portfolio & Online Resume - Interactive Script
 * Saharat Wiangkaew (Software Developer)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Switcher (Dark / Light Mode) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check persisted preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  setTheme(currentTheme);
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        // Sun icon for switching back to light
        themeIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
        themeToggleBtn.setAttribute('title', 'สลับเป็นโหมดสว่าง');
      } else {
        // Moon icon for switching to dark
        themeIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
        themeToggleBtn.setAttribute('title', 'สลับเป็นโหมดมืด');
      }
    }
  }

  // --- 2. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });
    
    // Close menu when clicking navigation link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 3. Scrollspy / Active Navigation Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });
    
    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 4. Print / Save PDF Handler ---
  const printButtons = document.querySelectorAll('.btn-print-cv');
  printButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });

  // --- 5. Copy Email to Clipboard & Toast ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'saharath.wk@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = email;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showToast('คัดลอกอีเมล ' + email + ' เรียบร้อยแล้ว!');
      } catch (err) {
        showToast('อีเมล: ' + email);
      }
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --- 6. Image Modal Lightbox for Project Screenshots ---
  const imageModal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (imageModal && modalImg && modalClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-img');
        const captionText = item.getAttribute('data-caption');
        modalImg.src = imgSrc;
        modalImg.alt = captionText;
        if (modalCaption) modalCaption.textContent = captionText;
        imageModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    modalClose.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && imageModal.classList.contains('open')) {
        closeModal();
      }
    });

    function closeModal() {
      imageModal.classList.remove('open');
      document.body.style.overflow = '';
      modalImg.src = '';
    }
  }
});
