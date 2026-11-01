/**
 * ============================================================================
 * PathFinder LK - Global Main Script (main.js)
 * ============================================================================
 * Description: Handles global UI logic across all pages, including:
 *              0. Glassy Branded Loading Screen Controller (Extended ~1.6s Delay)
 *              1. Smooth Scroll-Reveal Card Transition Engine (IntersectionObserver)
 *              2. Dark / Light Theme System (localStorage + OS preference)
 *              3. Mobile Hamburger Drawer + Native-Style Mobile Bottom Nav Dock
 *              4. PWA Service Worker Registration & In-App Mobile Install Flow
 *              5. Active Navigation Link Highlighting
 *              6. Smooth Scrolling for Anchor Links
 *              7. Dynamic Copyright Year Update in Footer
 *              8. Standalone FAQ Accordion Controller
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initScrollReveal();
  initThemeToggle();
  initMobileNav();
  initMobileBottomDock();
  initPWACapability();
  highlightActiveNavLink();
  initSmoothScroll();
  updateFooterYear();
  initStandaloneAccordions();
});

/**
 * 0. Glassy Branded Loading Screen Controller
 * Displays a smooth, clearly visible glassmorphic loading screen (~1.6s) with
 * live percentage counter and status updates on initial entry and page navigation.
 */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const fillEl = loader.querySelector('.loader-bar-fill');
  const percentEl = loader.querySelector('.loader-percent');
  const subtextEl = loader.querySelector('.loader-subtext');

  const statusMessages = [
    'Initializing Career Guidance Platform...',
    'Loading 15 Career Pathways & Roadmaps...',
    'Preparing Glassmorphic Interface...',
    'Ready to Explore!'
  ];

  let progress = 8;
  if (fillEl) fillEl.style.width = `${progress}%`;
  if (percentEl) percentEl.textContent = `${progress}%`;

  const interval = setInterval(() => {
    progress = Math.min(96, progress + Math.floor(Math.random() * 9) + 6);
    if (fillEl) fillEl.style.width = `${progress}%`;
    if (percentEl) percentEl.textContent = `${progress}%`;
    if (subtextEl) {
      if (progress < 35) subtextEl.textContent = statusMessages[0];
      else if (progress < 70) subtextEl.textContent = statusMessages[1];
      else subtextEl.textContent = statusMessages[2];
    }
  }, 115);

  const dismissLoader = () => {
    clearInterval(interval);
    if (fillEl) fillEl.style.width = '100%';
    if (percentEl) percentEl.textContent = '100%';
    if (subtextEl) subtextEl.textContent = statusMessages[3];

    setTimeout(() => {
      loader.classList.add('is-hidden');
      loader.setAttribute('aria-busy', 'false');
    }, 240);
  };

  // Deliberate ~1.45s loading sequence + 240ms completion hold (~1.7s total)
  setTimeout(dismissLoader, 1450);

  // Brief glassy loading transition when clicking internal navigation links
  const internalLinks = document.querySelectorAll(
    'a[href$=".html"], a[href*=".html?"], a[href*=".html#"]'
  );
  internalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (
        !href ||
        link.target === '_blank' ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const targetPage = href.split('#')[0].split('?')[0];
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      if (targetPage === currentPage && href.includes('#')) {
        return; // Same-page hash scroll, do not show full-page loader
      }

      event.preventDefault();
      if (fillEl) fillEl.style.width = '35%';
      if (percentEl) percentEl.textContent = '35%';
      if (subtextEl) subtextEl.textContent = 'Loading Next Page...';
      loader.classList.remove('is-hidden');
      loader.setAttribute('aria-busy', 'true');

      setTimeout(() => {
        if (fillEl) fillEl.style.width = '90%';
        if (percentEl) percentEl.textContent = '90%';
      }, 220);

      setTimeout(() => {
        window.location.href = href;
      }, 480);
    });
  });
}

/**
 * 1. Smooth Scroll-Reveal Card Transition Engine
 * Animates cards, panels, headers, and banners smoothly into view as the user scrolls.
 */
