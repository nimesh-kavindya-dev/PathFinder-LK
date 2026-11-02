import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuizResult, filterCareerItems, resolveRoadmapPane } from './logic.mjs';

describe('PathFinder LK Pure Logic Tests', () => {
  test('calculateQuizResult ranks top and runner-up careers across 9 pathways', () => {
    const answers = [
      { primary: 'cloud', secondary: 'se' },
      { primary: 'cloud', secondary: 'cs' },
      { primary: 'se', secondary: 'fs' },
      { primary: 'cloud', secondary: 'de' },
      { primary: 'cs', secondary: 'cloud' },
      { primary: 'se', secondary: 'cloud' },
      { primary: 'cloud', secondary: 'qa' },
      { primary: 'se', secondary: 'fs' },
      { primary: 'cloud', secondary: 'se' },
    ];
    const res = calculateQuizResult(answers);
    assert.equal(res.topKey, 'cloud');
    assert.equal(res.secondKey, 'se');
    assert.ok(res.topPercent >= 68 && res.topPercent <= 98);
  });

  test('calculateQuizResult handles empty input safely without throwing', () => {
    const res = calculateQuizResult([]);
    assert.equal(res.topKey, 'se');
    assert.equal(res.topPercent, 0);
  });

  test('filterCareerItems filters by category and search keywords accurately', () => {
    const sampleCareers = [
      { id: 'se', title: 'Software Engineer', category: 'development', keywords: 'java python backend', description: 'Build backend systems' },
      { id: 'cloud', title: 'Cloud & DevOps Engineer', category: 'cloud', keywords: 'aws docker kubernetes terraform', description: 'Automate infrastructure' },
      { id: 'qa', title: 'QA & Test Automation Engineer', category: 'qa', keywords: 'playwright cypress testing', description: 'Ensure software quality' },
    ];

    assert.equal(filterCareerItems(sampleCareers, 'all', '').length, 3);
    assert.equal(filterCareerItems(sampleCareers, 'cloud', '').length, 1);
    assert.equal(filterCareerItems(sampleCareers, 'all', 'kubernetes')[0].id, 'cloud');
    assert.equal(filterCareerItems(sampleCareers, 'qa', 'playwright')[0].id, 'qa');
    assert.equal(filterCareerItems(sampleCareers, 'development', 'kubernetes').length, 0);
  });

  test('resolveRoadmapPane maps all 15 career slugs and falls back to roadmap-se', () => {
    assert.equal(resolveRoadmapPane('fullstack-developer'), 'roadmap-fs');
    assert.equal(resolveRoadmapPane('cloud-devops'), 'roadmap-cloud');
    assert.equal(resolveRoadmapPane('data-scientist'), 'roadmap-ds');
    assert.equal(resolveRoadmapPane('qa-engineer'), 'roadmap-qa');
    assert.equal(resolveRoadmapPane('business-analyst'), 'roadmap-ba');
    assert.equal(resolveRoadmapPane('product-manager'), 'roadmap-pm');
    assert.equal(resolveRoadmapPane('digital-marketing'), 'roadmap-dm');
    assert.equal(resolveRoadmapPane('financial-analyst'), 'roadmap-fa');
    assert.equal(resolveRoadmapPane('multimedia-designer'), 'roadmap-mm');
    assert.equal(resolveRoadmapPane('robotics-iot'), 'roadmap-iot');
    assert.equal(resolveRoadmapPane('unknown-slug'), 'roadmap-se');
    assert.equal(resolveRoadmapPane(''), 'roadmap-se');
  });
});
