

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initPageTransitions();
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
 * 0A. Glassy Branded Loading Screen Controller (Initial Open & Browser Refresh)
 *     - Appears when the website is opened for the first time OR refreshed/reloaded
 *     - Skipped during internal page-to-page navigation so internal switches never show the loader
 */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // If marked as an internal fallback navigation, hide loader immediately without animation
  if (document.documentElement.classList.contains('pf-skip-loader')) {
    loader.classList.add('is-loaded');
    return;
  }

  const progressFill = document.getElementById('loader-progress-fill');
  const percentEl = document.getElementById('loader-percent');
  const statusEl = document.getElementById('loader-status-text');

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    if (progressFill) progressFill.style.width = '100%';
    if (percentEl) percentEl.textContent = '100%';
    loader.classList.add('is-loaded');
    return;
  }

  let finished = false;
  const totalDurationMs = 1350;
  const startTime = performance.now();

  const getStatusForPercent = (pct) => {
    if (pct < 36) return 'Initializing Career Pathways...';
    if (pct < 74) return 'Loading Roadmaps & Resources...';
    if (pct < 100) return 'Preparing Glassmorphic Interface...';
    return 'Ready';
  };

  const updateBar = (pct) => {
    const clamped = Math.max(0, Math.min(100, Math.round(pct)));
    if (progressFill) progressFill.style.width = `${clamped}%`;
    if (percentEl) percentEl.textContent = `${clamped}%`;
    if (statusEl) statusEl.textContent = getStatusForPercent(clamped);
  };

  const completeLoader = () => {
    if (finished) return;
    finished = true;
    updateBar(100);

    setTimeout(() => {
      loader.classList.add('is-loaded');
      const mainEl = document.querySelector('main#main-content');
      if (mainEl) {
        mainEl.classList.add('pf-transition-enter');
        setTimeout(() => {
          mainEl.classList.remove('pf-transition-enter', 'pf-entering');
        }, 260);
      }
    }, 180);
  };

  const tick = (now) => {
    if (finished) return;
    const elapsed = now - startTime;
    const rawProgress = Math.min(1, elapsed / totalDurationMs);
    // Smooth ease-in-out progression curve from 0% to 100%
    const easedProgress =
      rawProgress < 0.5
        ? 2 * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
    const currentPct = Math.round(easedProgress * 100);
    updateBar(currentPct);

    if (rawProgress < 1) {
      requestAnimationFrame(tick);
    } else {
      completeLoader();
    }
  };

  updateBar(0);
  requestAnimationFrame(tick);

  // Strict fail-safe so the loader can never remain stuck if tab is backgrounded
  setTimeout(completeLoader, totalDurationMs + 350);
}

/**
 * Helper to re-initialize all page-specific interactive modules after internal <main> swap
 */
function reinitCurrentPageContent() {
  initScrollReveal();
  initMetricCounters();
  highlightActiveNavLink();
  updateMobileBottomDockActiveState();
  updateFooterYear();
  initStandaloneAccordions();

  if (typeof window.initCareerFilters === 'function') {
    window.initCareerFilters();
  }
  if (typeof window.initCareerDetailsNavigation === 'function') {
    window.initCareerDetailsNavigation();
  }
  if (typeof window.initCareerQuiz === 'function') {
    window.initCareerQuiz();
  }
  if (typeof window.initRoadmapsPage === 'function') {
    window.initRoadmapsPage();
  }
  if (typeof window.initResourcesFilter === 'function') {
    window.initResourcesFilter();
  }
}

