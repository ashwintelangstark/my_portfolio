import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/portfolio-data";
import portrait from "@/assets/portrait.png.asset.json";
import moon from "@/assets/moon.png.asset.json";
import object from "@/assets/object.png.asset.json";
import lego from "@/assets/lego.png.asset.json";
import group from "@/assets/group.png.asset.json";

const ease = [0.25, 0.1, 0.25, 1] as const;

export function FadeIn({ children, delay = 0, x = 0, y = 30, className = "" }: { children: ReactNode; delay?: number; x?: number; y?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: "50px", amount: 0 }} transition={{ duration: 0.7, delay, ease }}>{children}</motion.div>;
}

export function ContactButton() {
  return <Button asChild variant="hero" className="h-auto rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"><Link to="/contact">Contact Me <ArrowUpRight aria-hidden="true" /></Link></Button>;
}

export function Nav({ className = "" }: { className?: string }) {
  return <nav aria-label="Main navigation" className={`relative z-30 flex items-center justify-between gap-3 px-6 pt-6 text-sm font-medium uppercase tracking-wider text-foreground md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem] ${className}`}>
    <Link to="/" aria-label="Back to home" title="Back to home" className="flex shrink-0 items-center gap-1 transition-opacity duration-200 hover:opacity-70"><ArrowLeft aria-hidden="true" className="size-4 md:size-5" /><span className="hidden sm:inline">Home</span></Link>
    <Link to="/about" className="transition-opacity duration-200 hover:opacity-70">About</Link>
    <Link to="/projects" className="transition-opacity duration-200 hover:opacity-70">Projects</Link>
    <Link to="/contact" className="transition-opacity duration-200 hover:opacity-70">Contact</Link>
  </nav>;
}

