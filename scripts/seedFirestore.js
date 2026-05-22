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

console.log('Firestore seed completed.');
