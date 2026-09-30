import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Nav, Footer } from "@/components/portfolio";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact Ashwin — Let's Collaborate" },
    { name: "description", content: "Get in touch with Ashwin about AI, robotics, computer vision and engineering collaborations." },
    { property: "og:title", content: "Contact Ashwin — Let's Collaborate" },
    { property: "og:description", content: "Get in touch with Ashwin about AI, robotics, computer vision and engineering collaborations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Contact,
});

function Contact() {
  return <main className="flex min-h-screen flex-col overflow-x-clip bg-background"><Nav /><section className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center"><h1 className="hero-heading text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none">Let's talk</h1><p className="mt-10 max-w-xl text-lg font-light leading-relaxed sm:text-2xl">Have an idea involving AI, robotics or engineering? I’d love to hear about it.</p><Button variant="hero" className="mt-12 h-auto rounded-full px-10 py-4 text-sm uppercase tracking-widest" onClick={() => { void navigator.clipboard.writeText("Hi Ashwin, I'd like to connect about a project."); }}>Copy intro <ArrowUpRight aria-hidden="true" /></Button><p className="mt-6 text-sm font-light opacity-60">Contact address to be added.</p></section><Footer /></main>;
}