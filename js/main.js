/**
 * PathFinder LK - Main JavaScript
 * Course: IS 1106 - Foundations of Web Technologies
 * Description: Global interactions, Theme Toggle (Dark/Light Mode),
 *              Responsive navigation drawer, and Active state handling.
 */

// Initialize Theme immediately before full load to prevent FOUT (Flash of Unstyled Theme)
(function initTheme() {
  try {
    const savedTheme = localStorage.getItem('pathfinder-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Dark Mode / Light Mode Theme Engine
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');

  const updateThemeAria = (currentTheme) => {
    if (!themeToggle) return;
    const isDark = currentTheme === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  };

  const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeAria(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', activeTheme);
      try {
        localStorage.setItem('pathfinder-theme', activeTheme);
      } catch (e) {
        // Fallback if localStorage is disabled in iframe/sandbox
      }
      updateThemeAria(activeTheme);
    });

    // Listen to OS-level theme changes if user hasn't explicitly set a preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('pathfinder-theme')) {
          const systemTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', systemTheme);
          updateThemeAria(systemTheme);
        }
      });
    }
  }

  /* ==========================================================================
     2. Mobile Navigation Menu Toggle & Accessibility
     ========================================================================== */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('primary-navigation') || document.querySelector('.main-nav');
  const siteHeader = document.querySelector('.site-header');

  const closeMobileNav = () => {
    if (navToggle && mainNav && mainNav.classList.contains('active')) {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('active');
    }
  };

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
    });

    // Close mobile menu when clicking any navigation link
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close mobile menu on Escape key press (WCAG Keyboard Accessibility)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        closeMobileNav();
        navToggle.focus();
      }
    });

    // Close mobile menu when clicking outside header
    document.addEventListener('click', (e) => {
      if (siteHeader && !siteHeader.contains(e.target)) {
        closeMobileNav();
      }
    });
  }

  /* ==========================================================================
     3. Active Navigation Link Highlighting
     ========================================================================== */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    const isExactMatch = linkPath === currentPath || (currentPath === '' && linkPath === 'index.html');
    const isCareerDetails = currentPath === 'career-details.html' && linkPath === 'careers.html';

    if (isExactMatch || isCareerDetails) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  /* ==========================================================================
     4. Dynamic Current Year in Footer
     ========================================================================== */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});
