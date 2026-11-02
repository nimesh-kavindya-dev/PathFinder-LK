/**
 * ============================================================================
 * PathFinder LK - Interactive Career Match Quiz Script (quiz.js)
 * ============================================================================
 * Description: Powers the interactive career recommendation quiz across all
 *              15 high-demand career pathways (IT, Business & Product,
 *              Finance & FinTech, Digital Marketing, Creative Multimedia,
 *              and Robotics/IoT Engineering).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCareerQuiz();
});

/**
 * Comprehensive metadata for all 15 supported career pathways
 */
const CAREER_DATA = {
  se: {
    id: 'software-engineer',
    title: 'Software Engineer',
    tagline: 'Architect and build scalable software systems, backend services, and APIs.',
    icon: 'assets/images/careers/software-engineer.jpg',
    description:
      'You enjoy logical problem-solving, software architecture, and writing clean code to build reliable applications from the ground up.',
    skills: ['Java / Python / C#', 'Data Structures & Algorithms', 'REST APIs & Microservices', 'Git & CI/CD'],
    beginnerSteps: [
      'Master one core object-oriented language (Python, Java, or C#) and OOP principles.',
      'Build 2–3 RESTful web APIs connected to a relational database (PostgreSQL).',
      'Practice algorithmic thinking and version control workflows on GitHub.',
    ],
    detailsUrl: 'career-details.html#software-engineer',
    roadmapUrl: 'roadmaps.html?career=software-engineer',
    resourcesUrl: 'resources.html?category=programming',
  },
  fs: {
    id: 'fullstack-developer',
    title: 'Full-Stack Web Developer',
    tagline: 'Build complete end-to-end web products across frontend interfaces and backend APIs.',
    icon: 'assets/images/careers/fullstack-developer.jpg',
    description:
      'You love shipping complete web applications—combining responsive React/Next.js user interfaces with robust Node.js and PostgreSQL backends.',
    skills: ['TypeScript & React / Next.js', 'Node.js & Express', 'PostgreSQL & Prisma', 'REST & Auth Systems'],
    beginnerSteps: [
      'Master semantic HTML5, modern CSS Grid/Flexbox, and JavaScript ES6+ fundamentals.',
      'Learn React and TypeScript to build interactive component-driven single-page apps.',
      'Connect your frontend to a Node.js/Express API with authentication and database storage.',
    ],
    detailsUrl: 'career-details.html#fullstack-developer',
    roadmapUrl: 'roadmaps.html?career=fullstack-developer',
    resourcesUrl: 'resources.html?category=programming',
  },
  cloud: {
    id: 'cloud-devops',
    title: 'Cloud & DevOps Engineer',
    tagline: 'Automate CI/CD pipelines, Kubernetes clusters, and resilient cloud infrastructure.',
    icon: 'assets/images/careers/cloud-devops.jpg',
    description:
      'You thrive on automation, Linux systems, cloud architecture (AWS/Azure), and making deployments fast, repeatable, and fault-tolerant.',
    skills: ['Linux & Bash Scripting', 'AWS / Azure Cloud', 'Docker & Kubernetes', 'Terraform & GitHub Actions'],
    beginnerSteps: [
      'Learn Linux command-line administration, networking fundamentals, and Bash scripting.',
      'Containerize web applications using Docker and automate builds with GitHub Actions.',
      'Explore AWS Cloud Practitioner concepts and provision cloud resources with Terraform.',
    ],
    detailsUrl: 'career-details.html#cloud-devops',
    roadmapUrl: 'roadmaps.html?career=cloud-devops',
    resourcesUrl: 'resources.html?category=cloud',
  },
  da: {
    id: 'data-analyst',
    title: 'Data Analyst',
    tagline: 'Transform raw business data into actionable insights, KPIs, and visual dashboards.',
    icon: 'assets/images/careers/data-analyst.jpg',
    description:
      'You have a sharp eye for patterns, statistics, and storytelling with numbers—helping organizations make smarter, evidence-based decisions.',
    skills: ['SQL & Database Querying', 'Python (Pandas & NumPy)', 'Power BI / Tableau', 'Descriptive Statistics'],
    beginnerSteps: [
      'Learn SQL thoroughly (SELECT, JOINs, GROUP BY, Window Functions) for data extraction.',
      'Master spreadsheet modeling in Excel and build interactive dashboards in Power BI.',
      'Use Python (Pandas, Matplotlib/Seaborn) to clean and analyze real-world datasets.',
    ],
    detailsUrl: 'career-details.html#data-analyst',
    roadmapUrl: 'roadmaps.html?career=data-analyst',
    resourcesUrl: 'resources.html?category=data',
  },
  de: {
    id: 'data-engineer',
    title: 'Data Engineer',
    tagline: 'Design high-volume data pipelines, ETL workflows, and cloud data warehouses.',
    icon: 'assets/images/careers/data-engineer.jpg',
    description:
      'You enjoy large-scale systems architecture, databases, and automation—building the reliable data infrastructure that powers analytics and AI.',
    skills: ['Advanced SQL & Data Modeling', 'Python & Apache Spark', 'ETL / ELT Pipelines (Airflow)', 'Cloud Warehouses'],
    beginnerSteps: [
      'Master relational database design, normalization, and advanced SQL query optimization.',
      'Write Python scripts to extract data from public APIs, transform it, and load it into PostgreSQL.',
      'Explore Docker, Linux basics, and workflow orchestration concepts (Apache Airflow / dbt).',
    ],
    detailsUrl: 'career-details.html#data-engineer',
    roadmapUrl: 'roadmaps.html?career=data-engineer',
    resourcesUrl: 'resources.html?category=data',
  },
  ds: {
    id: 'data-scientist',
    title: 'Data Scientist & AI Engineer',
    tagline: 'Train predictive machine learning models and build intelligent AI-driven systems.',
    icon: 'assets/images/careers/data-scientist.jpg',
    description:
      'You are fascinated by machine learning, statistical modeling, and AI—turning complex datasets into predictive models and intelligent applications.',
    skills: ['Python (Scikit-Learn / PyTorch)', 'Machine Learning & Statistics', 'Feature Engineering & SQL', 'LLM & Model Deployment'],
    beginnerSteps: [
      'Build a strong foundation in Python data science libraries (NumPy, Pandas, Matplotlib) and probability.',
      'Train supervised and unsupervised machine learning models with Scikit-Learn on real datasets.',
      'Deploy a trained ML model behind a FastAPI or Streamlit interface for interactive testing.',
    ],
    detailsUrl: 'career-details.html#data-scientist',
    roadmapUrl: 'roadmaps.html?career=data-scientist',
    resourcesUrl: 'resources.html?category=data',
  },
  cs: {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    tagline: 'Defend networks, cloud infrastructure, and applications against digital threats.',
    icon: 'assets/images/careers/cybersecurity.jpg',
    description:
      'You think like an investigator and protector—analyzing vulnerabilities, monitoring security events, and hardening systems against cyber attacks.',
    skills: ['Networking (TCP/IP, OSI, DNS)', 'Linux & Windows Hardening', 'SIEM & Incident Response', 'Web App Security (OWASP)'],
    beginnerSteps: [
      'Build a rock-solid foundation in computer networking (TCP/IP, subnets, firewalls) and Linux CLI.',
      'Practice hands-on defensive and ethical hacking labs on TryHackMe or Cisco NetAcad.',
      'Study the OWASP Top 10 web vulnerabilities and learn how to configure SIEM monitoring tools.',
    ],
    detailsUrl: 'career-details.html#cybersecurity',
    roadmapUrl: 'roadmaps.html?career=cybersecurity',
    resourcesUrl: 'resources.html?category=cybersecurity',
  },
  uiux: {
    id: 'ui-ux',
    title: 'UI/UX Product Designer',
    tagline: 'Craft intuitive, accessible, and human-centered digital product experiences.',
    icon: 'assets/images/careers/ui-ux.jpg',
    description:
      'You blend empathy, psychology, and visual craft—researching user needs and designing wireframes, prototypes, and design systems that people love using.',
    skills: ['Figma & Interactive Prototyping', 'User Research & Wireframing', 'Design Systems & Typography', 'Usability & Accessibility (WCAG)'],
    beginnerSteps: [
      'Master visual hierarchy, layout grids, typography, and color contrast principles.',
      'Learn Figma inside-out: Auto Layout, reusable components, variants, and interactive prototypes.',
      'Redesign an existing Sri Lankan mobile app or campus portal and document your UX case study.',
    ],
    detailsUrl: 'career-details.html#ui-ux',
    roadmapUrl: 'roadmaps.html?career=ui-ux',
    resourcesUrl: 'resources.html?category=uiux',
  },
  qa: {
    id: 'qa-engineer',
    title: 'QA & Test Automation Engineer',
    tagline: 'Ensure software reliability through automated end-to-end, API, and performance testing.',
    icon: 'assets/images/careers/qa-engineer.jpg',
    description:
      'You have an analytical eye for edge cases and quality—designing automated test suites and CI quality gates so software ships without critical bugs.',
    skills: ['Playwright / Cypress / Selenium', 'API Testing (Postman & REST)', 'Test Strategy & Bug Triage', 'CI/CD Quality Gates'],
    beginnerSteps: [
      'Learn software testing fundamentals: test plans, boundary analysis, and structured bug reporting.',
      'Master API testing with Postman and write automated end-to-end browser tests with Playwright.',
      'Integrate your automated test suite into GitHub Actions so tests run on every pull request.',
    ],
    detailsUrl: 'career-details.html#qa-engineer',
    roadmapUrl: 'roadmaps.html?career=qa-engineer',
    resourcesUrl: 'resources.html?category=qa',
  },
  ba: {
    id: 'business-analyst',
    title: 'Business Analyst & Project Manager',
    tagline: 'Bridge business strategy, stakeholder requirements, Agile delivery, and enterprise solutions.',
    icon: 'assets/images/careers/business-analyst.jpg',
    description:
      'You excel at communication, process modeling, and leadership—translating business challenges into structured project plans, user stories, and measurable outcomes.',
    skills: ['Business Process Modeling (BPMN)', 'Agile / Scrum & Jira', 'Requirements Engineering', 'SQL & Power BI Basics'],
    beginnerSteps: [
      'Learn Agile/Scrum frameworks, user story writing, and acceptance criteria in Jira and Confluence.',
      'Practice mapping business workflows using BPMN diagrams and stakeholder interview templates.',
      'Build foundational data literacy with Excel, SQL basics, and Power BI KPI reporting.',
    ],
    detailsUrl: 'career-details.html#business-analyst',
    roadmapUrl: 'roadmaps.html?career=business-analyst',
    resourcesUrl: 'resources.html?category=business',
  },
  pm: {
    id: 'product-manager',
    title: 'Product Manager',
    tagline: 'Define product vision, market strategy, feature prioritization, and cross-functional execution.',
    icon: 'assets/images/careers/product-manager.jpg',
    description:
      'You think like a mini-CEO for a product—combining customer discovery, competitive market analysis, UX intuition, and product roadmapping.',
    skills: ['Product Strategy & Roadmapping', 'User Discovery & PRDs', 'Product Analytics (Mixpanel/GA4)', 'Cross-Functional Leadership'],
    beginnerSteps: [
      'Learn how to conduct customer discovery interviews and write clear Product Requirement Documents (PRDs).',
      'Master prioritization frameworks (RICE, MoSCoW) and product metrics (Retention, Conversion, NPS).',
      'Create a complete Product Case Study & Roadmap for a real Sri Lankan digital service or startup idea.',
    ],
    detailsUrl: 'career-details.html#product-manager',
    roadmapUrl: 'roadmaps.html?career=product-manager',
    resourcesUrl: 'resources.html?category=business',
  },
  dm: {
    id: 'digital-marketing',
    title: 'Digital Marketing & Growth Strategist',
    tagline: 'Drive brand visibility, SEO/SEM customer acquisition, social media strategy, and conversion growth.',
    icon: 'assets/images/careers/digital-marketing.jpg',
    description:
      'You combine creative storytelling with data-driven marketing—growing brands through search engines, paid campaigns, content strategy, and analytics.',
    skills: ['SEO & Content Strategy', 'Google Ads & Meta Ads', 'Google Analytics 4 (GA4)', 'Conversion Rate Optimization'],
    beginnerSteps: [
      'Complete Google Digital Garage and HubSpot Inbound Marketing fundamentals.',
      'Learn Search Engine Optimization (SEO), keyword research, and Google Analytics 4 tracking.',
      'Launch and measure a real social media or content growth campaign for a campus club or small business.',
    ],
    detailsUrl: 'career-details.html#digital-marketing',
    roadmapUrl: 'roadmaps.html?career=digital-marketing',
    resourcesUrl: 'resources.html?category=marketing',
  },
  fa: {
    id: 'financial-analyst',
    title: 'Financial Analyst & FinTech Specialist',
    tagline: 'Lead corporate financial modeling, investment analysis, valuation, and digital banking innovation.',
    icon: 'assets/images/careers/financial-analyst.jpg',
    description:
      'You thrive on financial markets, corporate valuation, accounting logic, and FinTech—turning financial statements and market data into strategic investments.',
    skills: ['Financial Modeling & Valuation', 'Advanced Excel & Power BI', 'Corporate Finance & Accounting', 'FinTech & Risk Analysis'],
    beginnerSteps: [
      'Master 3-statement financial modeling (Income Statement, Balance Sheet, Cash Flow) in Excel.',
      'Study corporate valuation (DCF), ratio analysis, and digital payments/FinTech ecosystems.',
      'Build an interactive equity research report and financial dashboard for a Colombo Stock Exchange company.',
    ],
    detailsUrl: 'career-details.html#financial-analyst',
    roadmapUrl: 'roadmaps.html?career=financial-analyst',
    resourcesUrl: 'resources.html?category=finance',
  },
  mm: {
    id: 'multimedia-designer',
    title: 'Creative Multimedia & Motion Designer',
    tagline: 'Create compelling motion graphics, video production, 3D visuals, and brand identities.',
    icon: 'assets/images/careers/multimedia-designer.jpg',
    description:
      'You bring stories to life visually—combining video editing, 2D/3D motion graphics, sound design, and visual branding for digital media and agencies.',
    skills: ['Video Editing (Premiere / DaVinci)', 'Motion Graphics (After Effects)', '3D & Visual Design (Blender / Illustrator)', 'Brand Storytelling'],
    beginnerSteps: [
      'Master visual composition, color grading, typography, and storyboarding fundamentals.',
      'Learn DaVinci Resolve / Premiere Pro for editing and After Effects / Blender for motion and 3D.',
      'Produce a 60-second high-impact showreel featuring brand animations, motion titles, and visual edits.',
    ],
    detailsUrl: 'career-details.html#multimedia-designer',
    roadmapUrl: 'roadmaps.html?career=multimedia-designer',
    resourcesUrl: 'resources.html?category=uiux',
  },
  iot: {
    id: 'robotics-iot',
    title: 'Mechatronics, Robotics & IoT Engineer',
    tagline: 'Build smart connected hardware, embedded systems, industrial automation, and robotics.',
    icon: 'assets/images/careers/robotics-iot.jpg',
    description:
      'You love bridging physical hardware and software—programming microcontrollers, sensors, robotics, and smart IoT systems for industry and agriculture.',
    skills: ['Embedded C/C++ & MicroPython', 'ESP32 / Arduino / Raspberry Pi', 'IoT Protocols (MQTT) & Sensors', 'PCB & 3D CAD Prototyping'],
    beginnerSteps: [
      'Learn electronics fundamentals, circuit design, and C/C++ programming on Arduino or ESP32.',
      'Connect temperature, motion, or agricultural sensors to cloud dashboards via Wi-Fi and MQTT.',
      'Design and 3D-print a smart IoT or robotics prototype solving a real Sri Lankan industry problem.',
    ],
    detailsUrl: 'career-details.html#robotics-iot',
    roadmapUrl: 'roadmaps.html?career=robotics-iot',
    resourcesUrl: 'resources.html?category=engineering',
  },
};

