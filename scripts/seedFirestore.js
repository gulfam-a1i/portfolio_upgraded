import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const profile = {
  name: 'GULFAM ALI',
  objective: 'Software Engineering student at COMSATS University with hands-on experience in Flutter, Full Stack Development, React.js, Node.js, REST APIs, and AI-powered applications.',
  email: 'gulfamoffi62@gmail.com',
  phone: '+92 3280130155',
  location: 'Vehari, Pakistan',
  linkedin: 'https://linkedin.com/in/gulfamali',
  github: 'https://github.com/gulfamali16',
  facebook: '#',
  instagram: '#',
  fiverr: 'https://www.fiverr.com/gulfama1i?public_mode=true',
  upwork: 'https://www.upwork.com/freelancers/~01d6f91061b549d072',
  heroTitle1: 'UI UX',
  heroTitle2: 'DESIGNER',
  heroSubtitle: 'I DESIGN INTUITIVE INTERFACES AND DEVELOP USER-CENTRIC SOLUTIONS, BLENDING CREATIVITY AND TECHNICAL EXPERTISE TO CRAFT SEAMLESS DIGITAL EXPERIENCES',
  profileImageUrl: '/profile.png',
  adminEmail: 'gulfamoffi62@gmail.com',
};

const projects = [
  { title: 'Kisaan AI', description: 'AI-Powered Crop Advisory Mobile Application delivering disease detection and weather forecasting for farmers.', techStack: 'Flutter, TFLite, Firebase, Gemini AI', link: 'https://github.com/gulfamali16', order: 1, imageUrl: '' },
  { title: 'Meetmind', description: 'AI-powered meeting assistant that records video calls, auto-transcribes audio, and generates structured summaries.', techStack: 'JavaScript, Supabase, Groq Whisper', link: 'https://github.com/gulfamali16', order: 2, imageUrl: '' },
  { title: 'VSpark', description: 'Comprehensive competition management and event platform for organizing tech contests and student registration.', techStack: 'React, Vite, Supabase, PostgreSQL', link: 'https://github.com/gulfamali16', order: 3, imageUrl: '' },
  { title: 'Velocity POS', description: 'Business management mobile app with inventory tracking, customer ledger, and receipt generation.', techStack: 'Flutter, Firebase, SQLite', link: 'https://github.com/gulfamali16', order: 4, imageUrl: '' },
];

const experience = [
  { role: 'Full Stack Developer', company: 'University & Personal Work', period: 'Aug 2023 - Present', description: 'Built multiple web and mobile applications using Flutter and React.js, integrating databases like Supabase and Firebase.', order: 1 },
  { role: 'Video Editor', company: 'Meetzizi Agency', period: 'Jul 2024 - Nov 2024', description: 'Edited promotional and social media videos using Adobe After Effects with strong storytelling.', order: 2 },
  { role: 'Animation Designer', company: 'Code Desk Studio', period: 'Jan 2023 - Oct 2023', description: 'Designed 2D/3D motion graphics and animated explainer videos for marketing teams.', order: 3 },
];

const skills = [
  { category: 'Technical Skills', items: 'Flutter, Express js, React.js, Node.js, Android Development, REST APIs, Web Development' },
  { category: 'Languages', items: 'JavaScript, Dart, Python, PHP, C++, Java, HTML, CSS' },
  { category: 'Databases', items: 'PostgreSQL, MySQL, SQL Server, Firebase Firestore, MongoDB' },
  { category: 'Tools & Platforms', items: 'Git, GitHub, Jira, VS Code, Android Studio, After Effects, Windows' },
];

const services = [
  { icon: 'server', num: '01', title: 'Full Stack Development', desc: 'Complete product development across frontend, backend, database, APIs, dashboards, and deployment workflows.', tags: ['React', 'Node.js', 'Firebase', 'Supabase'], order: 1 },
  { icon: 'smartphone', num: '02', title: 'Flutter App Development', desc: 'Cross-platform mobile apps with clean UI, smooth performance, Firebase integrations, and scalable app architecture.', tags: ['Flutter', 'Dart', 'Android', 'Firebase'], order: 2 },
  { icon: 'layout', num: '03', title: 'React Web Development', desc: 'Modern responsive web apps, admin dashboards, landing experiences, and frontend systems built with React.', tags: ['React', 'Vite', 'Tailwind', 'UI Systems'], order: 3 },
  { icon: 'award', num: '04', title: 'AI Integrations', desc: 'Practical AI features added into real products, including chat, summaries, transcription, recommendations, and content tools.', tags: ['OpenAI', 'Gemini', 'Groq', 'LLMs'], order: 4 },
  { icon: 'layout', num: '05', title: 'AI Automation Systems', desc: 'Automation workflows that connect apps, data, APIs, and AI models to reduce repetitive manual work.', tags: ['Automation', 'Workflows', 'APIs', 'AI Tools'], order: 5 },
  { icon: 'briefcase', num: '06', title: 'AI Agents', desc: 'Goal-driven AI assistants that can reason over user input, call tools, process data, and complete multi-step tasks.', tags: ['Agents', 'Tools', 'RAG', 'Assistants'], order: 6 },
  { icon: 'award', num: '07', title: 'Voice AI Agents', desc: 'Voice-based AI agents for calls, support, lead qualification, reminders, and interactive conversational workflows.', tags: ['Voice AI', 'Calls', 'Transcription', 'Realtime'], order: 7 },
  { icon: 'server', num: '08', title: 'REST APIs Development', desc: 'Reliable API layers with clean routes, authentication, validation, database access, and third-party integrations.', tags: ['Express', 'Node.js', 'Auth', 'Databases'], order: 8 },
  { icon: 'server', num: '09', title: 'Backend Development', desc: 'Backend systems for apps and dashboards, including data modeling, business logic, security, and deployment.', tags: ['Node.js', 'Firebase', 'PostgreSQL', 'MongoDB'], order: 9 },
];

const testimonials = [
  { name: 'EMILY CARTER', role: 'PRODUCT MANAGER - TECHNOVA', text: 'Gulfam transformed our app with exceptional Flutter skills. The user feedback has been phenomenal and engagement rose 40% in the first month.', order: 1 },
  { name: 'SOPHIA LEE', role: 'MARKETING LEAD - GREENSPACES', text: 'Attention to detail and user-centric approach resulted in a beautiful platform that our customers absolutely love.', order: 2 },
  { name: 'MICHAEL GRANT', role: 'OPERATIONS MANAGER - BRIGHT', text: 'A rare talent who excels at both UI design and full-stack development. Delivered every project on time with zero compromises.', order: 3 },
];

async function upsertCollection(collectionName, records, idField = 'order') {
  for (const record of records) {
    const id = String(record[idField] ?? record.category).replaceAll('/', '-');
    await db.collection(collectionName).doc(id).set(record, { merge: true });
  }
}

await db.collection('profile').doc('current').set(profile, { merge: true });
await upsertCollection('projects', projects);
await upsertCollection('experience', experience);
await upsertCollection('skills', skills, 'category');
await upsertCollection('services', services);
await upsertCollection('testimonials', testimonials);

console.log('Firestore seed completed.');
