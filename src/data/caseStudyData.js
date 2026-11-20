import { caseStudyPaths, pointNemoPitchUrl } from './routes.js';

const legendOfCeeScreenshots = [
  ['Screenshot 2026-09-23 145910.png', 'Opening area and player HUD'],
  ['Screenshot 2026-09-23 145933.png', 'Outdoor exploration with dynamic lighting'],
  ['Screenshot 2026-09-23 150002.png', 'NPC interaction in the overworld'],
  ['Screenshot 2026-09-23 150034.png', 'Tile-based map navigation'],
  ['Screenshot 2026-09-23 151017.png', 'Interior environment'],
  ['Screenshot 2026-09-23 151202.png', 'Combat encounter'],
  ['Screenshot 2026-09-23 151216.png', 'Enemy encounter and map geometry'],
  ['Screenshot 2026-09-23 151231.png', 'Dungeon exploration'],
  ['Screenshot 2026-09-23 152023.png', 'Environmental interaction'],
  ['Screenshot 2026-09-23 152049.png', 'Dialogue and world state'],
  ['Screenshot 2026-09-23 152238.png', 'Combat arena'],
  ['Screenshot 2026-09-23 152711.png', 'Map transition and exploration'],
  ['Screenshot 2026-09-23 152854.png', 'Late-game environment'],
  ['Screenshot 2026-09-23 153010.png', 'Final encounter setup'],
  ['Screenshot 2026-09-23 153036.png', 'Final boss arena'],
  ['Screenshot 2026-09-23 153115.png', 'Boss battle scene'],
  ['Screenshot 2026-09-23 153745.png', 'Late-game combat sequence'],
  ['Screenshot 2026-09-23 153756.png', 'Boss encounter progression'],
  ['Screenshot 2026-09-23 153807.png', 'Closing gameplay moment'],
].map((/** @type {[file: string, caption: string]} */ [file, caption]) => ({
  image: `/resources/Legend Of Cee/in game screenshots/${file}`,
  webp: `/resources/Legend Of Cee/in game screenshots/${file.replace(/\.png$/, '.webp')}`,
  webpSmall: `/resources/Legend Of Cee/in game screenshots/${file.replace(/\.png$/, '-800.webp')}`,
  imageWidth: 1365,
  imageHeight: 767,
  alt: `Legend Of Cee ${caption.toLowerCase()}`,
  caption,
}));

const pointNemoScreenshots = [
  ['Screenshot 2026-10-10 160125.png', 'Study expedition landing page', 1061, 597],
  ['Screenshot 2026-10-10 160139.png', 'Local-first study concept', 1061, 602],
  ['Screenshot 2026-10-10 160156.png', 'Local PDF library', 1061, 591],
  ['Screenshot 2026-10-10 160216.png', 'Document upload checks', 1064, 601],
  ['Screenshot 2026-10-10 160237.png', 'Sonar question generation', 1062, 599],
].map((/** @type {[file: string, caption: string, width: number, height: number]} */ [file, caption, imageWidth, imageHeight]) => ({
  image: `/resources/AppbuildersPH%20Hackaton%202026/${encodeURIComponent(file)}`,
  webp: `/resources/AppbuildersPH%20Hackaton%202026/${encodeURIComponent(file.replace(/\.png$/, '.webp'))}`,
  webpSmall: `/resources/AppbuildersPH%20Hackaton%202026/${encodeURIComponent(file.replace(/\.png$/, '-800.webp'))}`,
  imageWidth,
  imageHeight,
  alt: `Point Nemo ${caption.toLowerCase()}`,
  caption,
}));

const pnpScreenshot = (role, time, caption, imageHeight) => {
  const source = `/resources/p-idtms/${role}/${encodeURIComponent(`Screenshot 2026-10-12 ${time}`)}`;
  return {
    image: `${source}.png`,
    webp: `${source}.webp`,
    webpSmall: `${source}-800.webp`,
    imageWidth: 1365,
    imageHeight,
    alt: `PNP IDTMS ${caption.toLowerCase()}`,
    caption,
  };
};

