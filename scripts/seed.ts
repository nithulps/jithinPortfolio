/**
 * Seed the database with the portfolio's initial content.
 * Run with:  npm run seed
 *
 * Idempotent: re-running updates existing records (matched by slug / key).
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import { Project } from "../models/Project";
import { Service } from "../models/Service";
import { About } from "../models/About";

const ICON_MANUAL = `<svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763,0-31.78516,7.5-42.667,20.625L2.67529,210.78125a16.001,16.001,0,0,0,10.51831,26.71875l84.08344,7.15625a224.56,224.56,0,0,0-11.35156,32.1875l-38.31445,101.5625a16.001,16.001,0,0,0,19.67187,20.28125L168.85522,359.05469a224.56,224.56,0,0,0,32.1875-11.35156l7.15625,84.08344a16.001,16.001,0,0,0,26.71875,10.51831L296.59473,392.828c13.125-10.88184,20.625-26.31934,20.625-42.667V245.04688C390.0459,198.832,445.24731,136.92578,445.24731,33.69434,445.24731,8.59375,445.24731,0,445.24731,0,453.12451,0,505.12019,19.09375,505.12019,19.09375ZM384,128a32,32,0,1,1,32-32A32.0001,32.0001,0,0,1,384,128Z"></path></svg>`;
const ICON_AUTOMATION = `<svg aria-hidden="true" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.8 6.4-8.5 10-14.9 8.2zm-114.6-176.2l29.4-28.8c4.8-4.7 4.9-12.4.2-17.1L115.8 228l78.1-61.4c4.7-4.7 4.6-12.4-.2-17.1l-29.4-28.8c-4.7-4.6-12.3-4.6-17-.1L41 228c-4.7 4.6-4.7 12.2 0 16.8l106.3 90.5c4.7 4.5 12.3 4.5 17 0zm406.1-90.5L464 135.6c-4.7-4.6-12.3-4.6-17 .1l-29.4 28.8c-4.8 4.7-4.9 12.4-.2 17.1l78.1 61.4-78.1 61.4c-4.7 4.7-4.6 12.4.2 17.1l29.4 28.8c4.7 4.6 12.3 4.6 17 .1L570.3 244.9c4.7-4.7 4.7-12.3 0-17z"></path></svg>`;
const ICON_API = `<svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"></path></svg>`;

const projects = [
  {
    slug: "e-commerce-platform-qa",
    title: "E-Commerce Platform QA",
    category: "Test Automation",
    tags: ["Test Automation"],
    excerpt:
      "Designed and implemented a comprehensive end-to-end testing framework for a large-scale e-commerce platform using Selenium and Cypress.",
    description:
      "I designed and implemented a comprehensive end-to-end testing framework for a large-scale e-commerce platform using Selenium and Cypress, covering checkout flows, payment gateways, and inventory management modules.\n\nThe suite ran on a CI/CD pipeline and dramatically reduced regressions reaching production.",
    coverImage:
      "https://aerukart.com/wp-content/uploads/2026/04/CRM-Tech-O-Banner-Portfolio.webp",
    client: "Confidential",
    role: "QA Automation Engineer",
    year: "2025",
    featured: true,
    order: 1,
  },
  {
    slug: "mobile-banking-app-testing",
    title: "Mobile Banking App Testing",
    category: "Mobile Testing",
    tags: ["Mobile Testing", "API Testing", "Performance", "Automation"],
    excerpt:
      "Led the QA effort for a mobile banking application, building an Appium-based automation suite for iOS and Android.",
    description:
      "Led the QA effort for a mobile banking application, building an Appium-based automation suite for iOS and Android.\n\nPerformed extensive API testing with Postman and load testing with JMeter to ensure transaction reliability.",
    coverImage:
      "https://aerukart.com/wp-content/uploads/2025/07/BANDY-IMAGE-PORTFOLIO.webp",
    client: "Confidential",
    role: "Lead QA Engineer",
    year: "2025",
    featured: true,
    order: 2,
  },
  {
    slug: "healthcare-portal-automation",
    title: "Healthcare Portal Automation",
    category: "Manual Testing",
    tags: ["Manual Testing"],
    excerpt:
      "Developed a robust test automation framework for a healthcare management portal handling patient records and appointment scheduling.",
    description:
      "Developed a robust test automation framework for a healthcare management portal handling patient records, appointment scheduling, and insurance claims.\n\nAchieved 85% test coverage with a CI/CD integrated pipeline.",
    coverImage:
      "https://aerukart.com/wp-content/uploads/2025/07/ACADEMY-RIVALS-IMAGE-PORTFOLIO.webp",
    client: "Confidential",
    role: "QA Engineer",
    year: "2024",
    featured: true,
    order: 3,
  },
  {
    slug: "saas-dashboard-regression",
    title: "SaaS Dashboard Regression",
    category: "Regression Testing",
    tags: ["Regression Testing"],
    excerpt:
      "Built and maintained a comprehensive regression testing suite for a SaaS analytics dashboard, automating 200+ test cases with Cypress.",
    description:
      "Built and maintained a comprehensive regression testing suite for a SaaS analytics dashboard. Automated 200+ test cases using Cypress with custom reporting, reducing regression cycle time by 60%.",
    coverImage:
      "https://aerukart.com/wp-content/uploads/2025/10/TOPCOACH-IMAGE-PORTFOLIOa-1.webp",
    client: "Confidential",
    role: "QA Automation Engineer",
    year: "2025",
    featured: true,
    order: 4,
  },
];

const services = [
  {
    slug: "manual-testing",
    title: "Manual Testing",
    icon: ICON_MANUAL,
    shortDescription:
      "Thorough exploratory and scripted manual testing to uncover edge cases and usability issues automated tests can miss.",
    longDescription:
      "Thorough exploratory and scripted manual testing to uncover edge cases and usability issues that automated tests can miss. I ensure your product delivers a seamless user experience across devices and browsers.",
    features: ["Exploratory testing", "Test case design", "Usability & accessibility checks", "Cross-browser testing"],
    order: 1,
  },
  {
    slug: "test-automation",
    title: "Test Automation",
    icon: ICON_AUTOMATION,
    shortDescription:
      "Robust, scalable automation frameworks using Selenium, Cypress, and Playwright that integrate into your CI/CD pipeline.",
    longDescription:
      "Build robust, scalable automation frameworks using Selenium, Cypress, and Playwright. I design maintainable test suites that integrate seamlessly into your CI/CD pipeline.",
    features: ["Selenium / Cypress / Playwright", "Page Object Model architecture", "CI/CD integration", "Custom reporting"],
    order: 2,
  },
  {
    slug: "api-performance-testing",
    title: "API & Performance Testing",
    icon: ICON_API,
    shortDescription:
      "Validate API endpoints with Postman and RestAssured, and stress-test your systems with JMeter and k6.",
    longDescription:
      "Validate API endpoints with Postman and RestAssured, and stress-test your systems with JMeter and k6. I identify bottlenecks and ensure your application scales under real-world load.",
    features: ["REST & GraphQL testing", "Load & stress testing", "Bottleneck analysis", "Postman / JMeter / k6"],
    order: 3,
  },
];

const about = {
  key: "main",
  name: "JITHIN",
  heroPhrases: ["MANUAL & AUTOMATION", "API & PERFORMANCE", "SELENIUM & CYPRESS"],
  heroDescription:
    "I deliver comprehensive software testing solutions - from manual QA to full automation frameworks. I help teams build reliable, bug-free products with confidence through systematic testing and quality assurance.",
  headline:
    "Hello! I'm Jithin and I'm a Software Test Engineer and QA Specialist passionate about quality. I love to test",
  aboutPhrases: ["and automate.", "and optimize.", "and deliver quality."],
  bioParagraphs: [
    "My journey in software testing started with a deep curiosity for <b>how things break</b>. Over the years, I've developed expertise in <b>manual testing, test automation, and performance engineering</b>. I specialize in building robust testing frameworks using <b>Selenium, Cypress, and Playwright</b>.",
    "With experience across <b>e-commerce, fintech, healthcare, and SaaS</b> domains, I bring a thorough, detail-oriented approach to every project. I believe great software isn't just about features - it's about <b>reliability, performance, and user trust</b>.",
  ],
  image: "https://aerukart.com/wp-content/uploads/2025/10/DOOMIN_PARK-scaled.webp",
  resumeUrl: "",
  competencyText:
    'With deep expertise in <span class="gradient-text">test automation</span> and <span class="gradient-text">quality assurance,</span> I would love to collaborate with you. My goal: to deliver a <span class="gradient-text">bug-free product</span> that meets the highest standards and fully satisfies your users.',
  socials: {
    linkedin: "https://www.linkedin.com/in/jithin",
    github: "https://github.com/jithin",
    twitter: "https://twitter.com/jithin",
    instagram: "https://www.instagram.com/jithin",
  },
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing in .env.local");
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
  console.log("Connected. Seeding…");

  for (const p of projects) {
    await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, setDefaultsOnInsert: true });
  }
  for (const s of services) {
    await Service.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, setDefaultsOnInsert: true });
  }
  await About.findOneAndUpdate({ key: "main" }, about, { upsert: true, setDefaultsOnInsert: true });

  console.log(`Seeded ${projects.length} projects, ${services.length} services, and About content.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