function Magnet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (event: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      if (event.clientX >= rect.left - 150 && event.clientX <= rect.right + 150 && event.clientY >= rect.top - 150 && event.clientY <= rect.bottom + 150) setPosition({ x: (event.clientX - cx) / 3, y: (event.clientY - cy) / 3 });
      else setPosition({ x: 0, y: 0 });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)`, transition: position.x || position.y ? "transform .3s ease-out" : "transform .6s ease-in-out", willChange: "transform" }}>{children}</div>;
}

export function Hero() {
  return <header className="relative flex h-screen min-h-[590px] flex-col overflow-hidden bg-background">
    <FadeIn y={-20}><Nav /></FadeIn>
    <div className="relative z-0 mt-6 w-full overflow-hidden sm:mt-4 md:-mt-5"><FadeIn delay={0.15} y={40}><h1 className="hero-heading w-full whitespace-nowrap text-center text-[9vw] font-black uppercase leading-none">Hi, i'm Ashwin</h1></FadeIn></div>
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]"><FadeIn delay={0.6} y={30}><Magnet><img src={portrait.url} alt="Ashwin portfolio portrait" className="h-auto w-full object-contain" /></Magnet></FadeIn></div>
    <div className="relative z-20 mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
      <FadeIn delay={0.35} y={20}><p className="max-w-[160px] text-[clamp(.75rem,1.4vw,1.5rem)] font-light uppercase leading-snug tracking-wide text-foreground sm:max-w-[220px] md:max-w-[260px]">An AI and robotics engineer driven by building intelligent systems</p></FadeIn>
      <FadeIn delay={0.5} y={20}><ContactButton /></FadeIn>
    </div>
  </header>;
}

const gallery = projects.map((project) => project.image);

export function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const update = () => { if (ref.current) setOffset((window.scrollY - (ref.current.getBoundingClientRect().top + window.scrollY) + window.innerHeight) * 0.3); };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <section ref={ref} aria-label="Project imagery" className="overflow-hidden bg-background pt-24 pb-10 sm:pt-32 md:pt-40">
    {[gallery.slice(0, 10), gallery.slice(10)].map((row, ri) => <div key={ri} className="mb-3 flex w-max gap-3" style={{ transform: `translateX(${ri === 0 ? offset - 200 - 4600 : -(offset - 200)}px)`, willChange: "transform" }} aria-hidden="true">{[...row, ...row, ...row].map((src, i) => <img key={i} src={src} alt="" loading="lazy" width={420} height={270} className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover" />)}</div>)}
  </section>;
}

const aboutText = "I build at the intersection of AI, robotics, computer vision and connected systems. From multimodal assistants and voice agents to tiger re-identification, autonomous simulations and IoT prototypes, I turn complex ideas into working technology. My work spans research, full-stack products and real-world engineering. Let's build something incredible together!";

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  return <p ref={ref} className="mx-auto max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-foreground" aria-label={text}>
    {text.split("").map((char, i) => <Character key={i} char={char} progress={scrollYProgress} start={i / text.length} end={(i + 1) / text.length} />)}
  </p>;
}

function Character({ char, progress, start, end }: { char: string; progress: ReturnType<typeof useScroll>["scrollYProgress"]; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return <span className="relative" aria-hidden="true"><span className="opacity-0">{char}</span><motion.span className="absolute inset-0" style={{ opacity }}>{char}</motion.span></span>;
}

export function AboutSection({ full = false }: { full?: boolean }) {
  return <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-5 py-20 sm:px-8 md:px-10">
    <FadeIn delay={0.1} x={-80} y={0} className="pointer-events-none absolute top-[4%] left-[1%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]"><img src={moon.url} alt="" className="w-full" /></FadeIn>
    <FadeIn delay={0.25} x={-80} y={0} className="pointer-events-none absolute bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]"><img src={object.url} alt="" className="w-full" /></FadeIn>
    <FadeIn delay={0.15} x={80} y={0} className="pointer-events-none absolute top-[4%] right-[1%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]"><img src={lego.url} alt="" className="w-full" /></FadeIn>
    <FadeIn delay={0.3} x={80} y={0} className="pointer-events-none absolute right-[3%] bottom-[8%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]"><img src={group.url} alt="" className="w-full" /></FadeIn>
    <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16"><FadeIn y={40}>{full ? <h1 className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none">About me</h1> : <h2 className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none">About me</h2>}</FadeIn><AnimatedText text={aboutText} />
      {full && <FadeIn className="mx-auto max-w-[560px] text-center text-lg font-light leading-relaxed text-foreground">Across personal, academic and industry projects, I have worked on AI-powered software, embedded sensing, robotic control, computer vision research and production-ready applications.</FadeIn>}
      <FadeIn className="mt-6 sm:mt-8 md:mt-10"><ContactButton /></FadeIn></div>
  </section>;
}

export function ProjectCard({ project, index, total }: { project: (typeof projects)[number]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - 1 - index) * 0.03]);
  return <div ref={ref} className="relative h-[85vh] min-h-[590px]"><motion.article style={{ scale, top: `${96 + index * 28}px` }} className="project-border sticky h-[min(72vh,760px)] min-h-[490px] overflow-hidden rounded-[40px] border-2 bg-background p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8">
    <div className="flex h-full flex-col gap-4 sm:gap-5"><div className="flex shrink-0 items-center justify-between gap-3"><span className="text-[clamp(2.5rem,8vw,7rem)] font-black leading-none">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1 text-center"><span className="block text-[10px] font-light uppercase tracking-widest sm:text-xs">{project.category} / {project.year}</span><h3 className="truncate text-lg font-medium uppercase sm:text-2xl md:text-3xl">{project.name}</h3></div><Button asChild variant="project" className="h-auto rounded-full px-3 py-2 text-[10px] uppercase tracking-wider sm:px-8 sm:py-3 sm:text-sm"><Link to="/projects" hash={project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}>View project <ArrowUpRight aria-hidden="true" /></Link></Button></div>
    <div className="grid min-h-0 flex-1 grid-cols-[40%_60%] gap-2 pr-2 sm:gap-3 sm:pr-3"><div className="flex min-h-0 flex-col gap-2 sm:gap-3"><img src={project.image} alt={`${project.name} visual reference`} loading="lazy" width={1200} height={800} className="min-h-0 flex-1 w-full rounded-[28px] object-cover sm:rounded-[40px] md:rounded-[50px]" /><div className="flex min-h-0 flex-1 flex-col justify-end rounded-[28px] border border-border p-4 sm:rounded-[40px] sm:p-6 md:rounded-[50px]"><p className="line-clamp-4 text-xs font-light leading-relaxed sm:text-sm md:text-base">{project.description}</p></div></div><img src={project.image} alt="" loading="lazy" width={1200} height={800} className="h-full min-h-0 w-full rounded-[28px] object-cover sm:rounded-[40px] md:rounded-[50px]" /></div></div>
  </motion.article></div>;
}

export function FeaturedProjects() {
  return <section className="relative z-10 -mt-10 rounded-t-[40px] bg-background px-5 pt-20 pb-28 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10"><FadeIn><h2 className="hero-heading mb-14 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none">Project</h2></FadeIn><div className="mx-auto max-w-7xl">{projects.slice(0, 3).map((project, i) => <ProjectCard key={project.name} project={project} index={i} total={3} />)}</div><div className="mt-8 text-center"><Button asChild variant="project" className="h-auto rounded-full px-10 py-4 uppercase tracking-widest"><Link to="/projects">All projects <ArrowDownRight aria-hidden="true" /></Link></Button></div></section>;
}

export function ProjectIndex() {
  return <section className="bg-surface-light px-5 py-20 text-ink sm:px-8 sm:py-24 md:px-10 md:py-32"><FadeIn><h1 className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none sm:mb-20 md:mb-28">Projects</h1></FadeIn><div className="mx-auto max-w-5xl">{projects.map((project, i) => <FadeIn key={project.name} delay={Math.min(i * 0.03, 0.25)}><article id={project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")} className="light-divider scroll-mt-8 border-b py-8 sm:py-10 md:py-12"><div className="flex gap-5 sm:gap-10 md:gap-16"><span className="w-[19%] shrink-0 text-[clamp(3rem,10vw,140px)] font-black leading-none">{String(i + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><p className="mb-3 text-xs font-medium uppercase tracking-wider opacity-60">{project.type} / {project.year}</p><h2 className="mb-4 text-[clamp(1rem,2.2vw,2.1rem)] font-medium uppercase leading-tight">{project.name}</h2><img src={project.image} alt={`${project.name} conceptual visual reference`} loading="lazy" width={1200} height={800} className="mb-5 aspect-[16/8] w-full rounded-[28px] object-cover sm:rounded-[40px]" /><p className="max-w-2xl text-[clamp(.85rem,1.6vw,1.25rem)] font-light leading-relaxed opacity-70">{project.description}</p><p className="mt-4 text-xs font-medium uppercase tracking-wider opacity-60">{project.details}</p></div></div></article></FadeIn>)}</div></section>;
}

export function Footer() { return <footer className="flex flex-wrap items-center justify-between gap-4 bg-background px-6 py-8 text-xs font-light uppercase tracking-widest md:px-10"><Link to="/" className="font-black text-lg">ASHWIN</Link><span>AI · Robotics · Engineering</span><Link to="/contact" className="transition-opacity hover:opacity-70">Get in touch ↗</Link></footer>; }