function initCareerQuiz() {
  const quizForm = document.getElementById('career-quiz-form');
  const questionCards = document.querySelectorAll('.quiz-question-card');
  const progressBar = document.getElementById('quiz-progress-bar');
  const progressText = document.getElementById('quiz-progress-text');
  const progressPercentEl = document.getElementById('quiz-progress-percent');
  const errorBanner = document.getElementById('quiz-error-banner');
  const resultsSection = document.getElementById('quiz-results-section');
  const retakeBtn = document.getElementById('retake-quiz-btn');
  const resetFormBtn = document.getElementById('reset-quiz-btn');

  if (!quizForm || questionCards.length === 0) return;

  const totalQuestions = questionCards.length;

  const updateProgress = () => {
    const answeredCount = quizForm.querySelectorAll('input[type="radio"]:checked').length;
    const percentage = Math.round((answeredCount / totalQuestions) * 100);

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
      progressBar.setAttribute('aria-valuenow', String(percentage));
    }
    if (progressText) {
      progressText.textContent = `${answeredCount} of ${totalQuestions} questions answered`;
    }
    if (progressPercentEl) {
      progressPercentEl.textContent = `${percentage}%`;
    }

    questionCards.forEach((card) => {
      const checkedRadio = card.querySelector('input[type="radio"]:checked');
      if (checkedRadio) {
        card.classList.add('is-answered');
        card.classList.remove('has-error');
      }
    });

    if (answeredCount === totalQuestions && errorBanner) {
      errorBanner.classList.add('hidden');
    }
  };

  const radioInputs = quizForm.querySelectorAll('input[type="radio"]');
  radioInputs.forEach((radio) => {
    radio.addEventListener('change', () => {
      const questionCard = radio.closest('.quiz-question-card');
      if (questionCard) {
        questionCard.querySelectorAll('.quiz-option-label').forEach((lbl) => {
          lbl.classList.remove('is-selected');
        });
        const parentLabel = radio.closest('.quiz-option-label');
        if (parentLabel) {
          parentLabel.classList.add('is-selected');
        }
      }
      updateProgress();
    });
  });

  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const scores = {};
    Object.keys(CAREER_DATA).forEach((k) => {
      scores[k] = 0;
    });

    let firstUnansweredCard = null;

    questionCards.forEach((card, index) => {
      const questionNumber = index + 1;
      const selectedRadio = quizForm.querySelector(`input[name="q${questionNumber}"]:checked`);

      if (!selectedRadio) {
        card.classList.add('has-error');
        if (!firstUnansweredCard) {
          firstUnansweredCard = card;
        }
      } else {
        card.classList.remove('has-error');
        const primaryKey = selectedRadio.value;
        const secondaryKey = selectedRadio.getAttribute('data-secondary');

        if (scores[primaryKey] !== undefined) {
          scores[primaryKey] += 2;
        }
        if (secondaryKey && scores[secondaryKey] !== undefined) {
          scores[secondaryKey] += 1;
        }
      }
    });

    if (firstUnansweredCard) {
      if (errorBanner) {
        errorBanner.classList.remove('hidden');
      }
      const headerOffset = 95;
      const elementPosition = firstUnansweredCard.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      return;
    }

    if (errorBanner) {
      errorBanner.classList.add('hidden');
    }

    const sortedCareers = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const topMatchKey = sortedCareers[0];
    const runnerUpKey = sortedCareers[1];

    renderQuizResults(topMatchKey, runnerUpKey, scores, totalQuestions);
  });

  const resetQuiz = () => {
    quizForm.reset();
    questionCards.forEach((card) => {
      card.classList.remove('is-answered', 'has-error');
      card.querySelectorAll('.quiz-option-label').forEach((lbl) => {
        lbl.classList.remove('is-selected');
      });
    });

    if (errorBanner) errorBanner.classList.add('hidden');
    if (resultsSection) resultsSection.classList.add('hidden');

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (retakeBtn) {
    retakeBtn.addEventListener('click', resetQuiz);
  }
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', resetQuiz);
  }

  updateProgress();
}

