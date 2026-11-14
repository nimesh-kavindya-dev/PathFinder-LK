

document.addEventListener('DOMContentLoaded', () => {
  initResourcesFilter();
});

function initResourcesFilter() {
  const searchInput = document.getElementById('resource-search');
  const categoryButtons = document.querySelectorAll('.resource-cat-btn');
  const levelSelect = document.getElementById('resource-level-select');
  const resourceCards = document.querySelectorAll('.resource-card[data-category]');
  const resultsCountEl = document.getElementById('resource-results-count');
  const emptyStateEl = document.getElementById('resource-empty-state');
  const resetBtn = document.getElementById('reset-resource-filters');
  const clearBtn = document.getElementById('clear-resource-filters');

  if (resourceCards.length === 0) return;

  let activeCategory = 'all';
  let activeLevel = 'all';
  let searchQuery = '';

  const applyFilters = (animateEntrance = false) => {
    let visibleCount = 0;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    resourceCards.forEach((card) => {
      const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
      const cardLevel = (card.getAttribute('data-level') || '').toLowerCase();
      const cardTitle = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const cardProvider = card.querySelector('.resource-provider')?.textContent.toLowerCase() || '';
      const cardDesc = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
      const cardTags = (card.getAttribute('data-tags') || '').toLowerCase();

      const matchesCategory = activeCategory === 'all' || cardCat.split(/\s+/).includes(activeCategory);
      const matchesLevel = activeLevel === 'all' || cardLevel === activeLevel;
      const matchesSearch =
        normalizedQuery === '' ||
        cardTitle.includes(normalizedQuery) ||
        cardProvider.includes(normalizedQuery) ||
        cardDesc.includes(normalizedQuery) ||
        cardTags.includes(normalizedQuery);

      if (matchesCategory && matchesLevel && matchesSearch) {
        card.classList.remove('hidden');
        card.classList.add('is-revealed');
        if (animateEntrance) {
          card.classList.remove('card-filter-enter');
          void card.offsetWidth;
          card.style.setProperty('--stagger-delay', `${(visibleCount % 9) * 55}ms`);
          card.classList.add('card-filter-enter');
        }
        visibleCount++;
      } else {
        card.classList.add('hidden');
        card.classList.remove('card-filter-enter');
      }
    });

    if (resultsCountEl) {
      const total = resourceCards.length;
      if (activeCategory === 'all' && activeLevel === 'all' && normalizedQuery === '') {
        resultsCountEl.textContent = `Showing all ${total} curated free learning resources`;
      } else {
        resultsCountEl.textContent = `Showing ${visibleCount} of ${total} free resources`;
      }
    }

    if (clearBtn) {
      const isFiltered = activeCategory !== 'all' || activeLevel !== 'all' || normalizedQuery !== '';
      clearBtn.classList.toggle('hidden', !isFiltered);
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
  const categoryParam = urlParams.get('category')?.toLowerCase();

  if (categoryParam) {
    const matchingBtn = Array.from(categoryButtons).find(
      (btn) => btn.getAttribute('data-category') === categoryParam
    );
    if (matchingBtn) {
      activeCategory = categoryParam;
      categoryButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      matchingBtn.classList.add('active');
      matchingBtn.setAttribute('aria-pressed', 'true');
    }
  }

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      categoryButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      activeCategory = button.getAttribute('data-category') || 'all';
      applyFilters(true);
    });
  });

  if (levelSelect) {
    levelSelect.addEventListener('change', (event) => {
      activeLevel = event.target.value;
      applyFilters(true);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchQuery = event.target.value;
      applyFilters(true);
    });
  }

  const resetAllFilters = () => {
    activeCategory = 'all';
    activeLevel = 'all';
    searchQuery = '';

    if (searchInput) searchInput.value = '';
    if (levelSelect) levelSelect.value = 'all';

    categoryButtons.forEach((btn) => {
      const isAll = btn.getAttribute('data-category') === 'all';
      btn.classList.toggle('active', isAll);
      btn.setAttribute('aria-pressed', String(isAll));
    });

    applyFilters(true);
  };

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetAllFilters();
      if (searchInput) searchInput.focus();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', resetAllFilters);
  }

  applyFilters(false);
}

window.initResourcesFilter = initResourcesFilter;
