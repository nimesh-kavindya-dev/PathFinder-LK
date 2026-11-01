/**
 * ============================================================================
 * PathFinder LK - Global Main Script (main.js)
 * ============================================================================
 * Description: Handles global UI logic across all pages, including:
 *              0. Glassy Branded Loading Screen Controller (Single-Run per Page)
 *              1. Smooth Scroll-Reveal Card Transition Engine & Metric Counters
 *              2. Dark / Light Theme System (localStorage + OS preference)
 *              3. Mobile Hamburger Drawer + Native-Style Mobile Bottom Nav Dock
 *              4. PWA Service Worker Registration & In-App Mobile Install Flow
 *              5. Active Navigation Link Highlighting
 *              6. Universal Smooth Scrolling (In-Page, Header, Footer & Hash Links)
 *              7. Dynamic Copyright Year Update in Footer
 *              8. Standalone FAQ Accordion Controller
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initScrollReveal();
  initMetricCounters();
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
 * 0. Glassy Branded Loading Screen Controller (Single-Run Guarantee)
 * Runs once when a page loads (~1.5s smooth progress to 100%) and never
 * triggers a duplicate pre-navigation loader on the outgoing page.
 */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Prevent duplicate execution if initPageLoader is ever invoked more than once
  if (loader.dataset.loaderInitialized === 'true') return;
  loader.dataset.loaderInitialized = 'true';

  const fillEl = loader.querySelector('.loader-bar-fill');
  const percentEl = loader.querySelector('.loader-percent');
  const subtextEl = loader.querySelector('.loader-subtext');

  const statusMessages = [
    'Initializing Career Guidance Platform...',
    'Loading 15 Career Pathways & Roadmaps...',
    'Preparing Glassmorphic Interface...',
    'Ready to Explore!'
  ];

  let progress = 12;
  if (fillEl) fillEl.style.width = `${progress}%`;
  if (percentEl) percentEl.textContent = `${progress}%`;

  const interval = setInterval(() => {
    progress = Math.min(96, progress + Math.floor(Math.random() * 10) + 7);
    if (fillEl) fillEl.style.width = `${progress}%`;
    if (percentEl) percentEl.textContent = `${progress}%`;
    if (subtextEl) {
      if (progress < 38) subtextEl.textContent = statusMessages[0];
      else if (progress < 72) subtextEl.textContent = statusMessages[1];
      else subtextEl.textContent = statusMessages[2];
    }
  }, 110);

  let isDismissed = false;
  const dismissLoader = () => {
    if (isDismissed) return;
    isDismissed = true;
    clearInterval(interval);
    if (fillEl) fillEl.style.width = '100%';
    if (percentEl) percentEl.textContent = '100%';
    if (subtextEl) subtextEl.textContent = statusMessages[3];

    setTimeout(() => {
      loader.classList.add('is-hidden');
      loader.setAttribute('aria-busy', 'false');
    }, 220);
  };

  // Single smooth ~1.35s loading sequence + 220ms completion fade (~1.57s total)
  setTimeout(dismissLoader, 1350);

  // Ensure Back/Forward browser cache restoration never leaves the loader visible
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      dismissLoader();
    }
  });
}

/**
 * 1. Smooth Scroll-Reveal Card Transition Engine
 * Animates hero columns, cards, panels, headers, and banners smoothly into view
 * as the user scrolls down the page.
 */
function initScrollReveal() {
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual');

  if (heroContent) {
    heroContent.classList.add('scroll-reveal', 'scroll-reveal-left');
    heroContent.style.setProperty('--reveal-delay', '60ms');
  }
  if (heroVisual) {
    heroVisual.classList.add('scroll-reveal', 'scroll-reveal-right');
    heroVisual.style.setProperty('--reveal-delay', '140ms');
  }

  const revealSelectors = [
    '.card',
    '.category-preview-card',
    '.hero-metric-item',
    '.detail-header-card',
    '.detail-panel',
    '.detail-subcard',
    '.accordion-item',
    '.quiz-question-card',
    '.contact-channel-card',
    '.section-header',
    '.cta-banner',
    '.comparison-table-wrapper',
    '.filter-bar'
  ];

  const elements = document.querySelectorAll(revealSelectors.join(', '));
  const allRevealTargets = [
    ...(heroContent ? [heroContent] : []),
    ...(heroVisual ? [heroVisual] : []),
    ...Array.from(elements)
  ];

  if (allRevealTargets.length === 0) return;

  elements.forEach((el, idx) => {
    el.classList.add('scroll-reveal');
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter((child) =>
        child.classList.contains('scroll-reveal') || child === el
      );
      const siblingIndex = Math.max(0, siblings.indexOf(el));
      const delayMs = (siblingIndex % 4) * 80;
      el.style.setProperty('--reveal-delay', `${delayMs}ms`);
    } else {
      el.style.setProperty('--reveal-delay', `${(idx % 3) * 75}ms`);
    }
  });

  if (!('IntersectionObserver' in window)) {
    allRevealTargets.forEach((el) => el.classList.add('is-revealed'));
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
      rootMargin: '0px 0px -24px 0px',
      threshold: 0.06,
    }
  );

  allRevealTargets.forEach((el) => observer.observe(el));
}

