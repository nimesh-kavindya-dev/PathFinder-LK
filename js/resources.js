/**
 * PathFinder LK - Learning Resources Script
 * Course: IS 1106 - Foundations of Web Technologies
 * Description: Live search and topic filtering for the Learning Resources directory.
 */

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('resource-search');
  const filterButtons = document.querySelectorAll('.resource-filter-btn');
  const resourceCards = document.querySelectorAll('.resource-card');
  const noResultsMsg = document.getElementById('no-resources-msg');
  const clearResourcesBtn = document.getElementById('clear-resources-btn');
  const resetResourcesBtn = document.getElementById('reset-resources-btn');
  const resultCountText = document.getElementById('resources-result-count');

  if (!resourceCards.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  const filterResources = () => {
    let visibleCount = 0;
    const totalCount = resourceCards.length;

    resourceCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const cardTitle = (card.querySelector('h2')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('p')?.textContent || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory || cardCategory.includes(currentCategory));
      const matchesSearch = !searchQuery || 
                            cardTitle.includes(searchQuery) || 
                            cardDesc.includes(searchQuery) || 
                            cardKeywords.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (resultCountText) {
      resultCountText.textContent = `Showing ${visibleCount} of ${totalCount} Resources`;
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

    filterResources();
  };

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterResources();
    });
  }

  // Filter pills click listener
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'all';
      filterResources();
    });
  });

  // Clear & Reset buttons listeners
  if (clearResourcesBtn) {
    clearResourcesBtn.addEventListener('click', clearAllFilters);
  }
  if (resetResourcesBtn) {
    resetResourcesBtn.addEventListener('click', clearAllFilters);
  }

  // Initial result count
  filterResources();

});
