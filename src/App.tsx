import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Menu, X, ArrowUpRight, Github, Linkedin, Send, Mail, Phone, MapPin,
  Layout, Server, Smartphone, Award, Briefcase, User, Instagram,
  Facebook, ChevronRight, Trash2, Edit3, Plus, LogOut, Eye, ExternalLink, Star
} from 'lucide-react';
import { db, auth, loginWithGoogle, logout } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc, getDoc, collection, onSnapshot, query, orderBy,
  addDoc, serverTimestamp, setDoc, deleteDoc
} from 'firebase/firestore';

// ─── Types ─────────────────────────────────────────────────────────
export interface Profile {
  name: string; objective: string; email: string; phone: string;
  location: string; linkedin: string; github: string; facebook: string; instagram: string;
  fiverr?: string; upwork?: string;
  heroTitle1: string; heroTitle2: string; heroSubtitle: string; profileImageUrl: string;
  adminEmail: string;
}
export interface Skill { id?: string; category: string; items: string; }
export interface Service {
  id?: string; icon: string; num: string; title: string; desc: string; tags: string[]; order: number;
}
export interface Project {
  id?: string; title: string; description: string; techStack: string;
  link: string; order: number; imageUrl?: string;
}
export interface Experience {
  id?: string; role: string; company: string; period: string; description: string; order: number;
}
export interface WorkProcess {
  id?: string; step: string; title: string; description: string; imageUrl: string; order: number;
}
export interface Workstation {
  id?: string; title: string; description: string; imageUrl: string; order: number;
}
export interface Inquiry {
  id?: string; name: string; email: string; message: string; createdAt: any;
}
export interface Testimonial {
  id?: string; name: string; role: string; text: string; order?: number;
}

// ─── Defaults ──────────────────────────────────────────────────────
const DEFAULT_PROFILE: Profile = {
  name: "GULFAM ALI", objective: "Software Engineering student at COMSATS University with hands-on experience in Flutter, Full Stack Development, React.js, Node.js, REST APIs, and AI-powered applications.",
  email: "gulfamoffi62@gmail.com", phone: "+92 3280130155", location: "Vehari, Pakistan",
  linkedin: "https://linkedin.com/in/gulfamali", github: "https://github.com/gulfamali16",
  facebook: "#", instagram: "#",
  fiverr: "https://www.fiverr.com/gulfama1i?public_mode=true",
  upwork: "https://www.upwork.com/freelancers/~01d6f91061b549d072",
  heroTitle1: "UI UX", heroTitle2: "DESIGNER",
  heroSubtitle: "I DESIGN INTUITIVE INTERFACES AND DEVELOP USER-CENTRIC SOLUTIONS, BLENDING CREATIVITY AND TECHNICAL EXPERTISE TO CRAFT SEAMLESS DIGITAL EXPERIENCES",
  profileImageUrl: "/profile.png", adminEmail: "gulfamoffi62@gmail.com"
};

const DEFAULT_PROJECTS: Project[] = [
  { title: "Kisaan AI", description: "AI-Powered Crop Advisory Mobile Application delivering disease detection and weather forecasting for farmers.", techStack: "Flutter, TFLite, Firebase, Gemini AI", link: "https://github.com/gulfamali16", order: 1 },
  { title: "Meetmind", description: "AI-powered meeting assistant that records video calls, auto-transcribes audio, and generates structured summaries.", techStack: "JavaScript, Supabase, Groq Whisper", link: "https://github.com/gulfamali16", order: 2 },
  { title: "VSpark", description: "Comprehensive competition management and event platform for organizing tech contests and student registration.", techStack: "React, Vite, Supabase, PostgreSQL", link: "https://github.com/gulfamali16", order: 3 },
  { title: "Velocity POS", description: "Business management mobile app with inventory tracking, customer ledger, and receipt generation.", techStack: "Flutter, Firebase, SQLite", link: "https://github.com/gulfamali16", order: 4 },
];

const DEFAULT_EXPERIENCE: Experience[] = [
  { role: "Full Stack Developer", company: "University & Personal Work", period: "Aug 2023 - Present", description: "Built multiple web and mobile applications using Flutter and React.js, integrating databases like Supabase and Firebase.", order: 1 },
  { role: "Video Editor", company: "Meetzizi Agency", period: "Jul 2024 - Nov 2024", description: "Edited promotional and social media videos using Adobe After Effects with strong storytelling.", order: 2 },
  { role: "Animation Designer", company: "Code Desk Studio", period: "Jan 2023 - Oct 2023", description: "Designed 2D/3D motion graphics and animated explainer videos for marketing teams.", order: 3 },
];

const DEFAULT_SKILLS: Skill[] = [
  { category: "Technical Skills", items: "Flutter, Express js, React.js, Node.js, Android Development, REST APIs, Web Development" },
  { category: "Languages", items: "JavaScript, Dart, Python, PHP, C++, Java, HTML, CSS" },
  { category: "Databases", items: "PostgreSQL, MySQL, SQL Server, Firebase Firestore, MongoDB" },
  { category: "Tools & Platforms", items: "Git, GitHub, Jira, VS Code, Android Studio, After Effects, Windows" },
];

const DEFAULT_SERVICES: Service[] = [
  { icon: "server", num: "01", title: "Full Stack Development", desc: "Complete product development across frontend, backend, database, APIs, dashboards, and deployment workflows.", tags: ["React", "Node.js", "Firebase", "Supabase"], order: 1 },
  { icon: "smartphone", num: "02", title: "Flutter App Development", desc: "Cross-platform mobile apps with clean UI, smooth performance, Firebase integrations, and scalable app architecture.", tags: ["Flutter", "Dart", "Android", "Firebase"], order: 2 },
  { icon: "layout", num: "03", title: "React Web Development", desc: "Modern responsive web apps, admin dashboards, landing experiences, and frontend systems built with React.", tags: ["React", "Vite", "Tailwind", "UI Systems"], order: 3 },
  { icon: "award", num: "04", title: "AI Integrations", desc: "Practical AI features added into real products, including chat, summaries, transcription, recommendations, and content tools.", tags: ["OpenAI", "Gemini", "Groq", "LLMs"], order: 4 },
  { icon: "layout", num: "05", title: "AI Automation Systems", desc: "Automation workflows that connect apps, data, APIs, and AI models to reduce repetitive manual work.", tags: ["Automation", "Workflows", "APIs", "AI Tools"], order: 5 },
  { icon: "briefcase", num: "06", title: "AI Agents", desc: "Goal-driven AI assistants that can reason over user input, call tools, process data, and complete multi-step tasks.", tags: ["Agents", "Tools", "RAG", "Assistants"], order: 6 },
  { icon: "award", num: "07", title: "Voice AI Agents", desc: "Voice-based AI agents for calls, support, lead qualification, reminders, and interactive conversational workflows.", tags: ["Voice AI", "Calls", "Transcription", "Realtime"], order: 7 },
  { icon: "server", num: "08", title: "REST APIs Development", desc: "Reliable API layers with clean routes, authentication, validation, database access, and third-party integrations.", tags: ["Express", "Node.js", "Auth", "Databases"], order: 8 },
  { icon: "server", num: "09", title: "Backend Development", desc: "Backend systems for apps and dashboards, including data modeling, business logic, security, and deployment.", tags: ["Node.js", "Firebase", "PostgreSQL", "MongoDB"], order: 9 },
];

