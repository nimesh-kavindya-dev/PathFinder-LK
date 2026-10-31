# PathFinder LK — IT Career Guidance Platform

> **Module**: IS 1106 – Foundations of Web Technologies  
> **Assignment**: Semester 1 Group Web Project (Community-Focused Static Website)  
> **GitHub Repository**: [https://github.com/nimesh-kavindya/pathfinder-lk](https://github.com/nimesh-kavindya/pathfinder-lk)  
> **Live Website URL**: [[https://nimesh-kavindya.github.io/pathfinder-lk/](https://nimesh-kavindya.github.io/pathfinder-lk/)  

---

## 1. Project Introduction & Purpose

**PathFinder LK** is a responsive, accessible, community-oriented static web platform designed specifically for Sri Lankan university undergraduates pursuing degrees in Computing, Information Systems (IS), Software Engineering (SE), and Information Technology (IT).

### The Challenge
While university degree curricula provide strong theoretical and computational foundations, undergraduates frequently face uncertainty regarding industry specializations, required tools, and practical project expectations. Many students spend valuable time learning mismatched frameworks or delay career exploration until their final year.

### Our Purpose
PathFinder LK bridges the divide between university lecture halls and the practical requirements of the Sri Lankan technology export industry. The platform empowers students to:
* Explore the **top 5 in-demand IT specializations** in Sri Lanka.
* Assess their strengths with a **9-question interactive career match quiz**.
* Follow **milestone-based 6-stage learning roadmaps** aligned with university degree progression.
* Access **100% free, curated learning resources** and verified student developer benefits.
* Engage with interactive, accessible web design built strictly with foundational web technologies.

---

## 2. Main Website Features

The website contains eight interconnected, fully responsive sections:

1. **Home Page (`index.html`)**
   * Accessible skip-to-content navigation landmark.
   * Hero banner featuring brand highlights, introduction, and calls-to-action.
   * About Section explaining the platform's educational mission and value for undergraduates.
   * Popular Careers preview showcasing the 5 core IT tracks with skill tags.
   * How It Works section breaking down the 5-step career navigation process.
   * Call-to-action banner and university-tailored 4-column footer.

2. **Explore Careers & Catalog (`careers.html`)**
   * Visual directory of the 5 IT disciplines.
   * Side-by-side **Academic Career Comparison Matrix** evaluating focus, coding intensity, mathematical prerequisites, industry tooling, and Sri Lankan entry-level job titles.

3. **Detailed Career Profiles (`career-details.html`)**
   * In-depth specialization profiles covering all 9 academic dimensions:
     1. Career Introduction
     2. Job Role
     3. Main Responsibilities
     4. Required Technical Skills
     5. Required Soft Skills
     6. Common Tools & Technologies
     7. Educational Background & Learning Path
     8. Career Ladder & Long-term Growth
     9. Entry-Level Opportunities in Sri Lanka
   * Sticky role switcher navigation bar with smooth deep-linking (`?career=...#...`).

4. **Interactive Career Match Quiz (`quiz.html`)**
   * 9-question diagnostic questionnaire covering algorithmic problem-solving, daily tasks, coding comfort, database preferences, design aesthetics, cybersecurity defense, portfolio project goals, coursework favorites, and emerging technologies.
   * Live visual progress indicator and completion percentage.
   * Client-side validation preventing unanswered submissions with smooth auto-scrolling to incomplete questions.
   * Weighted scoring engine with automatic tie detection (*Close Career Alignment* alert).
   * Dynamic recommendation result card with role justification, skills checklist, direct roadmap links, and quiz restart capability.

5. **Step-by-Step Learning Roadmaps (`roadmaps.html`)**
   * 5 dedicated roadmap tracks (Software Engineer, Data Analyst, Data Engineer, Cybersecurity Analyst, UI/UX Designer).
   * **6 progressive learning stages per career** (e.g. Programming Fundamentals &rarr; Data Structures &rarr; Web Development &rarr; Databases &rarr; Software Projects &rarr; Portfolio & Internship Readiness).
   * Collapsible accordion stages with directional indicators.
   * Global *"Expand All Stages"* / *"Collapse All Stages"* toggle control.

6. **Curated Free Learning Resources (`resources.html`)**
   * Curated catalog of 10 verified free learning platforms (freeCodeCamp, W3Schools, MDN Web Docs, Kaggle Learn, Cisco Networking Academy, Figma Learn, SQLBolt, Bandit Wargames, CS50 Harvard, and Roadmap.sh).
   * Spotlight section on **Student Developer Perks** (GitHub Student Developer Pack, JetBrains Educational Licenses, and Figma for Education).
   * All external links open safely in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.

7. **Search & Filter System (`careers.html` & `resources.html`)**
   * Real-time search by role name, tool keywords, and technical descriptions.
   * Filter pills by career discipline (*Development*, *Data & AI*, *Cybersecurity*, *UI/UX Design*).
   * Combined dual-mode filtering logic.
   * Dedicated *"Clear Filters"* buttons and live result counters (`Showing X of Y`).
   * Informative empty-state cards with one-click reset buttons.

8. **Contact & Student Inquiries (`contact.html`)**
   * Client-side form validation verifying Full Name, RFC-compliant Email format, University selector, Subject, and minimum 15-character Message.
   * Live character counter for message input.
   * Explicit educational static website disclaimer banner.
   * Undergraduate Frequently Asked Questions (FAQ) accordion.
   * Accessible submission confirmation summary without storing sensitive credentials.

---

## 3. Technologies Used

In strict adherence to the **IS 1106 Group Web Project Guidelines**:
* **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<footer>`, `<fieldset>`, `<legend>`), accessible tables, and forms.
* **CSS3**: CSS Custom Properties (Design System variables), CSS Flexbox, CSS Grid, mobile-first responsive media queries, and accessible focus states.
* **Vanilla JavaScript (ES6+)**: Pure client-side logic for mobile navigation toggle, DOM manipulation, live search/filtering, questionnaire scoring, accordion controls, and form validation.
* **SVG Vector Assets**: Scalable vector brand logo, hero illustration, and career iconography for high-DPI displays.
* **Zero Backend / Zero Database**: Fully static architecture with 100% client-side execution, zero external dependencies (no Bootstrap, jQuery, React, or server-side scripts), ensuring maximum compatibility with GitHub Pages.

---

## 4. Project Folder Structure

```text
PathFinderLK/
├── index.html                  # Home page
├── careers.html                # Explore Careers catalog & comparison table
├── career-details.html         # Comprehensive career specialization profiles
├── quiz.html                   # Interactive Career Match Quiz
├── roadmaps.html               # 6-Stage IT career learning roadmaps
├── resources.html              # Curated free learning resources & student perks
├── contact.html                # Contact inquiry form & student FAQ
│
├── css/
│   ├── style.css               # Design system tokens, typography, header, footer, layouts
│   ├── components.css          # Buttons, cards, badges, search bars, tables, accordions, quiz
│   └── responsive.css          # Responsive media queries (1024px, 992px, 768px, 480px)
│
├── js/
│   ├── main.js                 # Mobile menu toggle, keyboard accessibility, active nav highlighting
│   ├── careers.js              # Live search & domain filter for careers; role switcher jump logic
│   ├── quiz.js                 # 9-question quiz logic, validation, scoring, tie handling, reset
│   ├── roadmaps.js             # Roadmap track tabs, stage accordions, expand-all toggle
│   ├── resources.js            # Live search, domain filtering, and clear filters for resources
│   └── validation.js           # Client-side form validation, regexes, counter, confirmation state
│
├── assets/
│   ├── icons/
│   │   └── logo.svg            # PathFinder LK compass brand logo
│   └── images/
│       ├── hero/
│       │   └── hero-illustration.svg # Hero section vector graphic
│       └── careers/
│           ├── software-engineer.svg # Software Engineer career icon
│           ├── data-analyst.svg      # Data Analyst career icon
│           ├── data-engineer.svg     # Data Engineer career icon
│           ├── cybersecurity.svg     # Cybersecurity Analyst career icon
│           └── ui-ux.svg             # UI/UX Designer career icon
│
├── .gitignore                  # Git ignore rules for OS artifacts and IDE directories
└── README.md                   # Complete project documentation and deployment guide
```

---

## 5. Instructions to Run Locally

You can run PathFinder LK on your local machine using any of the following methods without installing heavy build tools:

### Option A: Direct Browser Launch (Simplest)
1. Clone or download the repository to your computer.
2. Locate the project folder and double-click `index.html`.
3. The website will open directly in your default web browser (Chrome, Edge, Firefox, or Safari).

### Option B: Visual Studio Code Live Server (Recommended for Development)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension by *Ritwick Dey* (Extension ID: `ritwickdey.LiveServer`).
3. Right-click `index.html` in the VS Code file explorer.
4. Select **"Open with Live Server"**.
5. The platform will automatically launch at `http://127.0.0.1:5500/index.html`.

### Option C: Python Simple HTTP Server
If Python is installed on your machine:
```bash
# Navigate to the project root directory
cd PathFinderLK

# Start local HTTP server
python -m http.server 8000
```
Open your browser and visit `http://localhost:8000`.

### Option D: Node.js Serve
If Node.js is installed on your machine:
```bash
# Navigate to the project root directory
cd PathFinderLK

# Serve static directory
npx serve .
```

---

## 6. GitHub Pages Deployment Guide

Follow these steps to deploy PathFinder LK for free on GitHub Pages:

1. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete PathFinder LK static web project for university submission"
   ```

2. **Create GitHub Repository**:
   * Log in to [GitHub](https://github.com/).
   * Click the **"+"** icon in the top right and select **"New repository"**.
   * Set Repository name to `pathfinder-lk`.
   * Keep the repository **Public**.
   * Leave "Add a README file" unchecked (we already have a complete README).
   * Click **"Create repository"**.

3. **Link Local Repository & Push**:
   ```bash
   git remote add origin https://github.com/<your-username>/pathfinder-lk.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   * In your GitHub repository, click on **Settings** (tab with gear icon).
   * In the left sidebar, click on **Pages** (under the "Code and automation" section).
   * Under **Build and deployment**:
     * **Source**: Select `Deploy from a branch`.
     * **Branch**: Select `main` from the dropdown and leave the folder set to `/(root)`.
   * Click **Save**.

5. **Access Your Live Website**:
   * GitHub Pages will build and deploy the site in approximately 1–2 minutes.
   * Refresh the Settings &rarr; Pages page to see the live banner:  
     `Your site is live at https://nimesh-kavindya.github.io/pathfinder-lk/`

---

## 7. Group & Academic Context

* **Course Unit**: IS 1106 – Foundations of Web Technologies
* **Academic Level**: Undergraduate Degree Program, Semester 1
* **Project Type**: Group Web Project (Static Website)
* **Team**: PathFinder LK Student Group
* **Evaluation Focus**: Semantic HTML5 markup, CSS3 responsive styling, Vanilla JavaScript interactive functionality, web accessibility (WCAG 2.1 AA), search engine optimization (SEO), code structure, and GitHub Pages deployment.

---

*&copy; 2026 PathFinder LK. Built for university students. 100% Static &bull; Pure HTML5, CSS3 &amp; Vanilla JavaScript.*
