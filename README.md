# PathFinder LK — Career Guidance Platform for Sri Lankan University Students

**PathFinder LK** is an interactive career guidance web platform designed to help Sri Lankan university students and undergraduates explore career opportunities across Information Technology, Data & AI, Business, Finance, Digital Marketing, Creative Media, and Engineering.

The platform helps students understand career pathways, identify technical and professional skills, follow structured six-stage learning roadmaps, discover portfolio project ideas, and access free learning resources and university student opportunities.

PathFinder LK aims to bridge the gap between university education and industry expectations by bringing career information and structured learning guidance together in one place.

## Project Links

- **Official GitHub Repository:** [pathfinder-lk](https://github.com/nimesh-kavindya-dev/pathfinder-lk)
- **Live Website:** [PathFinder LK](https://nimesh-kavindya-dev.github.io/PathFinder-LK/)
- **Issue Tracker & Suggestions:** [GitHub Issues](https://github.com/nimesh-kavindya-dev/pathfinder-lk/issues)

---

## Key Platform Features

### 1. Explore 15 Career Pathways

**Pages:** `careers.html`, `career-details.html`

PathFinder LK provides 15 career pathways across nine major career domains.

| No. | Career Pathway |
|---:|---|
| 1 | Software Engineer |
| 2 | Full-Stack Developer |
| 3 | Cloud & DevOps Engineer |
| 4 | Data Analyst |
| 5 | Data Engineer |
| 6 | Data Scientist & AI Engineer |
| 7 | Cybersecurity Analyst |
| 8 | UI/UX Product Designer |
| 9 | QA & Test Automation Engineer |
| 10 | Business Analyst & Project Manager |
| 11 | Product Manager |
| 12 | Digital Marketing & Growth Strategist |
| 13 | Financial Analyst & FinTech Specialist |
| 14 | Creative Multimedia & Motion Designer |
| 15 | Mechatronics, Robotics & IoT Engineer |

Career information includes:

- Career overviews and typical job responsibilities.
- Technical and professional skills to develop.
- Recommended beginner technologies and tools.
- Suggested portfolio and practical project ideas.
- Learning sequences and career progression guidance.
- Indicative career entry difficulty and Sri Lankan market-demand information.

The Career Directory also provides search, category filtering, and a side-by-side comparison matrix for the 15 pathways.

### 2. Interactive Career Match Quiz

**Files:** `quiz.html`, `js/quiz.js`

The nine-question Career Match Quiz helps students explore possible career pathways based on their interests and preferences.

Key features:

- Nine scenario-based questions.
- Questions about problem-solving preferences and analytical or creative interests.
- Rule-based scoring across the 15 career pathways.
- Primary and secondary career recommendations.
- A visual career-affinity breakdown.
- Suggested beginner steps, relevant skills, and links to roadmaps.

The quiz is an introductory guidance tool; it is not a professional psychometric assessment.

### 3. Six-Stage Career Roadmaps

**Files:** `roadmaps.html`, `js/roadmaps.js`

Each of the 15 career pathways has a six-stage learning roadmap.

**15 career pathways × 6 stages = 90 learning stages.**

The six stages are:

1. **Core Foundations & Domain Concepts**
2. **Essential Languages, Tools & Workflows**
3. **Frameworks, Architecture & Analysis**
4. **Applied Systems, Security & Quality**
5. **Real-World Projects & Collaboration**
6. **Capstone Portfolio & Internship Preparation**

Roadmaps provide learning topics, recommended technologies, hands-on exercises, practical project milestones, and portfolio guidance.

Interactive features include Expand/Collapse controls, Expand All, Collapse All, and career-specific deep links.

Example:

```text
roadmaps.html?career=cloud-devops
```

### 4. Learning Resources & University Student Benefits

**Files:** `resources.html`, `js/resources.js`

The Resources section groups learning platforms and educational opportunities across multiple professional and technical fields.

Featured resources include:

- Harvard CS50x
- freeCodeCamp
- The Odin Project
- MDN Web Docs
- Kaggle Learn
- SQLBolt
- Microsoft Learn
- AWS Skill Builder
- TryHackMe
- Cisco Networking Academy
- Figma Learn
- Test Automation University
- Atlassian University and Scrum.org
- HubSpot Academy and Google Skillshop
- Corporate Finance Institute (CFI) and edX
- Wokwi IoT Simulator and Blender

Interactive resource features include:

- Search by platform, topic, or skill.
- Domain-based category filtering.
- Learning-difficulty filtering.
- Links to external learning platforms.
- Descriptions of recommended courses and tools.

The platform also highlights student opportunities such as:

- GitHub Student Developer Pack.
- Figma for Education.
- Microsoft Azure for Students.

Availability, free access, certificates, and student benefits depend on each provider's current terms and eligibility requirements. Some providers also offer optional paid services.

### 5. Glassmorphic Design & Dual-Theme System

**Files:** `js/main.js`, `css/style.css`, `css/components.css`, `css/responsive.css`

PathFinder LK uses a consistent visual design system with features such as:

- Glassmorphic interface components and frosted-glass cards.
- CSS backdrop filters and ambient background effects.
- Consistent typography, spacing, and visual hierarchy.
- Dark and Light theme switching.
- Theme preference saved in browser LocalStorage using the `pathfinder-theme` key.
- An animated branded loading screen with an orbital compass ring and progress indicator.

### 6. Progressive Web App (PWA) & Offline Support

**Files:** `manifest.json`, `sw.js`, `js/main.js`

The website includes Progressive Web App capabilities for supported browsers and devices.

Key features include:

- Web App Manifest configuration.
- Installable app experience on supported browsers.
- Service Worker registration.
- Caching of selected website pages and assets.
- Cached-content fallback when the network is unavailable.
- PWA icons in 192×192 and 512×512 sizes, including a maskable icon.
- Responsive layouts and mobile navigation enhancements.

Offline access depends on which resources have been successfully cached while the website is online. Not every external resource or link will be available offline.

### 7. Community Hub & Student FAQ

**File:** `contact.html`

The Community section provides project information and collaboration opportunities.

Features include:

- Project collaborators showcase.
- Link to the GitHub repository.
- Community and project information.
- Student Career Planning FAQ.
- Expand/Collapse FAQ interactions.
- Links for reporting issues and suggesting resources.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic website structure and content |
| CSS3 | Visual styling and responsive layouts |
| JavaScript (ES6+) | Interactive features and client-side functionality |
| CSS Flexbox & Grid | Responsive page layouts |
| Browser LocalStorage | Saving theme preferences |
| Service Workers | Offline caching and fallback behaviour |
| Web App Manifest | PWA configuration |
| Node.js | Local development runtime |
| Express.js | Local static-file development server |
| Git & GitHub | Version control and collaboration |
| GitHub Pages | Public static website hosting |

### Project Architecture

The deployed website is primarily a static frontend application. Express.js is used by the local development server to serve website files. The project does not require an application database or a dedicated backend data-processing system.

---

## Project Folder Structure

```text
PathFinder-LK/
│
├── index.html
├── careers.html
├── career-details.html
├── quiz.html
├── roadmaps.html
├── resources.html
├── contact.html
│
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│   ├── careers.js
│   ├── quiz.js
│   ├── roadmaps.js
│   └── resources.js
│
├── assets/
│   ├── icons/
│   └── images/
│
├── manifest.json
├── sw.js
├── package.json
├── server.js
├── build.mjs
└── README.md
```

---

## Responsive Design, Accessibility & SEO

### Responsive Design

- Mobile-friendly layout considerations.
- CSS Flexbox and CSS Grid.
- Media queries for different screen sizes.
- Responsive navigation and content cards.

### Accessibility

- Semantic HTML elements.
- Meaningful alternative text for images.
- Accessible navigation labels.
- Keyboard-accessible interface controls where supported.
- Skip-to-main-content navigation link.

### Search Engine Optimization

- Descriptive page titles.
- Meta descriptions and relevant keywords.
- Open Graph metadata.
- Organized heading hierarchy.
- Meaningful page content and image descriptions.

---

## Testing & Quality Assurance

Use the following checklist when testing the website. Mark an item as complete only after the relevant test has been performed.

- [ ] Verify all navigation links and page connections.
- [ ] Test Career Directory search and category filters.
- [ ] Complete the Career Match Quiz and inspect its results.
- [ ] Test the career roadmap stages and expand/collapse controls.
- [ ] Verify resource search and filtering.
- [ ] Test Dark and Light theme switching and preference persistence.
- [ ] Verify FAQ expand/collapse functionality.
- [ ] Test mobile navigation and responsive layouts.
- [ ] Check image loading and external links.
- [ ] Test PWA installation and offline caching on supported browsers.
- [ ] Check the deployed website using HTTPS.

Keep screenshots or other evidence of testing performed on the final deployed website.

---

## Team Contributions

PathFinder LK is developed collaboratively by a team of ten university undergraduates.

| Member | Main Responsibility |
|---|---|
| Member 01 | Project Lead, Architecture & Hosting |
| Member 02 | UI/UX Design |
| Member 03 | Frontend Development — Core HTML & Navigation |
| Member 04 | Frontend Development — Content, Tables & Forms |
| Member 05 | CSS Development — Styling & UI Components |
| Member 06 | CSS Development — Layouts & Responsive Design |
| Member 07 | JavaScript Development — Form Validation & Security |
| Member 08 | JavaScript Development — Interactive Features |
| Member 09 | Content, SEO & Accessibility |
| Member 10 | Testing, Quality Assurance & Documentation |

Each member contributes to the project and is expected to understand the overall website structure and functionality, not only their individual task.

---

## Local Development

### Prerequisites

- Node.js
- npm
- A modern web browser
- Git (recommended)

### Installation

Clone the repository:

```bash
git clone https://github.com/nimesh-kavindya-dev/pathfinder-lk.git
```

Navigate to the project directory:

```bash
cd pathfinder-lk
```

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open the following address in your browser:

```text
http://localhost:3000
```

### Available npm Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local development server using `server.js`. |
| `npm run start` | Start the local Express server using `server.js`. |
| `npm run build` | Generate the static build and PWA icons in the `dist/` directory. |
| `npm run lint` | Check the syntax of `server.js` using Node.js. |

---

## Deployment & Hosting

The public website is deployed using GitHub Pages.

**Live Website:** [PathFinder LK](https://nimesh-kavindya-dev.github.io/PathFinder-LK/)

The deployed site is served over HTTPS. PWA installation and offline behaviour depend on browser support and successful service-worker caching.

---

## Future Improvements

Potential future improvements include:

- Sinhala and Tamil language support.
- Additional Sri Lankan internship and career-opportunity resources.
- More local industry and university partnerships.
- Expanded career learning materials.
- Further accessibility improvements.
- More practical portfolio project examples.
- Improved offline access to additional learning content.

---

## Responsible Use of Resources

PathFinder LK references external educational platforms and learning materials to support student development. Users should check each provider's official website for current availability, pricing, certification terms, and eligibility requirements.

Images, icons, educational content, and other external resources should be used in accordance with their respective copyright and licensing conditions.

---

## Project Scope

PathFinder LK is an educational career guidance platform developed to demonstrate practical web technology skills and provide useful career information to university students.

The platform focuses on frontend technologies, client-side interactivity, responsive design, accessibility, SEO, PWA capabilities, testing, and static website deployment. It does not require a database or a dedicated application backend.

---

**PathFinder LK — Navigate Your Future Across Tech, Business & Modern Careers.**
```
