/**
 * PathFinder LK - Careers Page & Career Details Script
 * Course: IS 1106 - Foundations of Web Technologies
 * Description: Live search and category filtering for careers.html with clear filter capability,
 *              and URL query/hash handler for career-details.html.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Explore Careers Page (careers.html) Search & Filter
     ========================================================================== */
  const searchInput = document.getElementById('career-search');
  const filterButtons = document.querySelectorAll('.filter-pills .filter-btn');
  const careerCards = document.querySelectorAll('.career-item');
  const noResultsMsg = document.getElementById('no-careers-msg');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const resetSearchBtn = document.getElementById('reset-search-btn');
  const resultCountText = document.getElementById('careers-result-count');

  if (careerCards.length > 0) {
    let currentCategory = 'all';
    let searchQuery = '';

    /**
     * Filters career cards based on BOTH category selection AND search query
     */
    const filterCareers = () => {
      let visibleCount = 0;
      const totalCount = careerCards.length;

      careerCards.forEach(card => {
        const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
        const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
        const cardTitle = (card.querySelector('h2')?.textContent || '').toLowerCase();
        const cardDesc = (card.querySelector('p')?.textContent || '').toLowerCase();

        // Check if category matches
        const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory || cardCategory.includes(currentCategory));

        // Check if search query matches name, keywords, or description
        const matchesSearch = !searchQuery || 
                              cardTitle.includes(searchQuery) || 
                              cardKeywords.includes(searchQuery) || 
                              cardDesc.includes(searchQuery);

        // Combined logic: must satisfy both criteria
        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update No Results Display
      if (noResultsMsg) {
        noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      // Update Result Counter
      if (resultCountText) {
        resultCountText.textContent = `Showing ${visibleCount} of ${totalCount} Careers`;
      }
    };

    /**
     * Resets both search input and category filter back to default
     */
    const clearAllFilters = () => {
      searchQuery = '';
      currentCategory = 'all';

      if (searchInput) {
        searchInput.value = '';
      }

      filterButtons.forEach(btn => {
        if (btn.getAttribute('data-category') === 'all') {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      filterCareers();
    };

    // Live Search Input Listener
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterCareers();
      });
    }

    // Category Filter Buttons Listener
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = (btn.getAttribute('data-category') || 'all').toLowerCase();
        filterCareers();
      });
    });

    // Clear Filters Button Listeners
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    if (resetSearchBtn) {
      resetSearchBtn.addEventListener('click', clearAllFilters);
    }

    // Initialize result count
    filterCareers();
  }

  /* ==========================================================================
     2. Career Details Page (career-details.html) Navigation & URL Handler
     ========================================================================== */
  const careerArticles = document.querySelectorAll('.career-detail-article');
  const roleJumpLinks = document.querySelectorAll('.role-switcher-btn');

  if (careerArticles.length > 0) {
    const urlParams = new URLSearchParams(window.location.search);
    const paramCareer = urlParams.get('career');
    const hashCareer = window.location.hash.replace('#', '');
    const targetCareerId = paramCareer || hashCareer;

    const highlightActiveCareer = (targetId) => {
      if (!targetId) return;

      roleJumpLinks.forEach(link => {
        const linkTarget = link.getAttribute('data-target') || link.getAttribute('href').replace('#', '');
        if (linkTarget === targetId) {
          link.classList.add('active');
          link.style.backgroundColor = 'var(--primary-color)';
          link.style.color = '#ffffff';
          link.style.borderColor = 'var(--primary-color)';
        } else {
          link.classList.remove('active');
          link.style.backgroundColor = '#ffffff';
          link.style.color = 'var(--secondary-color)';
          link.style.borderColor = 'var(--border-color)';
        }
      });

      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    if (targetCareerId) {
      highlightActiveCareer(targetCareerId);
    }

    roleJumpLinks.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target') || btn.getAttribute('href').replace('#', '');
        highlightActiveCareer(targetId);
      });
    });
  }

});