function renderQuizResults(topKey, secondKey, scores, totalQuestions) {
  const resultsSection = document.getElementById('quiz-results-section');
  if (!resultsSection) return;

  const primaryCareer = CAREER_DATA[topKey];
  const secondaryCareer = CAREER_DATA[secondKey];

  const totalPointsAwarded = Object.values(scores).reduce((sum, val) => sum + val, 0) || 1;
  const topMatchPercent = Math.min(98, Math.max(72, Math.round((scores[topKey] / (totalQuestions * 1.4)) * 100)));
  const secondMatchPercent = Math.min(89, Math.max(52, Math.round((scores[secondKey] / (totalQuestions * 1.4)) * 100)));

  const iconEl = document.getElementById('result-career-icon');
  const badgeEl = document.getElementById('result-match-badge');
  const titleEl = document.getElementById('result-career-title');
  const taglineEl = document.getElementById('result-career-tagline');
  const descEl = document.getElementById('result-career-desc');
  const skillsContainer = document.getElementById('result-career-skills');
  const stepsList = document.getElementById('result-career-steps');
  const detailsBtn = document.getElementById('result-details-link');
  const roadmapBtn = document.getElementById('result-roadmap-link');
  const resourcesBtn = document.getElementById('result-resources-link');

  if (iconEl) {
    iconEl.src = primaryCareer.icon;
    iconEl.alt = `${primaryCareer.title} Icon`;
  }
  if (badgeEl) badgeEl.textContent = `${topMatchPercent}% Profile Affinity — Top Recommendation`;
  if (titleEl) titleEl.textContent = primaryCareer.title;
  if (taglineEl) taglineEl.textContent = primaryCareer.tagline;
  if (descEl) descEl.textContent = primaryCareer.description;

  if (skillsContainer) {
    skillsContainer.innerHTML = primaryCareer.skills
      .map((skill) => `<span class="tag">${skill}</span>`)
      .join('');
  }

  if (stepsList) {
    stepsList.innerHTML = primaryCareer.beginnerSteps
      .map((step) => `<li>${step}</li>`)
      .join('');
  }

  if (detailsBtn) detailsBtn.href = primaryCareer.detailsUrl;
  if (roadmapBtn) roadmapBtn.href = primaryCareer.roadmapUrl;
  if (resourcesBtn) resourcesBtn.href = primaryCareer.resourcesUrl;

  const secondTitleEl = document.getElementById('runner-up-title');
  const secondPercentEl = document.getElementById('runner-up-percent');
  const secondLinkEl = document.getElementById('runner-up-link');

  if (secondTitleEl) secondTitleEl.textContent = secondaryCareer.title;
  if (secondPercentEl) secondPercentEl.textContent = `${secondMatchPercent}% Affinity`;
  if (secondLinkEl) secondLinkEl.href = secondaryCareer.detailsUrl;

  const breakdownContainer = document.getElementById('result-score-breakdown');
  if (breakdownContainer) {
    const orderedKeys = Object.keys(CAREER_DATA)
      .sort((a, b) => scores[b] - scores[a])
      .slice(0, 8);
    breakdownContainer.innerHTML = orderedKeys
      .map((key) => {
        const career = CAREER_DATA[key];
        const count = scores[key];
        const pct = Math.min(100, Math.round((count / totalPointsAwarded) * 190));
        return `
          <div class="breakdown-row">
            <div class="breakdown-label">
              <span>${career.title}</span>
              <span class="breakdown-score">${count} pts</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  resultsSection.classList.remove('hidden');

  setTimeout(() => {
    const headerOffset = 85;
    const elementPosition = resultsSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }, 100);
}

window.initCareerQuiz = initCareerQuiz;
