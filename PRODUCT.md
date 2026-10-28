# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** recruiters and hiring teams evaluating Sean Villanueva for junior web developer roles. They need to understand his skills, assess evidence of his work, review his resume, and contact him.
- **Secondary:** instructors evaluating his coursework and capstone. They need an accurate account of the project, his role, and his individual contributions.

The user confirmed both audiences, with hiring teams taking priority.

## Product Purpose

A personal portfolio for Sean Warren M. Villanueva, a fourth-year Bachelor of Science in Information Systems student and junior web developer based in Santa Maria, Bulacan, Philippines.

The site connects his education and technical skills to his real project work. A successful visit lets someone understand what Sean contributed, examine the available project evidence, download the relevant documents, and reach him about an opportunity or assessment.

## Positioning

Sean's work spans front-end and back-end contributions to the ongoing Pharxmaco Drugstore team project, using PHP, CodeIgniter 4, MySQL, HTML, CSS, JavaScript, and jQuery/AJAX. His documented experience includes sales and inventory features, user access, database integration, SQL queries, CRUD operations, debugging, and interface improvements.

Present this as demonstrated student and junior developer experience. Distinguish Sean's contributions from the team's complete system and from features named only in the overall project title.

## Operating Context

- The portfolio is a browser-based website for desktop and mobile visitors, without a visitor sign-in requirement.
- The existing home page links to the work, about, and contact sections. Visitors can review the featured project, education, and skills; download documents; and use email or phone contact actions.
- The supplied Pharxmaco URL opens the pharmacy system's staff sign-in page. It is a separate application from this personal portfolio. A sign-in page does not provide public access to the authenticated system or establish that demo credentials are available.
- Email actions use the visitor's email client, and phone actions use the device's dialer.
- The codebase is an existing React and TypeScript application with Next.js-compatible routing through Vinext/Vite. The local development command is `npm run dev`; the entry page is `app/page.tsx`, with the document shell in `app/layout.tsx`.

## Capabilities and Constraints

- Feature the real Pharxmaco project and Sean's confirmed responsibilities. It is an ongoing team project dated 2025-2026, not a completed solo commercial product.
- Preserve the distinction between the project's full title, which includes sales forecasting, and Sean's personally documented contributions. Do not attribute forecasting implementation to him without additional evidence.
- The project visual is a labeled project map, not an application screenshot or an interactive copy of the pharmacy system.
- Keep the supplied resume and project portfolio available through the existing download links. Their website sources are the Word documents in `public/downloads/`.
- Use `app/lib/portfolio-profile.ts` as the implementation source for identity, contact details, education, document paths, and project metadata. Keep visible copy and downloadable documents consistent with confirmed information.
- Retain the supplied intro animation and its skip behavior as existing functionality. Future changes should keep the portfolio reachable without waiting for the full sequence.
- The current portfolio does not require its own database or a paid animation service.

## Brand Commitments

- Use **Sean Villanueva** as the public-facing name and **Sean Warren M. Villanueva** where the full name is appropriate.
- Preserve accurate first-person descriptions of his work, current junior developer positioning, and attribution to the project team.
- Treat supplied personal documents, the existing wordmark and icon, and the user-supplied intro as established assets. Their presence does not authorize new claims about employment, clients, or project outcomes.

## Evidence on Hand

- `app/lib/portfolio-profile.ts`: profile, education, contact information, download paths, and Pharxmaco metadata.
- `app/page.tsx`: personal introduction, education, skills, and the stated front-end and back-end contributions.
- `components/ui/pharmacy-project.tsx`: featured project, contribution overview, project map, external project link, and project-brief download.
- `public/downloads/Sean_Villanueva_Resume.docx`: supplied resume available to visitors.
- `public/downloads/Sean_Villanueva_Portfolio.docx`: supplied project portfolio available to visitors.
- `outputs/en3b-prefinals/`: working copies of the supplied academic documents, with provenance recorded in `START_HERE.md`.
- `components/ui/intro-loader.tsx` and its stylesheet: the integrated user-supplied intro animation.
- `README.md`: existing project scope, local workflow, document provenance, and explanations of the team's project versus Sean's individual role.

No verified client testimonials, employment history, usage statistics, business results, or awards have been supplied as portfolio evidence. Do not fabricate them or add fictional projects to fill the page.

## Product Principles

1. Make the actual work and Sean's individual contribution easy to assess.
2. Give hiring teams priority while retaining useful evidence for academic evaluation.
3. Keep claims, project status, contact details, and documents consistent with their confirmed sources.
4. Make reviewing work, obtaining documents, and contacting Sean straightforward.
5. Preserve access to content when visitors reduce or pause motion, use a keyboard, or cannot run WebGL.

## Accessibility & Inclusion

- Preserve operating-system reduced-motion support and the site's motion pause controls.
- Keep the intro skippable with its button, click behavior, and Escape key; release any scroll or interaction lock when it finishes or is skipped.
- Preserve keyboard-accessible navigation, visible focus, skip links, and menu dismissal behavior.
- Keep core content readable and usable across mobile and desktop sizes, with a static fallback when WebGL is unavailable.
- No additional audience-specific accessibility requirement or conformance certification has been established. Do not imply that an accessibility standard has been audited or certified.