const STATS = [
  { label: 'YEARS EXP', value: '02+' },
  { label: 'PROJECTS', value: '15+' },
  { label: 'AWARDS', value: '05+' },
  { label: 'RATING', value: '4.8' },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { name: 'EMILY CARTER', role: 'PRODUCT MANAGER · TECHNOVA', text: 'Gulfam transformed our app with exceptional Flutter skills. The user feedback has been phenomenal and engagement rose 40% in the first month.' },
  { name: 'SOPHIA LEE', role: 'MARKETING LEAD · GREENSPACES', text: 'Attention to detail and user-centric approach resulted in a beautiful platform that our customers absolutely love.' },
  { name: 'MICHAEL GRANT', role: 'OPERATIONS MANAGER · BRIGHT', text: 'A rare talent who excels at both UI design and full-stack development. Delivered every project on time with zero compromises.' },
];

// ─── Navbar ────────────────────────────────────────────────────────
const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const serviceIcons: Record<string, JSX.Element> = {
  layout: <Layout size={28} />,
  server: <Server size={28} />,
  smartphone: <Smartphone size={28} />,
  award: <Award size={28} />,
  briefcase: <Briefcase size={28} />,
};

const getServiceIcon = (icon: string) => serviceIcons[icon] || serviceIcons.layout;

const SectionHeader = ({ eyebrow, title, body, dark = false }: { eyebrow: string; title: string; body?: string; dark?: boolean }) => (
  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-16">
    <div>
      <div className={cn("text-[11px] font-bold tracking-[0.22em] uppercase mb-4", dark ? "text-accent" : "text-on-surface-variant")}>{eyebrow}</div>
      <h2 className={cn("font-display font-bold leading-[0.95]", dark ? "text-white" : "text-on-surface")}
        style={{ fontSize: 'clamp(42px, 7vw, 92px)' }}>
        {title}
      </h2>
    </div>
    {body && (
      <p className={cn("max-w-md text-sm md:text-base leading-relaxed", dark ? "text-white/55" : "text-on-surface-variant")}>
        {body}
      </p>
    )}
  </div>
);

const Navbar = ({ profile, activeSection }: { profile: Profile; activeSection: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const links = [
    { label: 'HOME', href: '#home' },
    { label: 'SERVICES', href: '#services' },
    { label: 'WORKS', href: '#works' },
    { label: 'CONTACT', href: '#contact' },
  ];
  return (
    <nav className={cn("fixed top-0 w-full z-50 transition-all duration-500 border-b", scrolled ? "bg-primary/85 backdrop-blur-xl border-white/10 py-3" : "bg-primary/35 backdrop-blur-sm border-transparent py-5")}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20 flex justify-between items-center">
        <Link to="/" className="font-display text-white text-lg md:text-xl font-bold tracking-tight lowercase">
          {profile.name.toLowerCase().replace(' ', '')}<span className="text-accent">.dev</span>
        </Link>
        <div className="hidden md:flex gap-1 items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
          {links.map((item, i) => (
            <a key={item.label} href={item.href}
              className={cn("px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.16em] transition-all", activeSection === item.href.slice(1) ? "bg-accent text-primary" : "text-white/58 hover:text-white hover:bg-white/[0.06]")}>
              {item.label}
            </a>
          ))}
          <Link to="/admin" className="px-4 py-2 rounded-full text-white/42 text-[10px] font-bold tracking-[0.16em] hover:text-accent hover:bg-white/[0.06] transition-all flex items-center gap-1">
            <User size={11} /> ADMIN
          </Link>
        </div>
        <a href="#contact" className="hidden md:flex items-center gap-2 bg-accent text-primary font-bold text-[11px] px-5 py-3 tracking-[0.12em] hover:bg-accent2 transition-all group">
          HIRE ME <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary/95 backdrop-blur-xl border-t border-white/10 overflow-hidden">
            <div className="px-6 py-8 flex flex-col gap-6">
              {links.map(item => (
                <a key={item.label} href={item.href} onClick={() => setOpen(false)}
                  className="text-white font-display font-bold text-2xl tracking-tight hover:text-accent transition-colors">
                  {item.label}
                </a>
              ))}
              <Link to="/admin" onClick={() => setOpen(false)} className="text-white/40 font-bold text-base">ADMIN</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ─── Marquee Banner ───────────────────────────────────────────────
const MarqueeBanner = () => {
  const items = ['UI/UX DESIGN', '✦', 'FLUTTER DEV', '✦', 'FULL STACK', '✦', 'REACT.JS', '✦', 'FIREBASE', '✦', 'NODE.JS', '✦', 'MOBILE APPS', '✦'];
  return (
    <div className="bg-accent overflow-hidden py-3 select-none border-y border-primary">
      <div className="flex whitespace-nowrap marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className={`text-primary font-bold text-xs tracking-[0.2em] mx-6 ${item === '✦' ? 'text-primary/40' : ''}`}>{item}</span>
        ))}
      </div>
    </div>
  );
};

// ─── Contact Form ────────────────────────────────────────────────
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault(); setLoading(true);
    try {
      await addDoc(collection(db, 'inquiries'), { ...formData, createdAt: serverTimestamp() });
      setSuccess(true); setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input required type="text" placeholder="Your name" value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        className="bg-white/[0.035] border border-white/12 px-5 py-4 text-white text-sm placeholder:text-white/30 outline-none focus:border-accent focus:bg-white/[0.06] transition-colors" />
      <input required type="email" placeholder="Your email" value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        className="bg-white/[0.035] border border-white/12 px-5 py-4 text-white text-sm placeholder:text-white/30 outline-none focus:border-accent focus:bg-white/[0.06] transition-colors" />
      <textarea required placeholder="Tell me about your project..." rows={5} value={formData.message}
        onChange={e => setFormData({ ...formData, message: e.target.value })}
        className="bg-white/[0.035] border border-white/12 px-5 py-4 text-white text-sm placeholder:text-white/30 outline-none focus:border-accent focus:bg-white/[0.06] transition-colors resize-none" />
      <button type="submit" disabled={loading}
        className="bg-accent text-primary font-display font-bold text-xs py-4 px-8 tracking-[0.14em] hover:bg-accent2 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
        {loading ? 'SENDING...' : success ? '✓ MESSAGE SENT!' : <><span>SEND MESSAGE</span><Send size={15} /></>}
      </button>
    </form>
  );
};