function initScrollReveal() {
  const revealSelectors = [
    '.card',
    '.category-preview-card',
    '.hero-metric-item',
    '.hero-illustration-wrapper',
    '.detail-header-card',
    '.detail-panel',
    '.accordion-item',
    '.quiz-question-card',
    '.contact-channel-card',
    '.section-header',
    '.cta-banner',
    '.comparison-table-wrapper'
  ];

  const elements = document.querySelectorAll(revealSelectors.join(', '));
  if (elements.length === 0) return;

  elements.forEach((el, idx) => {
    el.classList.add('scroll-reveal');
    // Stagger siblings within the same grid row
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const siblingIndex = siblings.indexOf(el);
      const delayMs = (siblingIndex % 4) * 75;
      el.style.setProperty('--reveal-delay', `${delayMs}ms`);
    } else {
      el.style.setProperty('--reveal-delay', `${(idx % 3) * 70}ms`);
    }
  });

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -28px 0px',
      threshold: 0.08,
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/**
 * 2. Dark / Light Theme System
 * Synchronizes the theme toggle button with the current document [data-theme]
 * attribute, updates mobile browser theme-color meta tag, and persists in localStorage.
 */
function initThemeToggle() {
  const STORAGE_KEY = 'pathfinder-theme';
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  const getPreferredTheme = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch (err) {
      // Fallback if localStorage is restricted
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#050a15' : '#f0f7ff');
    }

    if (toggleBtn) {
      const isDark = theme === 'dark';
      toggleBtn.setAttribute('aria-pressed', String(isDark));
      toggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light theme' : 'Switch to dark theme'
      );
      toggleBtn.setAttribute(
        'title',
        isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'
      );
      const labelEl = toggleBtn.querySelector('.theme-label');
      if (labelEl) {
        labelEl.textContent = isDark ? 'Light' : 'Dark';
      }
    }
  };

  applyTheme(getPreferredTheme());

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch (err) {
        // Ignore storage errors
      }
    });
  }
}

/**
 * 3. Mobile Navigation Menu Toggle
 * Controls the hamburger button and responsive glassy slide-down menu on screens <= 768px.
 */
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    mainNav.classList.toggle('is-open');
    document.body.classList.toggle('mobile-menu-open', !isExpanded);

    const iconSpan = navToggle.querySelector('.nav-toggle-icon');
    if (iconSpan) {
      iconSpan.innerHTML = !isExpanded ? '&#10005;' : '&#9776;';
    }
  });

  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu(navToggle, mainNav);
    });
  });

  document.addEventListener('click', (event) => {
    if (
      mainNav.classList.contains('is-open') &&
      !mainNav.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeMobileMenu(navToggle, mainNav);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
      closeMobileMenu(navToggle, mainNav);
      navToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav.classList.contains('is-open')) {
      closeMobileMenu(navToggle, mainNav);
    }
  });
}

function closeMobileMenu(toggleBtn, navMenu) {
  toggleBtn.setAttribute('aria-expanded', 'false');
  navMenu.classList.remove('is-open');
  document.body.classList.remove('mobile-menu-open');
  const iconSpan = toggleBtn.querySelector('.nav-toggle-icon');
  if (iconSpan) {
    iconSpan.innerHTML = '&#9776;';
  }
}

/**
 * 4. Native-Style Glassy Mobile Bottom Navigation Dock
 * Enhances mobile usability (< 768px) with one-thumb access to all core platform views.
 */
