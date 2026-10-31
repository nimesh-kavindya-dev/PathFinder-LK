/**
 * PathFinder LK - Interactive Career Quiz Script
 * Course: IS 1106 - Foundations of Web Technologies
 * Description: Vanilla JavaScript quiz logic, validation, scoring, tie handling,
 *              progress tracking, and dynamic results presentation.
 */

document.addEventListener('DOMContentLoaded', () => {

  const quizForm = document.getElementById('career-quiz-form');
  const resultContainer = document.getElementById('quiz-result');
  const validationBanner = document.getElementById('quiz-validation-banner');
  const progressBarFill = document.getElementById('quiz-progress-fill');
  const progressText = document.getElementById('quiz-progress-text');
  const resetBtn = document.getElementById('reset-quiz-btn');

  if (!quizForm) return;

  const TOTAL_QUESTIONS = 9;

  // Career details dictionary for dynamic results
  const CAREER_DATA = {
    se: {
      id: 'software-engineer',
      title: 'Software Engineer',
      domain: 'Software Development & Architecture',
      badgeClass: 'badge-blue',
      icon: 'assets/images/careers/software-engineer.svg',
      description: 'You enjoy solving logical computational problems, writing clean code, and engineering complete applications from frontend interfaces to backend microservices.',
      skills: [
        'Core Object-Oriented Programming (Java, Python, C#, or TypeScript)',
        'Data Structures & Algorithms (arrays, trees, searching, sorting)',
        'Web Fundamentals & APIs (RESTful APIs, HTTP, JSON)',
        'Relational Databases & SQL queries',
        'Version control with Git and team workflow on GitHub'
      ],
      detailsUrl: 'career-details.html?career=software-engineer#software-engineer',
      roadmapUrl: 'roadmaps.html#roadmap-se'
    },
    da: {
      id: 'data-analyst',
      title: 'Data Analyst',
      domain: 'Business Intelligence & Data Analytics',
      badgeClass: 'badge-green',
      icon: 'assets/images/careers/data-analyst.svg',
      description: 'You thrive on analyzing operational numbers, discovering patterns in complex datasets, and designing visual dashboards that help organizations make data-driven decisions.',
      skills: [
        'Advanced Relational SQL (multi-table joins, subqueries, aggregations)',
        'Business Intelligence Tools (Microsoft Power BI, Tableau)',
        'Spreadsheet Modeling (Excel formulas, Pivot Tables, VLOOKUP/XLOOKUP)',
        'Exploratory Data Analysis using Python (Pandas, NumPy, Matplotlib)',
        'Statistical reasoning, KPI evaluation, and data storytelling'
      ],
      detailsUrl: 'career-details.html?career=data-analyst#data-analyst',
      roadmapUrl: 'roadmaps.html#roadmap-da'
    },
    de: {
      id: 'data-engineer',
      title: 'Data Engineer',
      domain: 'Big Data & Cloud Data Pipelines',
      badgeClass: 'badge-amber',
      icon: 'assets/images/careers/data-engineer.svg',
      description: 'You are fascinated by the plumbing of big data—architecting automated ETL pipelines, cloud data warehouses, and moving massive data volumes smoothly and reliably.',
      skills: [
        'Pipeline scripting in Python, SQL, or Scala',
        'Distributed Computing Frameworks (Apache Spark, PySpark)',
        'Workflow Orchestration using Apache Airflow',
        'Cloud Data Warehousing (Snowflake, Google BigQuery, AWS S3)',
        'Database modeling (Star/Snowflake schemas) and Linux administration'
      ],
      detailsUrl: 'career-details.html?career=data-engineer#data-engineer',
      roadmapUrl: 'roadmaps.html#roadmap-de'
    },
    cs: {
      id: 'cybersecurity',
      title: 'Cybersecurity Analyst',
      domain: 'Information Security & Threat Defense',
      badgeClass: 'badge-red',
      icon: 'assets/images/careers/cybersecurity.svg',
      description: 'You enjoy investigating system boundaries, inspecting network traffic, discovering vulnerabilities, defending systems against attacks, and enforcing digital security standards.',
      skills: [
        'Computer Networking Fundamentals (TCP/IP, OSI model, DNS, subnets, routing)',
        'Linux Terminal Administration, file permissions, and system hardening',
        'Network Packet Analysis using Wireshark and Nmap',
        'Security Information & Event Management (SIEM) log analysis',
        'Web Security Standards (OWASP Top 10) and ethical security testing'
      ],
      detailsUrl: 'career-details.html?career=cybersecurity#cybersecurity',
      roadmapUrl: 'roadmaps.html#roadmap-cs'
    },
    uiux: {
      id: 'ui-ux',
      title: 'UI/UX Designer',
      domain: 'Human-Computer Interaction & Interface Design',
      badgeClass: 'badge-purple',
      icon: 'assets/images/careers/ui-ux.svg',
      description: 'You have a natural passion for human empathy, aesthetics, and usability—designing intuitive user flows, accessible wireframes, and interactive product prototypes.',
      skills: [
        'Interactive Prototyping and Design Systems in Figma (auto-layout, components)',
        'User Research Methodologies (interviews, surveys, persona creation)',
        'Information Architecture, wireframing, and user journey mapping',
        'Web Accessibility Standards (WCAG 2.1 AA) and responsive layouts',
        'Foundational knowledge of HTML5 and CSS3 for developer handoff'
      ],
      detailsUrl: 'career-details.html?career=ui-ux#ui-ux',
      roadmapUrl: 'roadmaps.html#roadmap-uiux'
    }
  };

  /**
   * Updates live progress bar as questions are answered
   */
  const updateProgress = () => {
    let answeredCount = 0;
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      const selected = quizForm.querySelector(`input[name="q${i}"]:checked`);
      if (selected) answeredCount++;
    }

    const percentage = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
    if (progressBarFill) {
      progressBarFill.style.width = `${percentage}%`;
    }
    if (progressText) {
      progressText.textContent = `${answeredCount} of ${TOTAL_QUESTIONS} Questions Answered (${percentage}%)`;
    }
  };

  // Listen to any radio change to update styles and progress
  quizForm.addEventListener('change', (e) => {
    if (e.target && e.target.type === 'radio') {
      const questionCard = e.target.closest('.quiz-card');
      if (questionCard) {
        questionCard.classList.remove('unanswered-error');
      }

      // Update active option styling
      const fieldset = e.target.closest('fieldset');
      if (fieldset) {
        const labels = fieldset.querySelectorAll('.quiz-option-label');
        labels.forEach(lbl => lbl.classList.remove('checked'));
        const activeLabel = e.target.closest('.quiz-option-label');
        if (activeLabel) activeLabel.classList.add('checked');
      }

      updateProgress();
    }
  });

  /**
   * Quiz Form Submission & Scoring Handler
   */
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const unansweredQuestions = [];
    const scores = { se: 0, da: 0, de: 0, cs: 0, uiux: 0 };

    // Validate all 9 questions
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      const selected = quizForm.querySelector(`input[name="q${i}"]:checked`);
      const card = document.getElementById(`q${i}-card`);

      if (!selected) {
        unansweredQuestions.push(i);
        if (card) card.classList.add('unanswered-error');
      } else {
        if (card) card.classList.remove('unanswered-error');
        const value = selected.value;
        if (scores.hasOwnProperty(value)) {
          scores[value]++;
        }
      }
    }

    // Handle Unanswered Validation
    if (unansweredQuestions.length > 0) {
      if (validationBanner) {
        const questionList = unansweredQuestions.map(n => `Q${n}`).join(', ');
        validationBanner.innerHTML = `
          <strong>Incomplete Submission:</strong> Please answer all ${TOTAL_QUESTIONS} questions before submitting.<br>
          <span style="font-weight: 400; font-size: 0.9rem;">Remaining unanswered: ${questionList}</span>
        `;
        validationBanner.style.display = 'block';
      }

      // Smooth scroll to the first unanswered question
      const firstUnansweredCard = document.getElementById(`q${unansweredQuestions[0]}-card`);
      if (firstUnansweredCard) {
        firstUnansweredCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Hide validation banner if all questions are answered
    if (validationBanner) {
      validationBanner.style.display = 'none';
    }

    // Calculate Highest Score & Detect Ties
    let highestScore = -1;
    let topCareers = [];

    for (const [careerKey, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        topCareers = [careerKey];
      } else if (score === highestScore) {
        topCareers.push(careerKey);
      }
    }

    const primaryCareerKey = topCareers[0];
    const careerInfo = CAREER_DATA[primaryCareerKey];
    const matchPercentage = Math.round((highestScore / TOTAL_QUESTIONS) * 100);

    // Build tie notification if there are tied top results
    let tieHtml = '';
    if (topCareers.length > 1) {
      const tiedTitles = topCareers
        .filter(k => k !== primaryCareerKey)
        .map(k => `<strong>${CAREER_DATA[k].title}</strong>`)
        .join(' and ');
      
      tieHtml = `
        <div class="tie-alert-box" role="status">
          <strong>Close Career Alignment:</strong> You also scored equally high in ${tiedTitles}! Your multifaceted interests make you suitable for more than one IT specialization. Review both paths to decide what resonates most.
        </div>
      `;
    }

    // Render the Result Section dynamically
    if (resultContainer && careerInfo) {
      resultContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 84px; height: 84px; background-color: var(--bg-page); border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1rem;">
            <img src="${careerInfo.icon}" alt="${careerInfo.title} icon" width="56" height="56">
          </div>
          <div>
            <span class="badge ${careerInfo.badgeClass}" style="margin-bottom: 0.5rem;">${careerInfo.domain}</span>
            <h2 style="font-size: 2.25rem; color: var(--secondary-color); margin-bottom: 0.25rem;">
              Recommended Match: <span style="color: var(--primary-color);">${careerInfo.title}</span>
            </h2>
            <div style="display: inline-block; background-color: #f0f9ff; border: 1px solid var(--primary-border); padding: 0.35rem 1rem; border-radius: 999px; font-weight: 700; color: var(--primary-dark); font-size: 0.95rem; margin-top: 0.5rem;">
              Career Match Score: ${highestScore} / ${TOTAL_QUESTIONS} (${matchPercentage}% Alignment)
            </div>
          </div>
        </div>

        ${tieHtml}

        <div style="background-color: var(--bg-page); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.15rem; color: var(--secondary-color); margin-bottom: 0.5rem;">Why This Role Fits You</h3>
          <p style="color: var(--text-main); font-size: 1rem; margin: 0; line-height: 1.7;">
            ${careerInfo.description}
          </p>
        </div>

        <div style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.15rem; color: var(--secondary-color); margin-bottom: 0.75rem;">Key Technical &amp; Practical Skills to Develop</h3>
          <ul style="padding-left: 1.25rem; line-height: 1.8; color: var(--text-main);">
            ${careerInfo.skills.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid var(--border-color); padding: 1rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.875rem; color: var(--text-muted); margin-bottom: 2rem;">
          <strong>Educational Guidance Notice:</strong> This quiz provides general orientation based on your self-reported study preferences. It is an educational tool designed to help university students explore career domains and is not an absolute or scientific determinant of your future career path.
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="${careerInfo.detailsUrl}" class="btn btn-primary">Explore ${careerInfo.title} Details &rarr;</a>
          <a href="${careerInfo.roadmapUrl}" class="btn btn-secondary">View Learning Roadmap</a>
          <button type="button" id="restart-quiz-btn" class="btn btn-accent">Restart Quiz</button>
        </div>
      `;

      resultContainer.style.display = 'block';

      // Scroll smoothly to the result card
      setTimeout(() => {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      // Attach listener to newly created Restart button inside results
      const restartBtn = document.getElementById('restart-quiz-btn');
      if (restartBtn) {
        restartBtn.addEventListener('click', handleRestart);
      }
    }
  });

  /**
   * Reset / Restart Handler
   */
  const handleRestart = () => {
    quizForm.reset();

    // Clear active option styling
    const labels = quizForm.querySelectorAll('.quiz-option-label');
    labels.forEach(lbl => lbl.classList.remove('checked'));

    // Remove any error highlights
    const cards = quizForm.querySelectorAll('.quiz-card');
    cards.forEach(card => card.classList.remove('unanswered-error'));

    // Hide validation banner & result container
    if (validationBanner) validationBanner.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'none';

    // Reset progress tracker
    if (progressBarFill) progressBarFill.style.width = '0%';
    if (progressText) progressText.textContent = `0 of ${TOTAL_QUESTIONS} Questions Answered (0%)`;

    // Scroll smoothly back to quiz top
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
      pageHeader.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (resetBtn) {
    resetBtn.addEventListener('click', handleRestart);
  }

});