/**
 * 1B. Animated Metric Counters on Homepage Hero Strip
 */
function initMetricCounters() {
  const metricValues = document.querySelectorAll('.hero-metric-value');
  if (metricValues.length === 0 || !('IntersectionObserver' in window)) return;

  const animateValue = (el) => {
    if (el.dataset.counted === 'true') return;
    const rawText = el.textContent.trim();
    const match = rawText.match(/^(\d+)(.*)$/);
    if (!match) return;

    el.dataset.counted = 'true';
    const targetNum = parseInt(match[1], 10);
    const suffix = match[2] || '';
    const duration = 1100;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetNum * eased);
      el.textContent = `${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = rawText;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  metricValues.forEach((el) => observer.observe(el));
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
  if (!toggleBtn || !navMenu) return;
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
 * 7. Universal Smooth Scrolling for All Anchor, Header & Footer Links
 * Handles:
 * - In-page hash links (href="#section")
 * - Same-page links with hashes (e.g., footer links career-details.html#data-analyst while on career-details.html)
 * - Header, brand logo, mobile dock & footer links pointing to the current page (smoothly scrolls to top instead of reloading)
 * - Cross-page hash arrival on initial page load
 */
function getStickyHeaderOffset() {
  const header = document.querySelector('.site-header');
  const roleSwitcher = document.querySelector('.role-switcher-bar');
  let offset = 18;
  if (header) {
    offset += header.getBoundingClientRect().height;
  }
  if (roleSwitcher) {
    offset += roleSwitcher.getBoundingClientRect().height;
  }
  return offset;
}

function smoothScrollToTarget(targetElement, hashId, updateHistory = true) {
  if (!targetElement) return;

  const headerOffset = getStickyHeaderOffset();
  const elementPosition = targetElement.getBoundingClientRect().top;
  const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);

  // Reveal all .scroll-reveal elements up to and inside the target so nothing flashes blank during smooth scroll
  const targetBottom = offsetPosition + window.innerHeight;
  document.querySelectorAll('.scroll-reveal:not(.is-revealed)').forEach((el) => {
    const elTop = el.getBoundingClientRect().top + window.pageYOffset;
    if (elTop <= targetBottom) {
      el.classList.add('is-revealed');
    }
  });

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });

  // Ensure target and any reveal children inside it are revealed immediately
  targetElement.classList.add('is-revealed');
  targetElement.querySelectorAll('.scroll-reveal').forEach((el) => el.classList.add('is-revealed'));

  // Brief visual highlight on the target card/section
  const highlightBox = targetElement.querySelector('.detail-header-card') || targetElement;
  highlightBox.classList.remove('anchor-target-highlight');
  void highlightBox.offsetWidth;
  highlightBox.classList.add('anchor-target-highlight');

  if (updateHistory && hashId && history.pushState) {
    history.pushState(null, null, `#${hashId}`);
  }
}

function initSmoothScroll() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    if (
      link.target === '_blank' ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('http') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      return;
    }

    // 1. Pure hash link on the current page (e.g. href="#compare-careers" or href="#")
    if (rawHref.startsWith('#')) {
      if (rawHref === '#' || rawHref === '#top') {
        event.preventDefault();
        closeMobileMenu(navToggle, mainNav);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetId = rawHref.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        event.preventDefault();
        closeMobileMenu(navToggle, mainNav);
        smoothScrollToTarget(targetElement, targetId, true);
      }
      return;
    }

    // 2. Relative page link (with or without #hash)
    const [pathAndQuery, hashPart] = rawHref.split('#');
    const [pathOnly, queryPart] = pathAndQuery.split('?');
    const normalizedTargetPage = pathOnly || currentPage;

    // If link points to the exact page we are already viewing (and has no different query string)
    const currentQuery = window.location.search.replace(/^\?/, '');
    if (normalizedTargetPage === currentPage && (queryPart || '') === currentQuery) {
      if (hashPart) {
        const targetElement = document.getElementById(hashPart);
        if (targetElement) {
          event.preventDefault();
          closeMobileMenu(navToggle, mainNav);
          smoothScrollToTarget(targetElement, hashPart, true);
        }
      } else {
        // Clicking active header/footer/logo/dock link for the current page -> smooth scroll to top
        event.preventDefault();
        closeMobileMenu(navToggle, mainNav);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.location.hash && history.pushState) {
          history.pushState(null, null, window.location.pathname + window.location.search);
        }
      }
    }
  });

  // 3. Smooth scroll to #hash target when arriving from another page
  if (window.location.hash && window.location.hash.length > 1) {
    const initialHashId = window.location.hash.substring(1);
    const targetElement = document.getElementById(initialHashId);
    if (targetElement) {
      setTimeout(() => {
        smoothScrollToTarget(targetElement, initialHashId, false);
      }, 180);
    }
  }
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