function updateMobileBottomDockActiveState() {
  const dock = document.getElementById('mobile-bottom-dock');
  if (!dock) return;
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const dockLinks = dock.querySelectorAll('.mobile-dock-item');
  dockLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const isActive =
      href === currentPath ||
      (currentPath === '' && href === 'index.html') ||
      (currentPath === 'career-details.html' && href === 'careers.html');
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 0B. Smooth Water-Like Internal Page-to-Page Transition Controller
 *     - Keeps top <header class="site-header"> and #mobile-bottom-dock 100% persistent
 *       so nothing in the top dashboard/navbar ever refreshes on page switch
 *     - Never triggers #page-loader during internal navigation
 *     - Smoothly blurs/fades <main id="main-content"> out and in without blank screens
 *     - Supports browser Back/Forward (popstate), query parameters, and #hash deep links
 */
function initPageTransitions() {
  if (window.__pfTransitionsInitialized) return;
  window.__pfTransitionsInitialized = true;

  const pageHtmlCache = new Map();
  const inFlightFetches = new Map();
  let activeNavToken = 0;

  const normalizeCacheKey = (urlObj) => {
    let pathname = urlObj.pathname;
    if (pathname.endsWith('/')) {
      pathname += 'index.html';
    }
    return urlObj.origin + pathname;
  };

  const fetchAndCachePage = async (urlObj) => {
    const key = normalizeCacheKey(urlObj);
    if (pageHtmlCache.has(key)) {
      return pageHtmlCache.get(key);
    }
    if (inFlightFetches.has(key)) {
      return inFlightFetches.get(key);
    }
    const fetchPromise = fetch(urlObj.href, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      })
      .then((htmlText) => {
        pageHtmlCache.set(key, htmlText);
        inFlightFetches.delete(key);
        return htmlText;
      })
      .catch((err) => {
        inFlightFetches.delete(key);
        throw err;
      });

    inFlightFetches.set(key, fetchPromise);
    return fetchPromise;
  };

  // Seed cache with current page and pre-warm core internal pages after initial load
  try {
    const currentUrl = new URL(window.location.href);
    pageHtmlCache.set(normalizeCacheKey(currentUrl), document.documentElement.outerHTML);
    setTimeout(() => {
      const pages = [
        'index.html',
        'careers.html',
        'career-details.html',
        'quiz.html',
        'roadmaps.html',
        'resources.html',
        'contact.html',
      ];
      pages.forEach((p) => {
        try {
          const u = new URL(p, window.location.href);
          fetchAndCachePage(u).catch(() => {});
        } catch (_e) {}
      });
    }, 600);
  } catch (_e) {
    // Ignore
  }

  // Warm cache on hover/touchstart for zero-latency internal transitions
  const prefetchLink = (event) => {
    if (!event.target || typeof event.target.closest !== 'function') return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    const rawHref = (link.getAttribute('href') || '').trim();
    if (
      !rawHref ||
      rawHref.startsWith('#') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('javascript:')
    ) {
      return;
    }
    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      fetchAndCachePage(url).catch(() => {});
    } catch (_e) {
      // Ignore invalid URLs
    }
  };

  document.addEventListener('mouseover', prefetchLink, { passive: true });
  document.addEventListener('touchstart', prefetchLink, { passive: true });

  const waitMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const performInternalNavigation = async (targetUrl, pushHistory = true) => {
    const myToken = ++activeNavToken;
    const mainEl = document.querySelector('main#main-content');
    if (!mainEl) {
      window.location.href = targetUrl.href;
      return;
    }

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Close mobile menu if open without touching the header DOM node
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    closeMobileMenu(navToggle, mainNav);

    // Pre-highlight the target nav item immediately so the header feels responsive
    const targetFile = targetUrl.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav .nav-link').forEach((navLink) => {
      const cleanHref = (navLink.getAttribute('href') || '').split('#')[0].split('?')[0];
      const isMatch =
        cleanHref === targetFile ||
        (targetFile === 'career-details.html' && cleanHref === 'careers.html');
      navLink.classList.toggle('active', isMatch);
      if (isMatch) {
        navLink.setAttribute('aria-current', 'page');
      } else {
        navLink.removeAttribute('aria-current');
      }
    });

    // Start subtle non-blanking blur exit on <main> while fetching HTML in parallel
    mainEl.classList.remove('pf-transition-enter', 'pf-entering');
    if (!prefersReducedMotion) {
      mainEl.classList.add('pf-transition-exit');
    }

    let htmlText;
    try {
      const [fetchedHtml] = await Promise.all([
        fetchAndCachePage(targetUrl),
        prefersReducedMotion ? Promise.resolve() : waitMs(85),
      ]);
      htmlText = fetchedHtml;
    } catch (_err) {
      // Graceful fallback if fetch fails
      try {
        sessionStorage.setItem('pf_internal_nav', '1');
      } catch (_e) {}
      window.location.href = targetUrl.href;
      return;
    }

    if (myToken !== activeNavToken) return;

    const parser = new DOMParser();
    const nextDoc = parser.parseFromString(htmlText, 'text/html');
    const nextMain = nextDoc.querySelector('main#main-content') || nextDoc.querySelector('main');

    if (!nextMain) {
      try {
        sessionStorage.setItem('pf_internal_nav', '1');
      } catch (_e) {}
      window.location.href = targetUrl.href;
      return;
    }

    // Update URL before running page-specific scripts so URLSearchParams & location.hash match
    if (pushHistory && history.pushState) {
      history.pushState({ pfSpa: true, url: targetUrl.href }, '', targetUrl.href);
    }

    // Update document title and meta description without touching <header class="site-header">
    if (nextDoc.title) {
      document.title = nextDoc.title;
    }
    const nextDesc = nextDoc.querySelector('meta[name="description"]')?.getAttribute('content');
    const curDesc = document.querySelector('meta[name="description"]');
    if (nextDesc && curDesc) {
      curDesc.setAttribute('content', nextDesc);
    }

    // Swap <main> content
    mainEl.innerHTML = nextMain.innerHTML;

    // Re-initialize page-specific modules and active nav states
    reinitCurrentPageContent();

    // Scroll to #hash target if specified, otherwise scroll cleanly to top
    if (targetUrl.hash && targetUrl.hash.length > 1) {
      const hashId = targetUrl.hash.substring(1);
      const hashTarget = document.getElementById(hashId);
      if (hashTarget) {
        const headerOffset = getStickyHeaderOffset();
        const targetTop = Math.max(
          0,
          hashTarget.getBoundingClientRect().top + window.pageYOffset - headerOffset
        );
        window.scrollTo({ top: targetTop, behavior: 'auto' });
        const highlightBox = hashTarget.querySelector('.detail-header-card') || hashTarget;
        highlightBox.classList.remove('anchor-target-highlight');
        void highlightBox.offsetWidth;
        highlightBox.classList.add('anchor-target-highlight');
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // Trigger smooth water-like blur/fade entrance on <main>
    mainEl.classList.remove('pf-transition-exit');
    if (!prefersReducedMotion) {
      void mainEl.offsetWidth;
      mainEl.classList.add('pf-transition-enter');
      setTimeout(() => {
        if (myToken === activeNavToken) {
          mainEl.classList.remove('pf-transition-enter');
        }
      }, 250);
    }
  };

  // Expose internal navigation helper for initSmoothScroll / link interception
  window.__pfPerformInternalNavigation = performInternalNavigation;
  window.__pfLastLocationPathAndSearch =
    window.location.pathname + window.location.search;

  // Handle Browser Back / Forward buttons smoothly without refreshing the top header
  window.addEventListener('popstate', () => {
    const currentPathAndSearch = window.location.pathname + window.location.search;
    if (currentPathAndSearch === window.__pfLastLocationPathAndSearch) {
      // Only the #hash changed on the same page
      if (window.location.hash && window.location.hash.length > 1) {
        const targetId = window.location.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          smoothScrollToTarget(targetEl, targetId, false);
        }
      }
      return;
    }
    window.__pfLastLocationPathAndSearch = currentPathAndSearch;
    const targetUrl = new URL(window.location.href);
    performInternalNavigation(targetUrl, false);
  });
}

