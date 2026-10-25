export const profile = {
  name: "Sean Villanueva",
  email: "villanuevasean0918@gmail.com",
  phone: "09472401814",
  phoneHref: "tel:+639472401814",
  location: "Bulacan, Philippines",
  role: "Junior Web Developer",
  school: "Immaculate Conception I-College of Arts and Technology",
  degree: "Bachelor of Science in Information Systems",
  section: "BSIS 4-1",
  graduation: "May 2027",
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
  technologies: ["PHP", "CodeIgniter 3", "MySQL", "HTML", "CSS", "Bootstrap", "JavaScript", "jQuery/AJAX"],
} as const;