const pnpGallerySections = [
  {
    heading: 'Administrator experience',
    description: 'Oversight for attendance, records, evaluations, and program reporting.',
    items: [
      ['admin', '151202', 'Administrator dashboard overview', 599],
      ['admin', '151301', 'Attendance approval queue', 605],
      ['admin', '151320', 'Intern daily time record management', 602],
      ['admin', '151349', 'Document review queue', 603],
      ['admin', '151359', 'Performance evaluation overview', 602],
      ['admin', '151440', 'Program reports and exports', 605],
    ].map(([role, time, caption, imageHeight]) => pnpScreenshot(role, time, caption, imageHeight)),
  },
  {
    heading: 'Intern experience',
    description: 'A personal workspace for attendance, project progress, documents, and evaluations.',
    items: [
      ['intern', '151539', 'Intern dashboard and active tasks', 608],
      ['intern', '151609', 'Daily time record', 605],
      ['intern', '151621', 'Project milestones and deliverables', 604],
      ['intern', '151636', 'Documents and submissions', 602],
      ['intern', '151646', 'Performance evaluation form', 604],
    ].map(([role, time, caption, imageHeight]) => pnpScreenshot(role, time, caption, imageHeight)),
  },
];

const legendOfCeeArt = [
  ['final boss.png', 'Final boss concept', 596, 364],
  ['NPCs 1.png', 'NPC character concepts', 440, 408],
  ['NPCS 2.png', 'NPC dialogue characters', 340, 174],
  ['NPCs 3.png', 'Additional NPC designs', 350, 180],
  ['Monster.png', 'Monster designs', 612, 444],
  ['player - spritesheet 1.png', 'Player sprite sheet', 672, 160],
  ['tilesets.png', 'Tile set and environment pieces', 654, 99],
].map((/** @type {[file: string, caption: string, width: number, height: number]} */ [file, caption, imageWidth, imageHeight]) => ({
  image: `/resources/Legend Of Cee/${file}`,
  imageWidth,
  imageHeight,
  alt: `Legend Of Cee ${caption.toLowerCase()}`,
  caption,
}));

