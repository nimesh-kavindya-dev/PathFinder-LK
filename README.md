# PathFinder LK — IT Career Guidance Platform for University Students

**PathFinder LK** is a modern, open-source IT career guidance web platform (with mobile PWA & offline capability) designed to help Sri Lankan university undergraduates explore high-demand technology roles, identify required technical skills, follow structured 6-stage learning roadmaps, and access 100% free global educational resources.

- **Official GitHub Repository**: [https://github.com/nimesh-kavindya-dev/pathfinder-lk](https://github.com/nimesh-kavindya-dev/pathfinder-lk)
- **Issue Tracker & Resource Suggestions**: [https://github.com/nimesh-kavindya-dev/pathfinder-lk/issues](https://github.com/nimesh-kavindya-dev/pathfinder-lk/issues)

---

## Key Platform Features

1. **9 In-Depth IT Career Pathways (`careers.html` & `career-details.html`)**
   - **Software Engineer** (Backend systems, APIs, OOP, Data Structures)
   - **Full-Stack Web Developer** (TypeScript, React/Next.js, Node.js, PostgreSQL)
   - **Cloud & DevOps Engineer** (Linux, Docker, Kubernetes, AWS/Azure, Terraform, CI/CD)
   - **Data Analyst** (SQL, Excel, Power BI/Tableau, Python Pandas, Business KPIs)
   - **Data Engineer** (ETL/ELT pipelines, Dimensional Warehousing, dbt, Apache Airflow, PySpark)
   - **Data Scientist & AI Engineer** (Statistical modeling, Scikit-Learn, PyTorch, Applied AI/RAG)
   - **Cybersecurity Analyst** (Networking, OS Hardening, OWASP Top 10, SIEM & SOC Defense)
   - **UI/UX Designer** (User research, Wireframing, Figma Auto Layout, Design Systems, WCAG)
   - **QA & Test Automation Engineer** (Playwright, Postman API automation, Performance Testing, CI quality gates)

2. **Interactive 9-Question Career Match Quiz (`quiz.html` & `js/quiz.js`)**
   - Evaluates student preferences across all 9 IT career pathways using primary and secondary affinity weights.
   - Displays instant primary and runner-up career matches, recommended beginner steps, and a visual affinity breakdown.

3. **54 Structured Learning Stages (`roadmaps.html` & `js/roadmaps.js`)**
   - Interactive 6-stage progression roadmaps for each of the 9 career pathways with Expand/Collapse controls and deep-link URL support (`?career=cloud-devops`, etc.).

4. **Curated Free Learning Resources & Student Packs (`resources.html` & `js/resources.js`)**
   - Real-time search, domain category filtering, and difficulty filtering across 12+ verified 100% free learning platforms (CS50x, freeCodeCamp, The Odin Project, MDN, Kaggle Learn, SQLBolt, Microsoft Learn, AWS Skill Builder, TryHackMe, Cisco NetAcad, Figma Learn, Test Automation University) plus university `.ac.lk` student developer packs.

5. **Glassmorphic Dual-Theme Design System & Branded Loading Screen (`js/main.js`, `css/*`)**
   - Translucent frosted-glass UI cards (`backdrop-filter: blur(18px) saturate(180%)`), ambient glowing background orbs, and persistent Dark/Light theme toggle stored in `localStorage` (`pathfinder-theme`).
   - Animated glassmorphic loading screen with orbital compass ring and live percentage progress indicator.

6. **Mobile-First PWA Capability & Native-Style Bottom Navigation Dock (`manifest.json`, `sw.js`, `js/main.js`)**
   - Installable Progressive Web App with offline caching service worker, compliant 192x192 & 512x512 icons, in-app install button, and a floating glassmorphic mobile bottom navigation bar for one-thumb navigation on phones (`<= 768px`).

7. **Open-Source Community Hub & Student FAQ (`contact.html`)**
   - Direct GitHub collaboration channels (`https://github.com/nimesh-kavindya-dev/pathfinder-lk`), Project Collaborators showcase, and an interactive Student Career Planning FAQ accordion.

---

## Local Development

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`.
