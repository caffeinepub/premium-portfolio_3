import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronDown,
  Download,
  Loader2,
  Mail,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiInstagram, SiLinkedin } from "react-icons/si";
import { toast } from "sonner";

// ─── Motion variants ──────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: 0.3 + i * 0.07,
    },
  }),
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Skill {
  name: string;
  level: number;
}

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

interface Project {
  title: string;
  description: string;
  outcome: string;
  image: string;
  tags: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SKILLS: Skill[] = [
  { name: "Braze CRM", level: 95 },
  { name: "Canvas Flows", level: 92 },
  { name: "Liquid Logic", level: 90 },
  { name: "API-Triggered Messaging", level: 88 },
  { name: "HTML/CSS Email Development", level: 90 },
  { name: "Audience Segmentation", level: 88 },
  { name: "A/B Testing", level: 85 },
  { name: "Dynamic & Connected Content", level: 87 },
  { name: "Deliverability Optimization", level: 82 },
  { name: "Campaign Analytics & KPI Reporting", level: 85 },
  { name: "Adobe Experience Manager (AEM)", level: 80 },
  { name: "Responsive Email Design", level: 88 },
];

const EXPERIENCES: ExperienceItem[] = [
  {
    role: "AEM Author",
    company: "eClerx Services Limited — Client: Seagate",
    period: "Jun 2025 – Present",
    bullets: [
      "Managed end-to-end content lifecycle for Seagate in AEM — processing 20+ weekly Workfront tickets with an average 24-hour turnaround from assignment to publish.",
      "Created multiple content fragment types (promotional, article, person page, etc.) — delivering 30+ fragments per month with zero structural errors across all client reviews.",
      "Published 10+ weekly promotional updates for Seagate including deals, promo cards, badges, and alert banners — maintaining a 100% on-time publish rate.",
      "Built and maintained 50+ Product Description Pages (PDPs) in AEM — configuring SKUs with multiple variants, specifications, and client-provided details.",
    ],
  },
  {
    role: "CRM Analyst — Marketing Automation",
    company: "eClerx Services Limited — Client: Venmo (PayPal)",
    period: "Jun 2024 – Jun 2025",
    bullets: [
      "Planned and deployed 30+ tactical and strategic Braze campaigns/month across email, push notifications, in-app messages, and content cards — achieving 22% higher user engagement.",
      "Developed dynamic HTML/CSS email creatives and content cards using Liquid templating and API logic in Braze, delivering customized experiences to 500K+ users with 40% less manual effort.",
      "Engineered Canvas workflows with precise audience segmentation, targeting, and A/B testing — boosting campaign conversion rates by ~18% over 6 months.",
      "Monitored campaign KPIs (open rate, CTR, deliverability) and made data-driven adjustments — improving deliverability by ~15%.",
      "Cut campaign build time by ~30% through reusable template libraries and standardized Canvas workflows.",
    ],
  },
];

const PROJECTS: Project[] = [
  {
    title: "Venmo Multi-Channel Campaign Suite",
    description:
      "Planned and deployed 30+ Braze campaigns/month across email, push, in-app, and content cards for Venmo — personalizing experiences for 500K+ users.",
    outcome: "22% Engagement Lift",
    image: "/assets/generated/project-onboarding.dim_600x400.jpg",
    tags: ["Braze", "Multi-Channel", "Personalization"],
  },
  {
    title: "Canvas Workflow Automation",
    description:
      "Engineered Canvas flows with precise audience segmentation and A/B testing — cutting campaign build time by 30% and boosting conversion rates by ~18%.",
    outcome: "30% Faster Build Time",
    image: "/assets/generated/project-aem.dim_600x400.jpg",
    tags: ["Canvas Flows", "A/B Testing", "Automation"],
  },
  {
    title: "HTML/CSS Dynamic Email Creatives",
    description:
      "Built dynamic email creatives and content cards using Liquid templating and API logic in Braze — delivering personalized experiences with 40% less manual effort.",
    outcome: "40% Less Manual Effort",
    image: "/assets/generated/project-workfront.dim_600x400.jpg",
    tags: ["Liquid Logic", "HTML/CSS", "Dynamic Content"],
  },
  {
    title: "Seagate AEM Content Operations",
    description:
      "Managed Seagate's full content lifecycle in AEM — publishing 10+ weekly promos and building 50+ PDPs with a 100% on-time publish rate.",
    outcome: "100% On-Time Publish Rate",
    image: "/assets/generated/project-analytics.dim_600x400.jpg",
    tags: ["AEM", "Content Ops", "Workfront"],
  },
];

const RESUME_HIGHLIGHTS = [
  { value: "2+", label: "Years Experience" },
  { value: "3", label: "Braze Certifications" },
  { value: "22%", label: "Engagement Improvement" },
  { value: "500K+", label: "Users Reached" },
];

const CERTIFICATIONS = [
  "Braze Certified Practitioner — Braze (2026)",
  "Braze Certified Marketer — Braze (2026)",
  "Braze Certified Developer — Braze (2026)",
  "Database Management Systems — Infosys Springboard (2023)",
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

const ABOUT_FEATURES = [
  { icon: "🎯", text: "Braze Campaign Orchestration" },
  { icon: "⚡", text: "Marketing Automation" },
  { icon: "📊", text: "Campaign Analytics & KPIs" },
  { icon: "🔧", text: "HTML/CSS Email Development" },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({
  id,
  children,
  className = "",
}: { id: string; children: React.ReactNode; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <section
      id={id}
      ref={ref}
      className={`py-24 md:py-32 ${className} ${
        visible ? "section-visible" : "section-hidden"
      }`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  label,
  title,
  subtitle,
}: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
        className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-accent-blue mb-4"
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.65,
          delay: 0.07,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
        className="text-3xl md:text-[2.6rem] font-bold tracking-[-0.025em] leading-[1.15] text-foreground mb-4"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.14,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="text-muted-foreground max-w-lg mx-auto text-[0.95rem] leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.8,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled ? "w-[90%] max-w-2xl" : "w-[95%] max-w-4xl"
        }`}
      >
        <nav
          className={`glass rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "shadow-[0_8px_32px_oklch(0_0_0/0.15)]" : ""
          }`}
        >
          {/* Brand */}
          <button
            type="button"
            onClick={() => handleNavClick("#hero")}
            className="font-semibold text-foreground text-sm tracking-[-0.01em] whitespace-nowrap hover:text-accent-blue transition-colors"
            data-ocid="nav.link"
          >
            Siddhant Singh
          </button>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3 py-1.5 text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-full hover:bg-accent relative group"
                data-ocid="nav.link"
              >
                {link.label}
                <span className="absolute bottom-1 left-3 right-3 h-px rounded-full bg-accent-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggle}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              aria-label="Toggle dark mode"
              data-ocid="nav.toggle"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={dark ? "sun" : "moon"}
                  initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.5, rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {dark ? (
                    <Sun className="w-[14px] h-[14px]" />
                  ) : (
                    <Moon className="w-[14px] h-[14px]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
            <button
              type="button"
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? "close" : "open"}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? (
                    <X className="w-[14px] h-[14px]" />
                  ) : (
                    <Menu className="w-[14px] h-[14px]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="fixed top-[4.5rem] left-4 right-4 z-40 glass rounded-2xl p-2 shadow-xl"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent transition-all duration-150"
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const HERO_LINE1 = ["Building", "Smart"];
const HERO_LINE2 = ["Marketing", "Experiences"];

function Hero() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 60]);
  const textY = useTransform(scrollY, [0, 600], [0, 30]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-noise"
    >
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.58 0.22 265 / 0.13) 0%, transparent 65%)",
            animation: "orb-drift 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.18 240 / 0.07) 0%, transparent 70%)",
            animation: "orb-drift 22s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute bottom-[20%] right-[15%] w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.62 0.2 285 / 0.07) 0%, transparent 70%)",
            animation: "orb-drift 26s ease-in-out infinite 4s",
          }}
        />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
          role="presentation"
          className="w-full"
        >
          <path
            d="M0,30 C360,5 720,55 1080,30 C1260,17 1380,38 1440,30 L1440,60 L0,60 Z"
            fill="oklch(var(--background))"
          />
        </svg>
      </div>

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="flex justify-center mb-8"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.15em] uppercase text-accent-blue"
            style={{
              border: "1px solid oklch(var(--accent-blue) / 0.35)",
              background: "oklch(var(--accent-blue) / 0.07)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent-blue"
              style={{ boxShadow: "0 0 6px oklch(var(--accent-blue) / 0.8)" }}
            />
            CRM & Marketing Automation Specialist
          </span>
        </motion.div>

        {/* H1 */}
        <h1 className="text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold tracking-[-0.04em] leading-[1.04] text-foreground mb-6">
          <span className="block">
            {HERO_LINE1.map((word, i) => (
              <motion.span
                key={word}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
                className="inline-block mr-[0.22em]"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block">
            {HERO_LINE2.map((word, i) => (
              <motion.span
                key={word}
                custom={HERO_LINE1.length + i}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
                className={`inline-block mr-[0.22em] ${
                  word === "Marketing" ? "hero-gradient-text" : ""
                }`}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.72,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="text-[1.0625rem] md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-[1.7] font-light"
        >
          Braze specialist scaling personalized campaigns to 500K+ users through
          Canvas flows, Liquid logic, and HTML/CSS email development.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.88,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <button
            type="button"
            onClick={() =>
              document
                .querySelector("#projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-primary px-7 py-3.5 rounded-full font-semibold text-sm text-white flex items-center gap-2"
            data-ocid="hero.primary_button"
          >
            View Work <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-7 py-3.5 rounded-full font-semibold text-sm border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-200"
            data-ocid="hero.secondary_button"
          >
            Contact Me
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground font-medium">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground animate-bounce" />
      </motion.div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <Section id="about">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader label="About Me" title="Who I Am" />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col md:flex-row gap-14 items-center"
        >
          {/* Profile photo */}
          <motion.div variants={itemVariants} className="flex-shrink-0">
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-[2rem] opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 265 / 0.4), oklch(0.65 0.18 285 / 0.2))",
                  filter: "blur(12px)",
                }}
              />
              <div
                className="relative w-56 h-56 md:w-[17rem] md:h-[17rem] rounded-[1.75rem] overflow-hidden"
                style={{
                  boxShadow:
                    "0 32px 64px oklch(0 0 0 / 0.25), inset 0 0 0 1px oklch(var(--border))",
                }}
              >
                <img
                  src="/assets/uploads/IMG_8011-2.jpeg"
                  alt="Siddhant Singh"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <div className="flex-1">
            <motion.h3
              variants={itemVariants}
              className="text-2xl font-bold tracking-[-0.02em] text-foreground mb-1"
            >
              Siddhant Singh
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className="text-accent-blue text-sm font-semibold tracking-[0.04em] uppercase mb-5"
            >
              CRM & Marketing Automation Specialist | Braze Certified
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-muted-foreground leading-[1.8] mb-8 text-[0.9375rem]"
            >
              2 years of experience in CRM and marketing automation. Braze
              specialist who managed campaigns for Venmo (PayPal), driving a 22%
              improvement in engagement and 15% in deliverability — earning all
              3 Braze certifications in 2026. Expert at scaling personalized
              communication to 500K+ users across email, push, and in-app
              channels.
            </motion.p>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-3"
            >
              {ABOUT_FEATURES.map((item) => (
                <motion.div
                  key={item.text}
                  variants={itemVariants}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border text-sm font-medium text-foreground"
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function SkillBar({
  skill,
  index,
  visible,
}: { skill: Skill; index: number; visible: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(
      () => barRef.current?.classList.add("bar-filled"),
      index * 60 + 1300,
    );
    return () => clearTimeout(timer);
  }, [visible, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.055,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
    >
      <div className="flex justify-between mb-2 text-sm">
        <span className="font-medium text-foreground">{skill.name}</span>
        <span className="text-muted-foreground tabular-nums">
          {skill.level}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-visible"
        style={{ background: "oklch(var(--border))" }}
      >
        <div
          ref={barRef}
          className="h-full rounded-full skill-bar-fill"
          style={{
            width: visible ? `${skill.level}%` : "0%",
            background:
              "linear-gradient(90deg, oklch(0.52 0.22 265), oklch(0.65 0.2 275))",
            transitionDelay: `${index * 55 + 150}ms`,
          }}
        />
      </div>
    </motion.div>
  );
}

function Skills() {
  const { ref, visible } = useInView(0.08);
  return (
    <section
      id="skills"
      ref={ref}
      className={`py-24 md:py-32 ${
        visible ? "section-visible" : "section-hidden"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Expertise"
          title="Skills & Tools"
          subtitle="Deep expertise across the modern marketing technology stack."
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 justify-center mb-14"
        >
          {SKILLS.map((s) => (
            <motion.span
              key={s.name}
              variants={itemVariants}
              className="px-4 py-1.5 rounded-full text-[0.8125rem] font-medium border border-border bg-card text-muted-foreground hover:border-accent-blue hover:text-accent-blue transition-all duration-200 cursor-default"
            >
              {s.name}
            </motion.span>
          ))}
        </motion.div>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-5">
          {SKILLS.map((skill, i) => (
            <SkillBar
              key={skill.name}
              skill={skill}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────
function Experience() {
  return (
    <Section id="experience">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader
          label="Career"
          title="Work Experience"
          subtitle="Building impactful marketing experiences across two roles."
        />
        <div className="relative pl-8 border-l border-border space-y-10">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
              className="relative"
            >
              <div
                className="absolute -left-[37px] top-5 w-3.5 h-3.5 rounded-full border-2 border-background"
                style={{
                  background: "oklch(var(--accent-blue))",
                  boxShadow: "0 0 0 4px oklch(var(--accent-blue) / 0.15)",
                }}
              />
              <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                  <h3 className="text-[1.0625rem] font-bold tracking-[-0.01em] text-foreground leading-snug">
                    {exp.role}
                  </h3>
                  <span
                    className="shrink-0 text-[0.7rem] font-semibold px-2.5 py-1 rounded-full tracking-wide"
                    style={{
                      background: "oklch(var(--accent-blue) / 0.1)",
                      color: "oklch(var(--accent-blue))",
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
                <p className="text-accent-blue text-[0.8125rem] font-semibold mb-4 tracking-[0.02em] uppercase">
                  {exp.company}
                </p>
                <ul className="space-y-2">
                  {exp.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-2.5 text-[0.875rem] text-muted-foreground leading-[1.65]"
                    >
                      <span
                        className="mt-[0.35em] flex-shrink-0 w-1 h-1 rounded-full"
                        style={{ background: "oklch(var(--accent-blue))" }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Projects() {
  return (
    <Section id="projects">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Portfolio"
          title="Selected Projects"
          subtitle="Real outcomes from data-driven marketing initiatives."
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-2 gap-6"
        >
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="group bg-card rounded-3xl overflow-hidden border border-border card-hover"
              data-ocid={`projects.item.${i + 1}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[0.7rem] font-bold text-white tracking-wide"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.22 265 / 0.9), oklch(0.48 0.24 278 / 0.9))",
                    backdropFilter: "blur(8px)",
                    border: "1px solid oklch(1 0 0 / 0.15)",
                  }}
                >
                  {project.outcome}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-[1.0625rem] font-bold tracking-[-0.01em] text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-[0.875rem] text-muted-foreground leading-[1.7] mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold tracking-wide border border-border text-muted-foreground uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Resume ───────────────────────────────────────────────────────────────────
function Resume() {
  return (
    <Section id="resume">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <SectionHeader
          label="Resume"
          title="Download My CV"
          subtitle="A summary of my experience, skills, and achievements."
        />
        {/* Stat cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {RESUME_HIGHLIGHTS.map((h) => (
            <motion.div
              key={h.label}
              variants={itemVariants}
              className="bg-card rounded-2xl p-5 border border-border"
            >
              <div
                className="text-3xl font-extrabold mb-1.5 tracking-[-0.03em]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.22 255), oklch(0.58 0.24 270))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {h.value}
              </div>
              <div className="text-[0.75rem] text-muted-foreground font-medium tracking-[0.02em]">
                {h.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="bg-card rounded-2xl p-6 border border-border mb-6 text-left"
        >
          <h4 className="text-[0.75rem] font-semibold tracking-[0.15em] uppercase text-accent-blue mb-4">
            Certifications
          </h4>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {CERTIFICATIONS.map((cert, i) => (
              <motion.span
                key={cert}
                variants={itemVariants}
                custom={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.775rem] font-medium border border-border bg-background text-foreground"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "oklch(var(--accent-blue))" }}
                />
                {cert}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            delay: 0.22,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="bg-card rounded-2xl p-6 border border-border mb-10 text-left"
        >
          <h4 className="text-[0.75rem] font-semibold tracking-[0.15em] uppercase text-accent-blue mb-3">
            Education
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <p className="text-[0.9375rem] font-bold text-foreground tracking-[-0.01em]">
                B.Tech in Computer Science & Engineering
              </p>
              <p className="text-[0.8125rem] text-muted-foreground mt-0.5">
                Lovely Professional University, Phagwara, India
              </p>
            </div>
            <div className="text-right shrink-0">
              <span
                className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-full tracking-wide"
                style={{
                  background: "oklch(var(--accent-blue) / 0.1)",
                  color: "oklch(var(--accent-blue))",
                }}
              >
                2020 – 2024
              </span>
              <p className="text-[0.8125rem] text-muted-foreground mt-1.5">
                CGPA: 7.55
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
        >
          <button
            type="button"
            onClick={() =>
              window.open(
                "/assets/uploads/Siddhant_Singh-18-march-2026--1.pdf",
                "_blank",
              )
            }
            className="btn-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-sm text-white"
            data-ocid="resume.primary_button"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </button>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const { actor } = useActor();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitMessage(data.name, data.email, data.message);
    },
    onSuccess: () => {
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Section id="contact">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Get in Touch"
          title="Let's Work Together"
          subtitle="Have a project in mind? I'd love to hear about it."
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-2 gap-14"
        >
          {/* Left */}
          <motion.div variants={itemVariants}>
            <p className="text-muted-foreground leading-[1.8] mb-10 text-[0.9375rem]">
              Whether you need to build a sophisticated marketing automation
              system, scale personalized multi-channel campaigns, or optimize
              your CRM workflows — I'm here to help craft the perfect solution.
            </p>
            <div className="space-y-3">
              {[
                {
                  href: "https://linkedin.com/in/oksiddhant",
                  icon: <SiLinkedin className="w-4 h-4" />,
                  label: "LinkedIn",
                  external: true,
                },
                {
                  href: "https://instagram.com",
                  icon: <SiInstagram className="w-4 h-4" />,
                  label: "Instagram",
                  external: true,
                },
                {
                  href: "mailto:siddhantsingh.1654@gmail.com",
                  icon: <Mail className="w-4 h-4" />,
                  label: "siddhantsingh.1654@gmail.com",
                  external: false,
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3.5 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                  data-ocid="contact.link"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-border bg-card group-hover:border-accent-blue group-hover:bg-accent transition-all duration-200">
                    {item.icon}
                  </div>
                  <span className="text-[0.875rem] font-medium">
                    {item.label}
                  </span>
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ml-auto" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-3"
            data-ocid="contact.modal"
          >
            <Input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              className="input-premium rounded-xl bg-card border-border h-11 text-[0.875rem] placeholder:text-muted-foreground"
              data-ocid="contact.input"
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              required
              className="input-premium rounded-xl bg-card border-border h-11 text-[0.875rem] placeholder:text-muted-foreground"
              data-ocid="contact.input"
            />
            <Textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value }))
              }
              required
              rows={5}
              className="input-premium rounded-xl bg-card border-border resize-none text-[0.875rem] placeholder:text-muted-foreground"
              data-ocid="contact.textarea"
            />
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full btn-primary rounded-full font-semibold py-[1.35rem] text-sm text-white mt-1"
              style={{ background: undefined }}
              data-ocid="contact.submit_button"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send Message
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </Button>
            <AnimatePresence>
              {mutation.isSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[0.8125rem] font-medium"
                  style={{ color: "oklch(0.72 0.17 145)" }}
                  data-ocid="contact.success_state"
                >
                  ✓ Message sent successfully!
                </motion.p>
              )}
              {mutation.isError && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[0.8125rem] font-medium text-destructive"
                  data-ocid="contact.error_state"
                >
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[0.8125rem] text-muted-foreground">
          © {year} Siddhant Singh. Built with{" "}
          <span style={{ color: "oklch(0.7 0.22 25)" }}>♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-200 underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
        <div className="flex items-center gap-2">
          {[
            {
              href: "https://linkedin.com/in/oksiddhant",
              icon: <SiLinkedin className="w-3.5 h-3.5" />,
              label: "LinkedIn",
            },
            {
              href: "https://instagram.com",
              icon: <SiInstagram className="w-3.5 h-3.5" />,
              label: "Instagram",
            },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200"
              data-ocid="footer.link"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { dark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-background">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
            color: "oklch(var(--foreground))",
          },
        }}
      />
      <Navbar dark={dark} onToggle={toggle} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