export const caseStudies = {
  pointNemo: {
    path: caseStudyPaths.pointNemo,
    title: 'Point Nemo',
    pageTitle: 'Point Nemo Case Study | Rafhael James Olayres',
    description: 'A local-first study expedition created by team pointnemo for AppBuildersPH Hackathon 2026.',
    kicker: 'AppBuildersPH Hackathon 2026 · team pointnemo',
    lede: 'Point Nemo turns a student’s course material into a local-first expedition: travel through depth zones, meet creatures in turn-based encounters, and study from documents processed on the same computer.',
    actions: [['LinkedIn project pitch', pointNemoPitchUrl], ['GitHub repository', 'https://github.com/Akosidakdok/PointNemo']],
    meta: [
      ['Role', 'Web app contributor'],
      ['Team members', 'Elmer Benitez · Christian James Baldonado · Sean Mark Vasquez · James Olayres'],
      ['Stack', 'React 19 · Vite 7 · TypeScript 5.9 · Express 5 · SQLite'],
    ],
    videoId: 'nf25Q-lphUI',
    videoTitle: 'Point Nemo promo video',
    galleryHeading: 'product screenshots',
    gallery: pointNemoScreenshots,
    architecture: [
      { label: 'library', title: 'Local document library', description: 'Students upload text-based PDFs containing the course material they want to study.' },
      { label: 'sonar', title: 'Document processing', description: 'The local Express API extracts PDF text and validates data before it enters the study flow.' },
      { label: 'questions', title: 'Study content', description: 'Question generation can use local Ollama, with mock and deterministic validation flows also available.' },
      { label: 'expedition', title: 'Depth-zone encounters', description: 'Students progress through depth zones and study with turn-based creature encounters.' },
      { label: 'storage', title: 'On-device persistence', description: 'The local app stores its data in SQLite on the student’s computer.' },
    ],
    blocks: [
      ['The challenge', 'Students bring their own course material, but turning it into a focused study session can feel like more work. Point Nemo makes that material the starting point for an exploration game.'],
      ['My contribution', 'I worked on the web app as part of team pointnemo. My contributions included shaping the landing and study flows, adding a PDF safety gate, refining battle and game-over interactions, and preparing visual effects and handoff documentation.'],
      ['The study flow', 'A student adds a text-based PDF, then the local API extracts and validates its text before generating study questions. Those questions become encounters across ocean depth zones.'],
      ['Designed to stay local', 'The web app, Express API, and SQLite database run on the student’s computer. Runtime text inference uses local Ollama, so the study flow does not send document text, prompts, or answers to a cloud AI service.'],
      ['AI behavior', 'The default Ollama model is qwen2.5:1.5b and can be changed in the environment configuration. Ollama is optional at startup; mock and deterministic flows let the team validate the experience without a running model.'],
      ['Prototype and setup', 'The team built Point Nemo for AppBuildersPH Hackathon 2026. Running it requires Node.js ^20.19.0 or >=22.12.0 and npm. Installing dependencies and downloading an Ollama model require internet access, while saved lessons can be played offline.'],
      ['Credits and art', 'Codex and Gemini assisted development. The repository documents GPT Image 2.5 Sunburst and Flare for optional art and credits the built-in image-generation tool for combat effects; attribution for every final image has not been confirmed. An optional art-generation CLI can call OpenAI’s API, but the running app does not.'],
    ],
  },
  legendOfCee: {
    path: caseStudyPaths.legendOfCee,
    title: 'Legend Of Cee: Shadows Of The Ruined King',
    pageTitle: 'Legend Of Cee Case Study | Rafhael James Olayres',
    description: 'A Java Swing and AWT pixel-art RPG project focused on reliable rendering, collision, persistence, lighting, and cutscene systems.',
    kicker: 'Object-oriented programming project · 2nd year, 1st semester',
    lede: 'A pixel-art 2D RPG built in Java that grew from a learning exercise into a packaged Windows game prototype with exploration, combat, dialogue, lighting, saving, and scripted story sequences.',
    image: '/resources/Legend Of Cee/COVER ART.jpg',
    imageWidth: 556,
    imageHeight: 312,
    alt: 'Legend Of Cee: Shadows Of The Ruined King cover art',
    actions: [
      ['Watch the inspiration playlist', 'https://www.youtube.com/watch?v=om59cwR7psI&list=PL_QPQmz5C6WUF-pOQDsbsKbaBZqXj4qSq'],
    ],
    meta: [
      ['Role', 'Java game developer'],
      ['Platform', 'Windows desktop'],
      ['Stack', 'Java · Swing · AWT · Java 2D · Java Sound'],
    ],
    architecture: [
      { label: 'input', title: 'Player controls', description: 'Keyboard input updates movement and interaction state for the active game world.' },
      { label: 'world', title: 'Maps and entities', description: 'Tile maps, collision bounds, objects, and map-specific entities define the current scene.' },
      { label: 'render', title: 'Complete frame pipeline', description: 'Java 2D draws the map, entities, lighting, cutscenes, and UI into the current frame.' },
      { label: 'persist', title: 'Save data', description: 'The pause menu stores game state in save.dat and confirms the result to the player.' }
    ],
    blocks: [
      ['The starting point', 'Legend Of Cee began as my second-year Object-Oriented Programming project: a Java RPG learning exercise that grew into a playable Windows prototype. As the game expanded, movement, map transitions, lighting, saves, and cutscenes became difficult to debug together.'],
      ['My contribution', 'I implemented and debugged the core game systems across the full experience—from tile-based movement and rendering to map transitions, lighting, save/load, and cutscene dialogue. I also packaged the prototype for Windows.'],
      ['World and movement', 'I built the world from 16 × 16 tiles rendered at 3× scale. Keeping world and screen coordinates separate let the camera follow the player. Collision checks use projected bounds against tiles, map edges, entities, and objects, so movement stays consistent through transitions.'],
      ['Rendering without artifacts', 'I organized drawing into complete frames: clear the buffer, draw the map and entities, apply lighting, then draw cutscenes and UI before Swing paints the frame. This removed stale tiles and partially drawn scenes.'],
      ['State across maps', 'Map transitions now load the right entities and preserve important object placement. Lighting follows the player as the camera moves, while visible loading feedback and save confirmations make file operations easier to understand.'],
      ['Cutscenes and debugging', 'The final encounter uses a state machine for camera movement, dialogue, player restoration, and battle setup. When the dialogue box disappeared, I traced it to drawing through a graphics reference from the previous frame and moved it into the active UI pass.'],
      ['Outcome and learning', 'The playable prototype has more dependable collision, map-specific entities, dynamic lighting, save/load feedback, and scripted dialogue. I also learned to debug game state, world data, and rendering as separate layers. The project can be distributed as a Windows executable with a bundled runtime.'],
      ['Inspiration', 'The project was inspired by Ryisnow\'s Java RPG development playlist. The implementation and game content were developed independently, and the project is not affiliated with or endorsed by Ryisnow.'],
    ],
    gallery: legendOfCeeScreenshots,
    artGallery: legendOfCeeArt,
  },
  pnp: {
    path: caseStudyPaths.pnp,
    title: 'PNP ITMS Internship Attendance System',
    pageTitle: 'PNP ITMS Internship Attendance System | Rafhael James Olayres',
    description: 'A centralized platform for managing PNP ITMS internship attendance, records, documents, evaluations, and projects.',
    kicker: 'Full-stack case study · active development',
    lede: 'A role-aware platform that centralizes attendance, daily time records, intern documents, evaluations, project tracking, and staff workflows for PNP ITMS.',
    videoId: 'ashSgW8mPYw',
    videoTitle: 'PNP IDTMS project video',
    actions: [['Live project', 'https://pnp-itms-internship-attendance.vercel.app/']],
    meta: [
      ['Role', 'Full-Stack Developer'],
      ['Status', 'Active development'],
      ['Stack', 'React · Vite · Express · Supabase'],
    ],
    architecture: [
      { label: 'roles', title: 'Role-aware workflows', description: 'Administrators, supervisors, and interns use workflows tailored to their responsibilities.' },
      { label: 'pwa', title: 'React application', description: 'The responsive PWA brings attendance, records, evaluations, and operations into one workspace.' },
      { label: 'api', title: 'Express service layer', description: 'The REST API handles authenticated requests and applies authorization rules to each workflow.' },
      { label: 'data', title: 'Supabase data layer', description: 'Postgres, Storage, and Row Level Security protect structured records and private files.' }
    ],
    gallerySections: pnpGallerySections,
    blocks: [
      ['The challenge', 'Internship administration was spread across disconnected processes, making attendance, DTR processing, document review, evaluations, and reporting difficult to coordinate.'],
      ['My contribution', 'I led the full-stack implementation, from user journeys and data modeling to the React interface, Express API, authorization, integrations, and deployment preparation.'],
      ['One workspace for three roles', 'A responsive PWA gives administrators, supervisors, and interns workflows tailored to their responsibilities, covering attendance, documents, evaluations, project tracking, and program operations.'],
      ['From check-in to records', 'Interns scan a time-sensitive QR code and complete face verification. Approved time-in and time-out scans feed daily time records and reports, connecting attendance capture to the staff review process.'],
      ['Security across the stack', 'Authorization rules apply across the interface, API, and database. Private files use protected access and signed URLs; sensitive tables use Row Level Security.'],
      ['Current outcome', 'The active build brings internship workflows into one operational workspace, with a foundation for expanding beyond attendance into broader program administration.'],
    ],
  },
  agapai: {
    path: caseStudyPaths.agapai,
    title: 'AgapAI',
    pageTitle: 'AgapAI Case Study | Rafhael James Olayres',
    description: 'A case study of AgapAI, a mobile emergency rescue and proactive health platform for senior citizens in Valenzuela City.',
    shareImage: '/resources/agapai-portfolio-promo.png',
    kicker: 'Capstone case study · 2026–present',
    lede: 'A connected mobile platform for emergency rescue, proactive health monitoring, and community support for senior citizens in Valenzuela City.',
    image: '/resources/agapai-image.png',
    webp: '/resources/agapai-image.webp',
    webpSmall: '/resources/agapai-image-800.webp',
    imageWidth: 1265,
    imageHeight: 712,
    alt: 'AgapAI platform interface showing emergency and health features',
    videoId: 'jsnFPl6NdEg',
    videoTitle: 'AgapAI promotional video',
    imageAtBottom: true,
    actions: [
      ['Live demo', 'https://download-agapai.vercel.app/', 'primary'],
    ],
    meta: [
      ['Role', 'Capstone tech lead & full-stack developer'],
      ['Status', 'Current build'],
      ['Stack', 'React Native · Expo · Firebase · Gemini'],
    ],
    architecture: [
      { label: 'people', title: 'Senior and guardian experiences', description: 'Mobile workflows give seniors and guardians access to emergency and health support.' },
      { label: 'mobile', title: 'React Native and Expo', description: 'The cross-platform app connects the people using the service with its support workflows.' },
      { label: 'realtime', title: 'Firebase services', description: 'Firebase-backed data connects app activity with current support and health information.' },
      { label: 'response', title: 'AI and responder support', description: 'SOS dispatch, health monitoring, and the Gemini-powered assistant support the broader care loop.' }
    ],
    blocks: [
      ['The problem', 'Senior citizens, guardians, and local responders needed a clearer way to coordinate urgent help and ongoing health support.'],
      ['My contribution', 'As capstone tech lead and full-stack developer, I built the mobile app, website, and admin endpoint with the team.'],
      ['A connected care flow', 'The current build brings seniors, guardians, and responders into one flow for SOS dispatch, health monitoring, and support from a Gemini-powered assistant. Firebase connects the app’s current support and health information.'],
      ['Current outcome', 'The prototype brings emergency and ongoing health support into one connected experience. The team is still developing the build, so its real-world impact has not yet been measured.'],
    ],
  },
  foliofy: {
    path: caseStudyPaths.foliofy,
    title: 'Foliofy',
    pageTitle: 'Foliofy Case Study | Rafhael James Olayres',
    description: 'A case study of Foliofy, a browser-based PWA for organizing image collections and exporting polished documents.',
    kicker: 'Product case study · June 2026',
    lede: 'A fast, browser-first workspace for organizing image collections and turning them into polished Word or PDF documents.',
    image: '/resources/foliofy.png',
    webp: '/resources/foliofy.webp',
    webpSmall: '/resources/foliofy-800.webp',
    imageWidth: 1365,
    imageHeight: 631,
    alt: 'Foliofy interface for organizing image collections and exporting documents',
    actions: [['Live project', 'https://foliofy-omega.vercel.app/', 'primary']],
    meta: [
      ['Role', 'Product designer & frontend developer'],
      ['Status', 'Shipped PWA'],
      ['Stack', 'JavaScript · IndexedDB · docx.js · jsPDF'],
    ],
    architecture: [
      { label: 'images', title: 'Image collection', description: 'Users bring the images they want to arrange into a finished document.' },
      { label: 'workspace', title: 'Browser-side editor', description: 'The workspace organizes the collection and prepares its document layout.' },
      { label: 'storage', title: 'IndexedDB persistence', description: 'Project data stays available in the browser between editing sessions.' },
      { label: 'export', title: 'Word and PDF generation', description: 'docx.js and jsPDF produce downloadable documents directly in the browser.' }
    ],
    blocks: [
      ['The problem', 'Image collections are easy to gather but tedious to organize and convert into a presentable deliverable without switching between tools.'],
      ['My contribution', 'I designed the workflow and interface hierarchy, then built the responsive frontend and client-side document generation.'],
      ['The workflow', 'Foliofy brings image organization and document creation into one browser workspace. Users arrange collections with drag and drop, then export a Word or PDF document without sending files to a server.'],
      ['Outcome', 'IndexedDB keeps project data available between sessions, and browser-side export gives users a complete organize-to-download flow in one place.'],
    ],
  },
};
