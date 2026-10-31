/**
 * PathFinder LK - Roadmaps Interactive Script
 * Course: IS 1106 - Foundations of Web Technologies
 * Description: Tab switching between the 5 career roadmaps, URL parameter/hash handling,
 *              accordion expand/collapse, and expand/collapse all functionality.
 */

document.addEventListener('DOMContentLoaded', () => {

  const tabButtons = document.querySelectorAll('.roadmap-tab-btn');
  const roadmapPanes = document.querySelectorAll('.roadmap-pane');
  const expandAllBtn = document.getElementById('expand-all-btn');
  let isAllExpanded = false;

  // Career Key Mapping
  const CAREER_MAP = {
    'software-engineer': 'roadmap-se',
    'se': 'roadmap-se',
    'roadmap-se': 'roadmap-se',
    'data-analyst': 'roadmap-da',
    'da': 'roadmap-da',
    'roadmap-da': 'roadmap-da',
    'data-engineer': 'roadmap-de',
    'de': 'roadmap-de',
    'roadmap-de': 'roadmap-de',
    'cybersecurity': 'roadmap-cs',
    'cs': 'roadmap-cs',
    'roadmap-cs': 'roadmap-cs',
    'ui-ux': 'roadmap-uiux',
    'uiux': 'roadmap-uiux',
    'roadmap-uiux': 'roadmap-uiux'
  };

  /**
   * Switch Active Roadmap Tab
   */
  const switchRoadmap = (targetPaneId) => {
    if (!targetPaneId) return;

    // Normalize pane ID
    const paneId = CAREER_MAP[targetPaneId] || targetPaneId;

    // Update Tab Buttons
    tabButtons.forEach(btn => {
      const controls = btn.getAttribute('aria-controls') || btn.getAttribute('data-target');
      if (controls === paneId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.style.backgroundColor = 'var(--primary-color)';
        btn.style.color = '#ffffff';
        btn.style.borderColor = 'var(--primary-color)';
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.style.backgroundColor = 'var(--bg-page)';
        btn.style.color = 'var(--text-main)';
        btn.style.borderColor = 'var(--border-color)';
      }
    });

    // Update Roadmap Panes visibility
    roadmapPanes.forEach(pane => {
      if (pane.id === paneId) {
        pane.style.display = 'block';
        pane.classList.add('active');
      } else {
        pane.style.display = 'none';
        pane.classList.remove('active');
      }
    });
  };

  // Tab Button Click Listener
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPaneId = btn.getAttribute('aria-controls') || btn.getAttribute('data-target');
      switchRoadmap(targetPaneId);
    });
  });

  // URL Parameter & Hash Check (?career=... or #roadmap-...)
  const urlParams = new URLSearchParams(window.location.search);
  const paramCareer = urlParams.get('career');
  const hashCareer = window.location.hash.replace('#', '');
  const initialTarget = paramCareer || hashCareer;

  if (initialTarget && CAREER_MAP[initialTarget]) {
    switchRoadmap(CAREER_MAP[initialTarget]);
  } else {
    // Default to Software Engineer
    switchRoadmap('roadmap-se');
  }

  /**
   * Accordion Toggle Handler
   */
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      
      const body = header.nextElementSibling;
      const arrow = header.querySelector('.accordion-arrow');

      if (body) {
        if (!isExpanded) {
          body.style.display = 'block';
          if (arrow) arrow.innerHTML = '&#9652;';
        } else {
          body.style.display = 'none';
          if (arrow) arrow.innerHTML = '&#9662;';
        }
      }
    });
  });

  /**
   * Expand / Collapse All Toggle
   */
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      isAllExpanded = !isAllExpanded;
      expandAllBtn.textContent = isAllExpanded ? 'Collapse All Stages' : 'Expand All Stages';

      const activePane = document.querySelector('.roadmap-pane.active') || document;
      const activeHeaders = activePane.querySelectorAll('.accordion-header');

      activeHeaders.forEach(header => {
        header.setAttribute('aria-expanded', isAllExpanded);
        const body = header.nextElementSibling;
        const arrow = header.querySelector('.accordion-arrow');

        if (body) {
          body.style.display = isAllExpanded ? 'block' : 'none';
          if (arrow) arrow.innerHTML = isAllExpanded ? '&#9652;' : '&#9662;';
        }
      });
    });
  }

});
