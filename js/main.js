/**
 * PathFinder LK - Main JavaScript
 * Course: IS 1106 - Foundations of Web Technologies
 * Description: Global interactions, responsive navigation toggle, and active state handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Menu Toggle & Accessibility
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const siteHeader = document.querySelector('.site-header');

  const closeMobileNav = () => {
    if (navToggle && navList && navList.classList.contains('active')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navList.classList.remove('active');
    }
  };

  if (navToggle && navList) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navList.classList.toggle('active');
    });

    // Close mobile menu when clicking any nav link
    const navLinks = navList.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close mobile menu on Escape key press (WCAG Keyboard Accessibility)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('active')) {
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

  // Active Navigation Link Highlighting
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

  // Dynamic Current Year in Footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
