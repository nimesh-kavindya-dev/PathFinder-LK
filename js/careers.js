/**
 * ============================================================================
 * PathFinder LK - Careers Exploration & Filtering Script (careers.js)
 * ============================================================================
 * Description: Handles interactive search, category pill filtering across all
 *              15 career pathways (IT, Business, Finance, Marketing, Creative,
 *              and Engineering), URL query pre-selection, live result counts,
 *              and career detail role switcher synchronization.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCareerFilters();
  initCareerDetailsNavigation();
});

/**
 * 1. Career Search & Category Filtering (careers.html)
 */
function initCareerFilters() {
  const searchInput = document.getElementById('career-search');
  const filterButtons = document.querySelectorAll('.career-filter-btn');
  const careerCards = document.querySelectorAll('.career-card[data-category]');
  const resultsCountEl = document.getElementById('career-results-count');
  const emptyStateEl = document.getElementById('career-empty-state');
  const resetFilterBtn = document.getElementById('reset-career-filters');
  const clearSearchBtn = document.getElementById('clear-career-search');

  if (careerCards.length === 0) return;

  let activeCategory = 'all';
  let searchQuery = '';

  const setActiveCategoryButton = (category) => {
    filterButtons.forEach((btn) => {
      const btnCat = btn.getAttribute('data-filter') || 'all';
      const isMatch = btnCat === category;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', String(isMatch));
    });
  };

  const filterCards = () => {
    let visibleCount = 0;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    careerCards.forEach((card) => {
      const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
      const cardTitle = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const cardDesc = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
      const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();

      const matchesCategory =
        activeCategory === 'all' || cardCategory.split(/\s+/).includes(activeCategory);

      const matchesSearch =
        normalizedQuery === '' ||
        cardTitle.includes(normalizedQuery) ||
        cardDesc.includes(normalizedQuery) ||
        cardKeywords.includes(normalizedQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        card.classList.add('is-revealed');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (resultsCountEl) {
      const totalCount = careerCards.length;
      if (activeCategory === 'all' && normalizedQuery === '') {
        resultsCountEl.textContent = `Showing all ${totalCount} career pathways`;
      } else {
        resultsCountEl.textContent = `Showing ${visibleCount} of ${totalCount} career pathways`;
      }
    }

    if (clearSearchBtn) {
      const hasActiveFilter = activeCategory !== 'all' || normalizedQuery !== '';
      clearSearchBtn.classList.toggle('hidden', !hasActiveFilter);
    }

    if (emptyStateEl) {
      if (visibleCount === 0) {
        emptyStateEl.classList.remove('hidden');
      } else {
        emptyStateEl.classList.add('hidden');
      }
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = (urlParams.get('category') || '').toLowerCase().trim();
  const initialSearch = (urlParams.get('search') || '').trim();

  if (initialCategory) {
    const matchingBtn = Array.from(filterButtons).find(
      (btn) => (btn.getAttribute('data-filter') || '').toLowerCase() === initialCategory
    );
    if (matchingBtn) {
      activeCategory = initialCategory;
      setActiveCategoryButton(activeCategory);
    }
  }

  if (initialSearch && searchInput) {
    searchInput.value = initialSearch;
    searchQuery = initialSearch;
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchQuery = event.target.value;
      filterCards();
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.getAttribute('data-filter') || 'all';
      setActiveCategoryButton(activeCategory);
      filterCards();
    });
  });

  const resetAllFilters = () => {
    activeCategory = 'all';
    searchQuery = '';
    if (searchInput) {
      searchInput.value = '';
    }
    setActiveCategoryButton('all');
    filterCards();
  };

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      resetAllFilters();
      if (searchInput) searchInput.focus();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', resetAllFilters);
  }

  filterCards();
}

/**
 * 2. Career Details Role Switcher & Deep-Linking (career-details.html)
 */
function initCareerDetailsNavigation() {
  const roleNavLinks = document.querySelectorAll('.role-switcher-btn');
  const careerSections = document.querySelectorAll('.career-detail-section');

  if (roleNavLinks.length === 0 || careerSections.length === 0) return;

  const setActiveRoleLink = (targetId) => {
    roleNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${targetId}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'true');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  };

  const handleInitialHash = () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const targetSection = document.getElementById(hash);
      if (targetSection) {
        setActiveRoleLink(hash);
        setTimeout(() => {
          const headerOffset = 136;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }, 100);
      }
    } else if (careerSections[0]) {
      setActiveRoleLink(careerSections[0].id);
    }
  };

  handleInitialHash();
  window.addEventListener('hashchange', handleInitialHash);

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveRoleLink(entry.target.id);
        }
      });
    }, observerOptions);

    careerSections.forEach((section) => observer.observe(section));
  }
}
