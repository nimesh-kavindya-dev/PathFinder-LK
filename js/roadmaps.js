/**
 * ============================================================================
 * PathFinder LK - Interactive Learning Roadmaps Script (roadmaps.js)
 * ============================================================================
 * Description: Powers the interactive career roadmap switcher, collapsible
 *              learning stage accordions, expand/collapse all controls, and
 *              URL parameter/hash deep-linking for all 15 career pathways on
 *              roadmaps.html.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initRoadmapsPage();
});

/**
 * Valid career keys mapped to their corresponding roadmap container IDs (15 paths)
 */
const CAREER_MAP = {
  'software-engineer': 'roadmap-se',
  'se': 'roadmap-se',
  'fullstack-developer': 'roadmap-fs',
  'fs': 'roadmap-fs',
  'cloud-devops': 'roadmap-cloud',
  'cloud': 'roadmap-cloud',
  'data-analyst': 'roadmap-da',
  'da': 'roadmap-da',
  'data-engineer': 'roadmap-de',
  'de': 'roadmap-de',
  'data-scientist': 'roadmap-ds',
  'ds': 'roadmap-ds',
  'cybersecurity': 'roadmap-cs',
  'cs': 'roadmap-cs',
  'ui-ux': 'roadmap-uiux',
  'uiux': 'roadmap-uiux',
  'qa-engineer': 'roadmap-qa',
  'qa': 'roadmap-qa',
  'business-analyst': 'roadmap-ba',
  'ba': 'roadmap-ba',
  'product-manager': 'roadmap-pm',
  'pm': 'roadmap-pm',
  'digital-marketing': 'roadmap-dm',
  'dm': 'roadmap-dm',
  'financial-analyst': 'roadmap-fa',
  'fa': 'roadmap-fa',
  'multimedia-designer': 'roadmap-mm',
  'mm': 'roadmap-mm',
  'robotics-iot': 'roadmap-iot',
  'iot': 'roadmap-iot',
};

function initRoadmapsPage() {
  const tabButtons = document.querySelectorAll('.roadmap-tab-btn');
  const roadmapPanes = document.querySelectorAll('.roadmap-pane');
  const expandAllBtn = document.getElementById('expand-all-stages');
  const collapseAllBtn = document.getElementById('collapse-all-stages');

  if (tabButtons.length === 0 || roadmapPanes.length === 0) return;

  const switchRoadmap = (targetPaneId) => {
    tabButtons.forEach((btn) => {
      const btnTarget = btn.getAttribute('data-target');
      const isMatch = btnTarget === targetPaneId;

      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', String(isMatch));
    });

    roadmapPanes.forEach((pane) => {
      if (pane.id === targetPaneId) {
        pane.classList.remove('hidden');
        pane.querySelectorAll('.scroll-reveal').forEach((el) => el.classList.add('is-revealed'));
      } else {
        pane.classList.add('hidden');
      }
    });
  };

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetPaneId = button.getAttribute('data-target');
      if (!targetPaneId) return;

      switchRoadmap(targetPaneId);

      const careerSlug = button.getAttribute('data-career-slug');
      if (careerSlug && history.replaceState) {
        history.replaceState(null, null, `?career=${careerSlug}`);
      }
    });
  });

  const accordionHeaders = document.querySelectorAll('.accordion-header');
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

  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      const activePane = document.querySelector('.roadmap-pane:not(.hidden)');
      if (!activePane) return;

      const items = activePane.querySelectorAll('.accordion-item');
      items.forEach((item) => {
        item.classList.add('is-open');
        const header = item.querySelector('.accordion-header');
        if (header) header.setAttribute('aria-expanded', 'true');
      });
    });
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => {
      const activePane = document.querySelector('.roadmap-pane:not(.hidden)');
      if (!activePane) return;

      const items = activePane.querySelectorAll('.accordion-item');
      items.forEach((item) => {
        item.classList.remove('is-open');
        const header = item.querySelector('.accordion-header');
        if (header) header.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const handleDeepLink = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const careerParam = urlParams.get('career')?.toLowerCase();
    const hashParam = window.location.hash.replace('#', '').toLowerCase();

    const lookupKey = careerParam || hashParam;
    if (lookupKey && CAREER_MAP[lookupKey]) {
      switchRoadmap(CAREER_MAP[lookupKey]);
    } else {
      switchRoadmap('roadmap-se');
    }
  };

  handleDeepLink();
  window.addEventListener('popstate', handleDeepLink);
}