// ─── Home Page ────────────────────────────────────────────────────
const Home = () => {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [experience, setExperience] = useState<Experience[]>(DEFAULT_EXPERIENCE);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [activeService, setActiveService] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    getDoc(doc(db, 'profile', 'current')).then(snap => {
      if (snap.exists()) setProfile(snap.data() as Profile);
      setLoading(false);
    }).catch(() => setLoading(false));

    const unsubP = onSnapshot(query(collection(db, 'projects'), orderBy('order')), s => {
      if (!s.empty) setProjects(s.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    });
    const unsubE = onSnapshot(query(collection(db, 'experience'), orderBy('order')), s => {
      if (!s.empty) setExperience(s.docs.map(d => ({ id: d.id, ...d.data() } as Experience)));
    });
    const unsubS = onSnapshot(collection(db, 'skills'), s => {
      if (!s.empty) setSkills(s.docs.map(d => ({ id: d.id, ...d.data() } as Skill)));
    });
    const unsubServices = onSnapshot(query(collection(db, 'services'), orderBy('order')), s => {
      if (!s.empty) setServices(s.docs.map(d => ({ id: d.id, ...d.data() } as Service)));
    });
    const unsubTestimonials = onSnapshot(query(collection(db, 'testimonials'), orderBy('order')), s => {
      if (!s.empty) setTestimonials(s.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
    });
    return () => { unsubP(); unsubE(); unsubS(); unsubServices(); unsubTestimonials(); };
  }, []);

  useEffect(() => {
    const ids = ['home', 'services', 'works', 'contact'];
    const onScroll = () => {
      const current = [...ids].reverse().find(id => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top <= 140 : false;
      });
      if (current) setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveService(current => services.length ? (current + 1) % services.length : 0);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [services.length]);

  if (loading) return (
    <div className="h-screen bg-primary flex items-center justify-center site-grid">
      <div className="relative">
        {[0,1,2,3].map(i => (
          <motion.div key={i} className="absolute inset-0 border border-accent/30 rounded-full"
            animate={{ scale: [1, 2 + i, 3 + i], opacity: [0.8, 0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }} />
        ))}
        <motion.div className="w-16 h-16 bg-accent flex items-center justify-center"
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <span className="text-primary font-display font-bold text-xl">G</span>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="bg-primary text-white">
      <Navbar profile={profile} activeSection={activeSection} />

      <section ref={heroRef} id="home" className="relative min-h-screen overflow-hidden site-grid pt-28 md:pt-36 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(183,255,42,0.12),transparent_30%),linear-gradient(180deg,rgba(6,6,6,0.2),#060606_88%)]" />
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[calc(100vh-160px)]">
            <div className="lg:col-span-8">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="inline-flex items-center gap-3 border border-white/12 bg-[#101010]/75 backdrop-blur px-4 py-2 rounded-full mb-8">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-white/62 text-[10px] font-bold tracking-[0.22em] uppercase">Available for new projects</span>
                </div>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-white leading-[0.84] max-w-6xl tracking-normal"
                style={{ fontSize: 'clamp(58px, 10.6vw, 158px)' }}>
                Full Stack<br /><span className="text-accent">Developer</span>
              </motion.h1>
              <motion.h2 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.15 }}
                className="font-display font-bold uppercase text-transparent leading-[0.88] mt-7 select-none"
                style={{ fontSize: 'clamp(38px, 6.6vw, 96px)', WebkitTextStroke: '1px rgba(255,255,255,0.18)' }}>
                <span className="block whitespace-nowrap">AI Automation</span>
                <span className="block">Engineer</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-8 max-w-2xl border-l-2 border-accent pl-6 text-white/66 text-base md:text-lg leading-relaxed">
                Full stack developer building scalable web, mobile, and AI-powered systems including automation tools, AI assistants, and voice/call agents.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-10 flex flex-wrap gap-4">
                <a href="#works" className="bg-accent text-primary font-display font-bold text-xs tracking-[0.14em] px-7 py-4 hover:bg-accent2 transition-all flex items-center gap-2 group">
                  VIEW MY WORK <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a href="#contact" className="border border-white/14 bg-white/[0.025] text-white font-display font-bold text-xs tracking-[0.14em] px-7 py-4 hover:bg-white hover:text-primary transition-all flex items-center gap-2">
                  LET'S TALK <Send size={15} />
                </a>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
              className="lg:col-span-4">
              <div className="float-panel relative border border-white/12 bg-[#101010]/82 backdrop-blur p-4 md:p-5">
                <div className="absolute -top-4 -left-4 bg-accent text-primary px-4 py-2 text-[10px] font-bold tracking-[0.16em] uppercase z-20">AI + Full Stack</div>
                <div className="absolute -right-3 top-16 border border-white/12 bg-primary/90 px-4 py-2 text-white/70 text-[10px] font-bold tracking-[0.16em] uppercase z-20">Available</div>
                <div className="aspect-[4/5] bg-[radial-gradient(circle_at_50%_20%,rgba(183,255,42,0.18),transparent_34%),linear-gradient(180deg,#171717,#060606)] border border-white/10 overflow-hidden relative">
                  <motion.img style={{ y: imgY }} src={profile.profileImageUrl || '/profile.png'} alt={profile.name}
                    className="w-full h-full object-contain object-bottom scale-105 saturate-125 contrast-105 opacity-100 drop-shadow-[0_28px_55px_rgba(0,0,0,0.65)]"
                    onError={e => { (e.target as HTMLImageElement).src = '/profile.png'; }} />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
                </div>
                <div className="grid grid-cols-3 gap-px bg-white/10 mt-5">
                  {STATS.slice(0, 3).map(s => (
                    <div key={s.label} className="bg-[#101010] p-4">
                      <div className="font-display font-bold text-white text-2xl">{s.value}</div>
                      <div className="text-white/42 text-[9px] font-bold tracking-[0.14em] uppercase mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex justify-center gap-3">
                {[
                  { icon: <Github size={15} />, href: profile.github },
                  { icon: <Linkedin size={15} />, href: profile.linkedin },
                  { icon: <Facebook size={15} />, href: profile.facebook },
                  { icon: <Instagram size={15} />, href: profile.instagram },
                  { icon: <span className="text-[10px] font-bold">Fi</span>, href: profile.fiverr || DEFAULT_PROFILE.fiverr },
                  { icon: <span className="text-[10px] font-bold">Up</span>, href: profile.upwork || DEFAULT_PROFILE.upwork },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="w-11 h-11 border border-white/12 bg-white/[0.025] flex items-center justify-center text-accent/75 hover:bg-accent hover:text-primary hover:border-accent transition-all">
                    {s.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <span className="text-white/34 text-[9px] font-bold tracking-[0.22em]">SCROLL</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/0 via-white/35 to-white/0" />
        </motion.div>
      </section>

      <MarqueeBanner />

      <section id="services" className="py-24 md:py-32 bg-surface text-on-surface light-grid">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20">
          <SectionHeader eyebrow="What I build" title="Services" body="From UI design to full-stack development, I create fast, functional, and user-focused applications for web and mobile platforms." />
          <div className="relative overflow-hidden border-y border-primary/10 mb-8 py-4">
            <motion.div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-accent/35 to-transparent"
              animate={{ x: ['-120%', '360%'] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="relative flex items-center gap-10 whitespace-nowrap w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}>
              {[...services, ...services].map((s, i) => (
                <button key={`${s.id || s.num}-${i}`} type="button" onClick={() => setActiveService(i % services.length)}
                  className={cn("inline-flex items-center gap-3 text-sm md:text-base font-display font-bold tracking-[0.08em] uppercase transition-colors", activeService === (i % services.length) ? "text-primary" : "text-primary/45 hover:text-primary")}>
                  <span className="w-2 h-2 bg-accent rounded-full shadow-[0_0_18px_rgba(183,255,42,0.8)]" />
                  <span>{s.title}</span>
                </button>
              ))}
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {services.map((s, i) => (
              <motion.div key={s.id || s.num}
                onMouseEnter={() => setActiveService(i)}
                initial={{ y: 34, rotateX: 8 }}
                whileInView={{ y: 0, rotateX: 0 }}
                animate={{
                  y: activeService === i ? -14 : 0,
                  scale: activeService === i ? 1.025 : 1,
                  rotate: activeService === i ? -0.4 : 0,
                }}
                whileHover={{ y: -18, rotate: -0.8 }}
                transition={{ type: "spring", stiffness: 220, damping: 24, delay: i * 0.04 }}
                viewport={{ once: true }}
                className={cn(
                  "relative overflow-hidden bg-white/78 backdrop-blur border p-7 md:p-9 group cursor-default min-h-[360px] transition-colors duration-300",
                  activeService === i ? "border-accent bg-[#070707] text-accent shadow-[0_28px_80px_rgba(6,6,6,0.28)]" : "border-primary/10 bg-white/78 text-on-surface hover:border-primary/30"
                )}>
                <motion.div className="absolute inset-x-0 top-0 h-1 bg-accent origin-left"
                  animate={{ scaleX: activeService === i ? 1 : 0.18 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} />
                <motion.div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-accent/18 blur-2xl"
                  animate={{ scale: activeService === i ? 1.2 : 0.65, x: activeService === i ? 0 : 20, y: activeService === i ? 0 : -10 }}
                  transition={{ duration: 0.6 }} />
                <div className="flex justify-between items-start mb-8">
                  <span className={cn("font-display font-bold text-5xl transition-colors", activeService === i ? "text-accent/25" : "text-primary/18")}>{s.num}</span>
                  <motion.div animate={{ rotate: activeService === i ? [0, -10, 0] : 0, scale: activeService === i ? 1.08 : 1 }}
                    transition={{ duration: 0.6 }}
                    className={cn("w-12 h-12 border flex items-center justify-center transition-colors", activeService === i ? "border-accent/35 bg-accent/10 text-accent" : "border-primary/10 text-primary")}>{getServiceIcon(s.icon)}</motion.div>
                </div>
                <h3 className={cn("font-display font-bold text-2xl mb-4 tracking-tight transition-colors", activeService === i ? "text-accent" : "text-on-surface")}>{s.title}</h3>
                <p className={cn("text-sm leading-relaxed transition-colors", activeService === i ? "text-white/68" : "text-on-surface-variant")}>{s.desc}</p>
                <div className="flex flex-wrap gap-2 mt-7">
                  {(Array.isArray(s.tags) ? s.tags : []).map(tag => (
                    <span key={tag} className={cn("border px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase transition-colors", activeService === i ? "border-accent/25 bg-accent/5 text-accent/80" : "border-primary/10 text-on-surface-variant")}>{tag}</span>
                  ))}
                </div>
                <div className={cn("mt-8 flex items-center gap-2 text-xs font-bold tracking-[0.14em] transition-colors", activeService === i ? "text-accent" : "text-primary")}>
                  EXPLORE <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="works" className="py-24 md:py-32 bg-primary site-grid">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20">
          <SectionHeader dark eyebrow="Selected builds" title="Recent Works" body="A focused set of product-style web, mobile, and AI projects with practical architecture and clear user outcomes." />
          <div className="flex justify-end -mt-8 mb-10">
            <a href={profile.github || DEFAULT_PROFILE.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/14 text-white text-xs font-bold px-5 py-3 tracking-[0.14em] hover:bg-accent hover:text-primary hover:border-accent transition-all">
              <Github size={14} /> VIEW ALL ON GITHUB
            </a>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {projects.map((p, i) => (
              <motion.button key={p.id || i} type="button" onClick={() => setSelectedProject(p)}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} viewport={{ once: true }}
                className="text-left bg-[#101010] border border-white/10 group relative overflow-hidden block hover:border-accent/70 transition-all">
                <div className="relative h-64 md:h-80 overflow-hidden bg-white/[0.035]">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title}
                      className="w-full h-full object-contain group-hover:scale-[1.03] transition-all duration-700 opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center site-grid">
                      <div className="w-[72%] h-[62%] border border-white/12 bg-primary/70 p-6 flex flex-col justify-between group-hover:border-accent/50 transition-colors">
                        <div className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase">Project preview</div>
                        <span className="font-display font-bold text-6xl text-white/12">{p.title[0]}</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/12 to-transparent pointer-events-none" />
                  <div className="absolute top-4 right-4 w-10 h-10 bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <ExternalLink size={14} className="text-primary" />
                  </div>
                </div>
                <div className="p-7 md:p-8">
                  <div className="flex flex-wrap gap-2 mb-5">
                    {p.techStack.split(',').slice(0, 4).map(tag => (
                      <span key={tag} className="border border-white/10 text-white/45 text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1">{tag.trim()}</span>
                    ))}
                  </div>
                  <h3 className="font-display font-bold text-white text-2xl md:text-3xl tracking-tight mb-3 group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="text-white/54 text-sm leading-relaxed mb-6">{p.description}</p>
                  <div className="text-accent text-xs font-bold tracking-[0.14em] flex items-center gap-2">VIEW DETAILS <ArrowUpRight size={14} /></div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#101010] border border-white/12 w-full max-w-5xl max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center gap-4 p-5 border-b border-white/10 sticky top-0 bg-[#101010] z-10">
                <h3 className="font-display font-bold text-white text-2xl">{selectedProject.title}</h3>
                <button onClick={() => setSelectedProject(null)} className="w-10 h-10 border border-white/12 flex items-center justify-center text-white/60 hover:text-primary hover:bg-accent hover:border-accent transition-all">
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="bg-primary p-5">
                  {selectedProject.imageUrl ? (
                    <img src={selectedProject.imageUrl} alt={selectedProject.title}
                      className="w-full max-h-[70vh] object-contain bg-white/[0.03]" />
                  ) : (
                    <div className="h-80 site-grid border border-white/10 flex items-center justify-center">
                      <span className="font-display font-bold text-7xl text-white/12">{selectedProject.title[0]}</span>
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.techStack.split(',').map(tag => (
                      <span key={tag} className="border border-white/10 text-white/50 text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1">{tag.trim()}</span>
                    ))}
                  </div>
                  <p className="text-white/64 text-sm leading-relaxed mb-8">{selectedProject.description}</p>
                  <a href={selectedProject.link} target="_blank" rel="noopener noreferrer"
                    className="mt-auto bg-accent text-primary font-display font-bold text-xs tracking-[0.14em] px-6 py-4 hover:bg-accent2 transition-all inline-flex items-center justify-center gap-2">
                    OPEN PROJECT LINK <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="py-24 md:py-32 bg-surface text-on-surface light-grid">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20">
          <SectionHeader eyebrow="Capabilities" title="Skills & Experience" body="A practical stack for shipping full products, from interface polish to database-backed systems." />
        </div>
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-8 flex items-center gap-4">
              <Award size={30} className="text-accent" /> Skills
            </motion.h2>
            <div className="space-y-5">
              {skills.map(skill => (
                <motion.div key={skill.id || skill.category} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="bg-white/70 border border-primary/10 p-5">
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-primary mb-4 uppercase">{skill.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.split(',').map(item => (
                      <span key={item} className="bg-surface border border-primary/10 text-xs font-bold px-3 py-1.5 text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all cursor-default">
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-8 flex items-center gap-4">
              <Briefcase size={30} className="text-accent" /> Experience
            </motion.h2>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <motion.div key={exp.id || i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="relative border border-primary/10 bg-white/70 p-6 hover:border-primary/30 transition-colors group">
                  <div className="flex items-start justify-between gap-6 mb-3">
                    <h3 className="font-display font-bold text-xl tracking-tight">{exp.role}</h3>
                    <div className="text-[10px] shrink-0 font-bold tracking-[0.14em] text-primary/55 uppercase">{exp.period}</div>
                  </div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">{exp.company}</div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 md:py-32 bg-primary site-grid">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20">
          <SectionHeader dark eyebrow="Client feedback" title="Testimonials" body="A few notes on collaboration, craft, and delivery from product and operations teams." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 mb-10">
            {[
              ['4.9/5', 'AVERAGE RATING'],
              ['15+', 'PROJECTS SHIPPED'],
              ['100%', 'CLIENT FOCUS'],
              ['FAST', 'RESPONSE TIME'],
            ].map(([value, label]) => (
              <div key={label} className="bg-[#101010] px-5 py-5">
                <div className="font-display font-bold text-white text-2xl">{value}</div>
                <div className="text-accent/70 text-[9px] font-bold tracking-[0.16em] uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-primary to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-primary to-transparent z-10" />
            <motion.div className="flex gap-4 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
              {[...testimonials, ...testimonials].map((t, i) => (
                <motion.div key={`${t.id || t.name}-${i}`}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="w-[320px] md:w-[410px] bg-[#101010]/92 border border-white/10 p-7 md:p-8 group hover:border-accent/70 transition-colors shrink-0">
                  <div className="flex items-center justify-between gap-4 mb-7">
                    <div className="flex gap-1 text-accent">
                      {[0, 1, 2, 3, 4].map(star => (
                        <Star key={star} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <div className="text-white/22 text-5xl font-display font-bold leading-none">&quot;</div>
                  </div>
                  <p className="text-white/68 text-sm leading-relaxed mb-8 min-h-[88px]">{t.text}</p>
                  <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="w-11 h-11 bg-accent flex items-center justify-center font-display font-bold text-primary text-lg">
                      {t.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-bold text-sm tracking-tight truncate">{t.name}</div>
                      <div className="text-white/40 text-[10px] font-bold tracking-widest truncate">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 md:py-32 bg-surface text-on-surface light-grid">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display font-bold leading-[0.96] mb-8"
              style={{ fontSize: 'clamp(44px, 7vw, 96px)' }}>
              Have a<br />project?<br /><span className="text-primary">Let's talk</span>
            </motion.h2>
            <p className="max-w-lg text-on-surface-variant leading-relaxed">
              Send the details, goals, and timeline. I will respond with a clear next step for your web, mobile, or AI product.
            </p>
            <div className="space-y-4 mt-10">
              {[
                { icon: <Mail size={18} />, label: 'EMAIL', val: profile.email },
                { icon: <Phone size={18} />, label: 'PHONE', val: profile.phone },
                { icon: <MapPin size={18} />, label: 'LOCATION', val: profile.location },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4 bg-white/65 border border-primary/10 p-4">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center text-accent shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-0.5">{item.label}</div>
                    <div className="font-bold text-sm">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-7 bg-primary p-6 md:p-10 border border-white/10">
            <div className="flex items-center justify-between gap-6 mb-8">
              <h3 className="font-display font-bold text-white text-2xl md:text-3xl tracking-tight">Send a message</h3>
              <span className="hidden sm:inline-flex text-accent text-[10px] font-bold tracking-[0.18em] uppercase">Usually replies soon</span>
            </div>
            <ContactForm />
          </motion.div>
        </div>
      </section>

      <footer className="bg-primary py-8 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20 flex flex-col md:flex-row justify-between items-center gap-5">
          <span className="font-display font-bold text-white text-lg lowercase">
            {profile.name.toLowerCase().replace(' ', '')}<span className="text-accent">.dev</span>
          </span>
          <span className="text-white/26 text-xs font-bold tracking-[0.2em]">2026 - ALL RIGHTS RESERVED</span>
          <div className="flex items-center justify-center gap-4">
            {[
              { icon: <Github size={14} />, href: profile.github },
              { icon: <Linkedin size={14} />, href: profile.linkedin },
              { icon: <Facebook size={14} />, href: profile.facebook },
              { icon: <Instagram size={14} />, href: profile.instagram },
              { icon: <span className="text-[10px] font-bold">Fi</span>, href: profile.fiverr || DEFAULT_PROFILE.fiverr },
              { icon: <span className="text-[10px] font-bold">Up</span>, href: profile.upwork || DEFAULT_PROFILE.upwork },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-accent/75 hover:text-accent2 transition-colors">{s.icon}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
const FieldInput = ({ label, value, onChange, type = 'text' }: any) => (
  <div>
    <label className="text-[10px] font-bold tracking-[0.2em] uppercase block mb-2 text-on-surface-variant">{label}</label>
    {type === 'textarea' ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
        className="w-full bg-surface border border-surface-dim px-4 py-3 text-sm outline-none focus:border-primary resize-none font-medium" />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-surface border border-surface-dim px-4 py-3 text-sm outline-none focus:border-primary font-medium" />
    )}
  </div>
);

const Modal = ({ open, onClose, title, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto admin-scroll">
        <div className="flex justify-between items-center p-6 border-b border-surface-dim sticky top-0 bg-white z-10">
          <h3 className="font-display font-bold text-xl tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-lg transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

type AdminTab = 'inquiries' | 'profile' | 'projects' | 'services' | 'testimonials' | 'experience' | 'skills';

const Admin = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [tab, setTab] = useState<AdminTab>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [profileData, setProfileData] = useState<Profile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [experience, setExperience] = useState<Experience[]>(DEFAULT_EXPERIENCE);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [modal, setModal] = useState<{ open: boolean; title: string; content: any }>({ open: false, title: '', content: null });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  const adminEmail = profileData.adminEmail || DEFAULT_PROFILE.adminEmail;
  const isAdmin = user?.email === adminEmail;

  useEffect(() => {
    if (!isAdmin) return;
    getDoc(doc(db, 'profile', 'current')).then(s => { if (s.exists()) setProfileData(s.data() as Profile); });
    const u1 = onSnapshot(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')), s =>
      setInquiries(s.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry))));
    const u2 = onSnapshot(query(collection(db, 'projects'), orderBy('order')), s =>
      setProjects(s.empty ? DEFAULT_PROJECTS : s.docs.map(d => ({ id: d.id, ...d.data() } as Project))));
    const u3 = onSnapshot(query(collection(db, 'experience'), orderBy('order')), s =>
      setExperience(s.empty ? DEFAULT_EXPERIENCE : s.docs.map(d => ({ id: d.id, ...d.data() } as Experience))));
    const u4 = onSnapshot(collection(db, 'skills'), s =>
      setSkills(s.empty ? DEFAULT_SKILLS : s.docs.map(d => ({ id: d.id, ...d.data() } as Skill))));
    const u5 = onSnapshot(query(collection(db, 'services'), orderBy('order')), s =>
      setServices(s.empty ? DEFAULT_SERVICES : s.docs.map(d => ({ id: d.id, ...d.data() } as Service))));
    const u6 = onSnapshot(query(collection(db, 'testimonials'), orderBy('order')), s =>
      setTestimonials(s.empty ? DEFAULT_TESTIMONIALS : s.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial))));
    return () => { u1(); u2(); u3(); u4(); u5(); u6(); };
  }, [isAdmin]);

  const save = async (col: string, data: any) => {
    setSaving(true);
    try {
      const { id, ...rest } = data;
      if (id) await setDoc(doc(db, col, id), rest, { merge: true });
      else await addDoc(collection(db, col), rest);
      setModal({ open: false, title: '', content: null });
      showToast('Saved successfully!');
    } catch (e: any) {
      console.error(e);
      showToast(e?.code === 'permission-denied' ? 'Permission denied. Deploy Firestore rules.' : (e?.message || 'Error saving.'));
    }
    setSaving(false);
  };

  const del = async (col: string, id: string) => {
    if (!confirm('Delete this item?')) return;
    await deleteDoc(doc(db, col, id));
    showToast('Deleted.');
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'profile', 'current'), profileData);
      showToast('Profile saved!');
    } catch (e) { console.error(e); showToast('Error.'); }
    setSaving(false);
  };

  if (!user) return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-8">
      <div className="bg-surface w-full max-w-sm p-10 text-center">
        <div className="w-14 h-14 bg-accent flex items-center justify-center mx-auto mb-6">
          <User size={24} className="text-primary" />
        </div>
        <h1 className="font-display font-bold text-3xl tracking-tight mb-2">ADMIN</h1>
        <p className="text-on-surface-variant text-sm mb-8">Sign in with your authorized account</p>
        <button onClick={() => loginWithGoogle().catch(e => alert(e.message))}
          className="w-full bg-primary text-white font-bold py-4 text-sm tracking-[0.1em] hover:bg-accent hover:text-primary transition-all flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          SIGN IN WITH GOOGLE
        </button>
        <Link to="/" className="mt-6 inline-block text-xs font-bold text-primary underline">← BACK TO SITE</Link>
      </div>
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="font-display font-bold text-3xl text-accent2 mb-2">ACCESS DENIED</h1>
        <p className="text-on-surface-variant text-sm mb-6">Logged in as: <strong>{user.email}</strong></p>
        <button onClick={() => logout()} className="bg-primary text-white font-bold px-6 py-3 text-sm mr-4 hover:bg-accent hover:text-primary transition-all">LOGOUT</button>
        <Link to="/" className="text-primary font-bold text-sm underline">Go Home</Link>
      </div>
    </div>
  );

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'inquiries', label: 'INBOX' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'services', label: 'SERVICES' },
    { id: 'testimonials', label: 'REVIEWS' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'profile', label: 'PROFILE' },
  ];

  // Reusable edit for project
  const ProjectForm = ({ initial, onSave }: any) => {
    const [d, setD] = useState(initial);
    return (
      <div className="space-y-4">
        <FieldInput label="Title" value={d.title} onChange={(v: string) => setD({ ...d, title: v })} />
        <FieldInput label="Tech Stack" value={d.techStack} onChange={(v: string) => setD({ ...d, techStack: v })} />
        <FieldInput label="GitHub Image URL" value={d.imageUrl || ''} onChange={(v: string) => setD({ ...d, imageUrl: v })} />
        <div className="text-[10px] text-on-surface-variant bg-surface-dim px-3 py-2 leading-relaxed">
          💡 Tip: Use a raw GitHub image URL like:<br />
          <code className="font-mono">https://raw.githubusercontent.com/user/repo/main/screenshot.png</code>
        </div>
        <FieldInput label="Project Link" value={d.link} onChange={(v: string) => setD({ ...d, link: v })} />
        <FieldInput label="Description" value={d.description} onChange={(v: string) => setD({ ...d, description: v })} type="textarea" />
        <FieldInput label="Order" value={String(d.order)} onChange={(v: string) => setD({ ...d, order: Number(v) })} type="number" />
        {d.imageUrl && (
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">PREVIEW</div>
            <img src={d.imageUrl} className="w-full h-32 object-cover border border-surface-dim" alt="preview"
              onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
          </div>
        )}
        <button onClick={() => onSave(d)} disabled={saving}
          className="w-full bg-primary text-white font-bold py-4 text-sm tracking-[0.1em] hover:bg-accent hover:text-primary transition-all disabled:opacity-60">
          {saving ? 'SAVING...' : 'SAVE PROJECT'}
        </button>
      </div>
    );
  };

  const ServiceForm = ({ initial, onSave }: any) => {
    const [d, setD] = useState({
      ...initial,
      tagsText: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags || ''),
    });
    const saveService = () => {
      const { tagsText, ...rest } = d;
      onSave({
        ...rest,
        tags: String(tagsText || '').split(',').map(tag => tag.trim()).filter(Boolean),
        order: Number(d.order || 1),
      });
    };
    return (
      <div className="space-y-4">
        <FieldInput label="Number" value={d.num} onChange={(v: string) => setD({ ...d, num: v })} />
        <FieldInput label="Title" value={d.title} onChange={(v: string) => setD({ ...d, title: v })} />
        <FieldInput label="Description" value={d.desc} onChange={(v: string) => setD({ ...d, desc: v })} type="textarea" />
        <FieldInput label="Icon (layout, server, smartphone, award, briefcase)" value={d.icon} onChange={(v: string) => setD({ ...d, icon: v })} />
        <FieldInput label="Tags (comma separated)" value={d.tagsText} onChange={(v: string) => setD({ ...d, tagsText: v })} type="textarea" />
        <FieldInput label="Order" value={String(d.order || '')} onChange={(v: string) => setD({ ...d, order: Number(v) })} type="number" />
        <button onClick={saveService} disabled={saving}
          className="w-full bg-primary text-white font-bold py-4 text-sm tracking-[0.1em] hover:bg-accent hover:text-primary transition-all disabled:opacity-60">
          {saving ? 'SAVING...' : 'SAVE SERVICE'}
        </button>
      </div>
    );
  };

  const TestimonialForm = ({ initial, onSave }: any) => {
    const [d, setD] = useState(initial);
    return (
      <div className="space-y-4">
        <FieldInput label="Name" value={d.name} onChange={(v: string) => setD({ ...d, name: v })} />
        <FieldInput label="Role / Company" value={d.role} onChange={(v: string) => setD({ ...d, role: v })} />
        <FieldInput label="Review Text" value={d.text} onChange={(v: string) => setD({ ...d, text: v })} type="textarea" />
        <FieldInput label="Order" value={String(d.order || '')} onChange={(v: string) => setD({ ...d, order: Number(v) })} type="number" />
        <button onClick={() => onSave({ ...d, order: Number(d.order || 1) })} disabled={saving}
          className="w-full bg-primary text-white font-bold py-4 text-sm tracking-[0.1em] hover:bg-accent hover:text-primary transition-all disabled:opacity-60">
          {saving ? 'SAVING...' : 'SAVE REVIEW'}
        </button>
      </div>
    );
  };

  const ExpForm = ({ initial, onSave }: any) => {
    const [d, setD] = useState(initial);
    return (
      <div className="space-y-4">
        <FieldInput label="Role" value={d.role} onChange={(v: string) => setD({ ...d, role: v })} />
        <FieldInput label="Company" value={d.company} onChange={(v: string) => setD({ ...d, company: v })} />
        <FieldInput label="Period" value={d.period} onChange={(v: string) => setD({ ...d, period: v })} />
        <FieldInput label="Description" value={d.description} onChange={(v: string) => setD({ ...d, description: v })} type="textarea" />
        <FieldInput label="Order" value={String(d.order)} onChange={(v: string) => setD({ ...d, order: Number(v) })} type="number" />
        <button onClick={() => onSave(d)} disabled={saving}
          className="w-full bg-primary text-white font-bold py-4 text-sm tracking-[0.1em] hover:bg-accent hover:text-primary transition-all disabled:opacity-60">
          {saving ? 'SAVING...' : 'SAVE'}
        </button>
      </div>
    );
  };

  const SkillForm = ({ initial, onSave }: any) => {
    const [d, setD] = useState(initial);
    return (
      <div className="space-y-4">
        <FieldInput label="Category" value={d.category} onChange={(v: string) => setD({ ...d, category: v })} />
        <FieldInput label="Skills (comma separated)" value={d.items} onChange={(v: string) => setD({ ...d, items: v })} type="textarea" />
        <button onClick={() => onSave(d)} disabled={saving}
          className="w-full bg-primary text-white font-bold py-4 text-sm tracking-[0.1em] hover:bg-accent hover:text-primary transition-all disabled:opacity-60">
          {saving ? 'SAVING...' : 'SAVE'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="font-display font-bold text-xl lowercase">
            gulfamali<span className="text-accent">.dev</span>
          </Link>
          <div className="text-white/40 text-xs mt-1 font-bold tracking-[0.1em]">ADMIN PANEL</div>
        </div>
        <nav className="flex flex-col p-6 gap-1 flex-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`text-left px-4 py-3 text-[11px] font-bold tracking-[0.15em] transition-all ${tab === t.id ? 'bg-accent text-primary' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10 space-y-3">
          <a href="/" target="_blank" className="flex items-center gap-2 text-white/40 text-[11px] font-bold tracking-[0.15em] hover:text-white transition-colors">
            <Eye size={12} /> VIEW SITE
          </a>
          <button onClick={() => logout()} className="flex items-center gap-2 text-accent text-[11px] font-bold tracking-[0.15em] hover:opacity-70 transition-opacity">
            <LogOut size={12} /> LOGOUT
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto admin-scroll">
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="fixed top-4 right-4 z-[300] bg-accent text-primary font-bold text-sm px-6 py-3 shadow-xl">
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-8 md:p-12">
          {/* ── INBOX ── */}
          {tab === 'inquiries' && (
            <div>
              <h1 className="font-display font-bold text-4xl tracking-tight mb-8">INBOX <span className="text-accent">{inquiries.length}</span></h1>
              {inquiries.length === 0 && <p className="text-on-surface-variant text-sm">No messages yet.</p>}
              <div className="space-y-4 max-w-3xl">
                {inquiries.map(inq => (
                  <motion.div key={inq.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-white border border-surface-dim p-6 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-display font-bold text-lg">{inq.name}</h4>
                        <a href={`mailto:${inq.email}`} className="text-primary text-xs font-bold underline">{inq.email}</a>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-on-surface-variant font-bold">
                          {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </span>
                        <button onClick={() => inq.id && del('inquiries', inq.id)}
                          className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed bg-surface p-4 border border-surface-dim">{inq.message}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {tab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-display font-bold text-4xl tracking-tight">PROJECTS</h1>
                <button onClick={() => setModal({ open: true, title: 'ADD PROJECT', content: <ProjectForm initial={{ title: '', description: '', techStack: '', link: '', imageUrl: '', order: projects.length + 1 }} onSave={(d: any) => save('projects', d)} /> })}
                  className="flex items-center gap-2 bg-primary text-white font-bold text-xs px-5 py-3 tracking-[0.1em] hover:bg-accent hover:text-primary transition-all">
                  <Plus size={14} /> ADD PROJECT
                </button>
              </div>
              <div className="space-y-3 max-w-3xl">
                {projects.map(p => (
                  <div key={p.id} className="bg-white border border-surface-dim p-5 flex items-center gap-4 group hover:border-primary transition-colors">
                    {p.imageUrl && (
                      <img src={p.imageUrl} className="w-16 h-16 object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all" alt="" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-lg tracking-tight">{p.title}</h4>
                      <p className="text-xs text-primary font-bold mt-0.5">{p.techStack}</p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => setModal({ open: true, title: 'EDIT PROJECT', content: <ProjectForm initial={p} onSave={(d: any) => save('projects', { ...d, id: p.id })} /> })}
                        className="text-on-surface-variant hover:text-primary transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => p.id && del('projects', p.id)}
                        className="text-on-surface-variant hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── EXPERIENCE ── */}
          {/* SERVICES */}
          {tab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-display font-bold text-4xl tracking-tight">SERVICES</h1>
                <button onClick={() => setModal({ open: true, title: 'ADD SERVICE', content: <ServiceForm initial={{ icon: 'layout', num: String(services.length + 1).padStart(2, '0'), title: '', desc: '', tags: [], order: services.length + 1 }} onSave={(d: any) => save('services', d)} /> })}
                  className="flex items-center gap-2 bg-primary text-white font-bold text-xs px-5 py-3 tracking-[0.1em] hover:bg-accent hover:text-primary transition-all">
                  <Plus size={14} /> ADD SERVICE
                </button>
              </div>
              <div className="space-y-3 max-w-3xl">
                {services.map(s => (
                  <div key={s.id} className="bg-white border border-surface-dim p-5 flex items-start gap-4 group hover:border-primary transition-colors">
                    <div className="w-12 h-12 bg-surface border border-surface-dim flex items-center justify-center text-primary shrink-0">
                      {getServiceIcon(s.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-lg tracking-tight">{s.num} - {s.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{s.desc}</p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => setModal({ open: true, title: 'EDIT SERVICE', content: <ServiceForm initial={s} onSave={(d: any) => save('services', { ...d, id: s.id })} /> })}
                        className="text-on-surface-variant hover:text-primary transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => s.id && del('services', s.id)}
                        className="text-on-surface-variant hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {tab === 'testimonials' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-display font-bold text-4xl tracking-tight">REVIEWS</h1>
                <button onClick={() => setModal({ open: true, title: 'ADD REVIEW', content: <TestimonialForm initial={{ name: '', role: '', text: '', order: testimonials.length + 1 }} onSave={(d: any) => save('testimonials', d)} /> })}
                  className="flex items-center gap-2 bg-primary text-white font-bold text-xs px-5 py-3 tracking-[0.1em] hover:bg-accent hover:text-primary transition-all">
                  <Plus size={14} /> ADD REVIEW
                </button>
              </div>
              <div className="space-y-3 max-w-3xl">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white border border-surface-dim p-5 group hover:border-primary transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-display font-bold text-lg">{t.name}</h4>
                        <p className="text-xs font-bold text-primary">{t.role}</p>
                        <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">{t.text}</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setModal({ open: true, title: 'EDIT REVIEW', content: <TestimonialForm initial={t} onSave={(d: any) => save('testimonials', { ...d, id: t.id })} /> })}
                          className="text-on-surface-variant hover:text-primary transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => t.id && del('testimonials', t.id)}
                          className="text-on-surface-variant hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'experience' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-display font-bold text-4xl tracking-tight">EXPERIENCE</h1>
                <button onClick={() => setModal({ open: true, title: 'ADD EXPERIENCE', content: <ExpForm initial={{ role: '', company: '', period: '', description: '', order: experience.length + 1 }} onSave={(d: any) => save('experience', d)} /> })}
                  className="flex items-center gap-2 bg-primary text-white font-bold text-xs px-5 py-3 tracking-[0.1em] hover:bg-accent hover:text-primary transition-all">
                  <Plus size={14} /> ADD
                </button>
              </div>
              <div className="space-y-3 max-w-3xl">
                {experience.map(exp => (
                  <div key={exp.id} className="bg-white border border-surface-dim p-5 group hover:border-primary transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display font-bold text-lg">{exp.role}</h4>
                        <p className="text-xs font-bold text-primary">{exp.company} · {exp.period}</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setModal({ open: true, title: 'EDIT EXPERIENCE', content: <ExpForm initial={exp} onSave={(d: any) => save('experience', { ...d, id: exp.id })} /> })}
                          className="text-on-surface-variant hover:text-primary transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => exp.id && del('experience', exp.id)}
                          className="text-on-surface-variant hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SKILLS ── */}
          {tab === 'skills' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="font-display font-bold text-4xl tracking-tight">SKILLS</h1>
                <button onClick={() => setModal({ open: true, title: 'ADD SKILL CATEGORY', content: <SkillForm initial={{ category: '', items: '' }} onSave={(d: any) => save('skills', d)} /> })}
                  className="flex items-center gap-2 bg-primary text-white font-bold text-xs px-5 py-3 tracking-[0.1em] hover:bg-accent hover:text-primary transition-all">
                  <Plus size={14} /> ADD CATEGORY
                </button>
              </div>
              <div className="space-y-3 max-w-3xl">
                {skills.map(s => (
                  <div key={s.id} className="bg-white border border-surface-dim p-5 group hover:border-primary transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display font-bold text-lg text-primary">{s.category}</h4>
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{s.items}</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setModal({ open: true, title: 'EDIT SKILLS', content: <SkillForm initial={s} onSave={(d: any) => save('skills', { ...d, id: s.id })} /> })}
                          className="text-on-surface-variant hover:text-primary transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => s.id && del('skills', s.id)}
                          className="text-on-surface-variant hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <div className="max-w-2xl">
              <h1 className="font-display font-bold text-4xl tracking-tight mb-8">PROFILE</h1>
              <div className="bg-white border border-surface-dim p-8 space-y-5">
                {([
                  ['Name', 'name'],
                  ['Hero Title Line 1', 'heroTitle1'],
                  ['Hero Title Line 2', 'heroTitle2'],
                  ['Hero Subtitle', 'heroSubtitle'],
                  ['Profile Image URL', 'profileImageUrl'],
                  ['Email', 'email'],
                  ['Phone', 'phone'],
                  ['Location', 'location'],
                  ['LinkedIn URL', 'linkedin'],
                  ['GitHub URL', 'github'],
                  ['Facebook URL', 'facebook'],
                  ['Instagram URL', 'instagram'],
                  ['Admin Email (who can log in)', 'adminEmail'],
                ] as [string, keyof Profile][]).map(([label, key]) => (
                  <FieldInput key={key} label={label} value={(profileData as any)[key] || ''}
                    onChange={(v: string) => setProfileData({ ...profileData, [key]: v })}
                    type={key === 'heroSubtitle' ? 'textarea' : 'text'} />
                ))}
                {profileData.profileImageUrl && (
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">IMAGE PREVIEW</div>
                    <img src={profileData.profileImageUrl} className="h-32 object-cover border border-surface-dim" alt="Profile preview"
                      onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                  </div>
                )}
                <button onClick={saveProfile} disabled={saving}
                  className="w-full bg-primary text-white font-bold py-4 text-sm tracking-[0.1em] hover:bg-accent hover:text-primary transition-all disabled:opacity-60">
                  {saving ? 'SAVING...' : 'SAVE PROFILE'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal open={modal.open} onClose={() => setModal({ ...modal, open: false })} title={modal.title}>
        {modal.content}
      </Modal>
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
