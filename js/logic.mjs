/**
 * Pure domain logic for PathFinder LK (used by unit tests and browser scripts)
 */

export const CAREER_KEYS = ['se', 'fs', 'cloud', 'da', 'de', 'ds', 'cs', 'uiux', 'qa'];

export const ROADMAP_CAREER_MAP = {
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
};

/**
 * Evaluates quiz answers (with optional secondary affinity) and returns ranked matches
 * @param {Array<string|{primary: string, secondary?: string}>} answers
 * @returns {{ topKey: string, secondKey: string, scores: Record<string, number>, topPercent: number }}
 */
export function calculateQuizResult(answers) {
  const scores = { se: 0, fs: 0, cloud: 0, da: 0, de: 0, ds: 0, cs: 0, uiux: 0, qa: 0 };
  if (!Array.isArray(answers) || answers.length === 0) {
    return { topKey: 'se', secondKey: 'fs', scores, topPercent: 0 };
  }

  for (const ans of answers) {
    if (typeof ans === 'string') {
      if (scores[ans] !== undefined) {
        scores[ans] += 2;
      }
    } else if (ans && typeof ans === 'object') {
      if (scores[ans.primary] !== undefined) {
        scores[ans.primary] += 2;
      }
      if (ans.secondary && scores[ans.secondary] !== undefined) {
        scores[ans.secondary] += 1;
      }
    }
  }

  const sorted = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const topKey = sorted[0];
  const secondKey = sorted[1];
  const topPercent = Math.min(98, Math.max(68, Math.round((scores[topKey] / (answers.length * 1.6)) * 100)));

  return { topKey, secondKey, scores, topPercent };
}

/**
 * Filters a list of career objects by category and search query
 * @param {Array<{id: string, title: string, category: string, keywords: string, description: string}>} careers
 * @param {string} activeCategory
 * @param {string} searchQuery
 */
export function filterCareerItems(careers, activeCategory = 'all', searchQuery = '') {
  if (!Array.isArray(careers)) return [];
  const normCat = (activeCategory || 'all').toLowerCase().trim();
  const normQuery = (searchQuery || '').toLowerCase().trim();

  return careers.filter((item) => {
    const categories = (item.category || '').toLowerCase().split(/\s+/);
    const matchesCategory = normCat === 'all' || categories.includes(normCat);

    const matchesSearch =
      normQuery === '' ||
      (item.title || '').toLowerCase().includes(normQuery) ||
      (item.description || '').toLowerCase().includes(normQuery) ||
      (item.keywords || '').toLowerCase().includes(normQuery);

    return matchesCategory && matchesSearch;
  });
}

/**
 * Resolves a career slug or hash to a roadmap pane ID
 * @param {string} slug
 * @returns {string}
 */
export function resolveRoadmapPane(slug) {
  if (!slug || typeof slug !== 'string') return 'roadmap-se';
  const key = slug.toLowerCase().trim().replace(/^#/, '');
  return ROADMAP_CAREER_MAP[key] || 'roadmap-se';
}