/**
 * 1. Immediate Card & Section Visibility Engine
 *    - Ensures all cards, panels, and sections remain 100% visible immediately
 *      without setting opacity: 0 or hiding content before scroll
 */
function initScrollReveal() {
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
  elements.forEach((el) => {
    el.classList.remove('scroll-reveal');
    el.classList.add('is-revealed');
  });
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
      navigator.serviceWorker
        .register('sw.js')
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {
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
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (!event.target || typeof event.target.closest !== 'function') return;
    const link = event.target.closest('a[href]');
    if (!link) return;

    if (link.hasAttribute('download') || (link.target && link.target !== '_self')) {
      return;
    }

    const rawHref = (link.getAttribute('href') || '').trim();
    if (
      !rawHref ||
      rawHref.startsWith('http') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('javascript:')
    ) {
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

    // 2. Relative internal page link (with or without ?query or #hash)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
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
      return;
    }

    // 3. Internal navigation to another page (keep top header persistent & run smooth blur transition on <main>)
    try {
      const targetUrl = new URL(link.href, window.location.href);
      if (targetUrl.origin === window.location.origin) {
        event.preventDefault();
        window.__pfLastLocationPathAndSearch = targetUrl.pathname + targetUrl.search;
        if (typeof window.__pfPerformInternalNavigation === 'function') {
          window.__pfPerformInternalNavigation(targetUrl, true);
        } else {
          window.location.href = targetUrl.href;
        }
      }
    } catch (_err) {
      // Fall back to default browser navigation if URL fails to parse
    }
  });

  // 4. Smooth scroll to #hash target when arriving on initial page load
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
