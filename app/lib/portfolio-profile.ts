export const profile = {
  name: "Sean Villanueva",
  fullName: "Sean Warren M. Villanueva",
  email: "villanuevasean0918@gmail.com",
  phone: "09472401814",
  phoneHref: "tel:+639472401814",
  location: "Santa Maria, Bulacan, Philippines",
  role: "Junior Web Developer",
  school: "Immaculate Conception I-College of Arts and Technology",
  degree: "Bachelor of Science in Information Systems",
  educationPeriod: "2023–Present",
  section: "BSIS 4-1",
  yearOfStudy: 4,
  programYears: 4,
  // Short topics shown as chips on the education card. Replace with your actual coursework if you prefer.
  studyFocus: ["Web development", "Database integration", "Debugging"],
  availability: "Open to junior web developer roles",
  // Set to e.g. "/images/sean.jpg" to show your photo on the education card (with an animated ring).
  // While it is null, the card leads with the degree title instead.
  photoSrc: null as string | null,
  resumeHref: "/downloads/Sean_Villanueva_Resume.docx",
  portfolioHref: "/downloads/Sean_Villanueva_Portfolio.docx",
} as const;

export const pharmacyProject = {
  name: "Pharxmaco",
  title: "Development of an Online Point of Sale and Inventory System for Pharxmaco Drugstore with Sales Forecasting",
  period: "2025–2026",
  status: "Ongoing development",
  role: "Web developer · Team project",
  liveHref: "https://silver-fly-191014.hostingersite.com/",
  technologies: ["PHP", "CodeIgniter 4", "MySQL", "HTML", "CSS", "JavaScript", "jQuery/AJAX"],
} as const;