function initMobileBottomDock() {
  if (document.getElementById('mobile-bottom-dock')) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const dock = document.createElement('nav');
  dock.id = 'mobile-bottom-dock';
  dock.className = 'mobile-bottom-dock';
  dock.setAttribute('aria-label', 'Mobile Quick Navigation');

  const items = [
    { href: 'index.html', label: 'Home', icon: '&#127968;', match: ['index.html', ''] },
    { href: 'careers.html', label: 'Careers', icon: '&#128188;', match: ['careers.html', 'career-details.html'] },
    { href: 'quiz.html', label: 'Quiz', icon: '&#129517;', match: ['quiz.html'] },
    { href: 'roadmaps.html', label: 'Roadmaps', icon: '&#128506;&#65039;', match: ['roadmaps.html'] },
    { href: 'resources.html', label: 'Resources', icon: '&#128218;', match: ['resources.html'] },
  ];

  dock.innerHTML = items
    .map((item) => {
      const isActive = item.match.includes(currentPath);
      return `
        <a href="${item.href}" class="mobile-dock-item ${isActive ? 'active' : ''}" ${
        isActive ? 'aria-current="page"' : ''
      }>
          <span class="mobile-dock-icon" aria-hidden="true">${item.icon}</span>
          <span class="mobile-dock-label">${item.label}</span>
        </a>
      `;
    })
    .join('');

  document.body.appendChild(dock);
}

/**
 * 5. PWA Service Worker & Mobile App Install Capability
 */
function initPWACapability() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Ignore service worker registration errors in restricted frames
      });
    });
  }

  let deferredPrompt = null;
  const headerActions = document.querySelector('.header-actions');

  let installBtn = document.getElementById('pwa-install-btn');
  if (!installBtn && headerActions) {
    installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.type = 'button';
    installBtn.className = 'pwa-install-btn hidden';
    installBtn.setAttribute('aria-label', 'Install PathFinder LK Mobile App');
    installBtn.setAttribute('title', 'Install PathFinder LK on your device');
    installBtn.innerHTML = `<span aria-hidden="true">&#128241;</span> <span class="install-label">Install App</span>`;
    headerActions.insertBefore(installBtn, headerActions.firstChild);
  }

  const isStandalone =
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true;

  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  if (!isStandalone && isIOS && installBtn) {
    installBtn.classList.remove('hidden');
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!isStandalone && installBtn) {
      installBtn.classList.remove('hidden');
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installBtn) {
      installBtn.classList.add('hidden');
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          installBtn.classList.add('hidden');
        }
        deferredPrompt = null;
      } else if (isIOS) {
        showIOSInstallModal();
      }
    });
  }
}

function showIOSInstallModal() {
  let modal = document.getElementById('ios-install-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'ios-install-modal';
    modal.className = 'glass-modal-backdrop';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="glass-modal-card">
        <h3>Install PathFinder LK on iOS</h3>
        <p>Add PathFinder LK to your iPhone or iPad Home Screen for fast, full-screen mobile access:</p>
        <ol class="detail-list" style="margin-bottom: 1.25rem; text-align: left;">
          <li>Tap the <strong>Share</strong> button in your Safari toolbar.</li>
          <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
        </ol>
        <button type="button" class="btn btn-primary btn-block" id="close-ios-modal">Got It</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.id === 'close-ios-modal') {
        modal.classList.add('hidden');
      }
    });
  } else {
    modal.classList.remove('hidden');
  }
}

/**
 * 6. Active Navigation Link Highlighting
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.main-nav .nav-link');

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute('href');
    if (!linkHref) return;

    const cleanHref = linkHref.split('#')[0].split('?')[0];

    if (
      cleanHref === currentPath ||
      (currentPath === 'career-details.html' && cleanHref === 'careers.html')
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 7. Smooth Scrolling for In-Page Anchor Links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  const headerOffset = 88;

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        event.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
}

/**
 * 8. Dynamic Footer Copyright Year
 */
function updateFooterYear() {
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();

  yearElements.forEach((el) => {
    el.textContent = currentYear;
  });
}

/**
 * 9. Standalone Accordion Controller
 */
function initStandaloneAccordions() {
  if (document.querySelector('.roadmap-pane')) return;

  const accordionHeaders = document.querySelectorAll('.accordion-header');
  if (accordionHeaders.length === 0) return;

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const parentItem = header.closest('.accordion-item');
      if (!parentItem) return;

      const isCurrentlyOpen = parentItem.classList.contains('is-open');
      if (isCurrentlyOpen) {
        parentItem.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
      } else {
        parentItem.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
