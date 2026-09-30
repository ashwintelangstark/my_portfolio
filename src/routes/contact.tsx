import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/portfolio";

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
  return <main className="flex min-h-screen flex-col overflow-x-clip bg-background"><Nav /><section className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center"><h1 className="hero-heading text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none">Let's talk</h1><p className="mt-10 max-w-xl text-lg font-light leading-relaxed sm:text-2xl">Have an idea involving AI, robotics or engineering? I’d love to hear about it.</p><div className="mt-12 flex flex-col items-center gap-5 text-base font-light sm:text-xl"><p>Email: <a className="break-all underline underline-offset-4 transition-opacity hover:opacity-70" href="mailto:ashwintelang2@gmail.com">ashwintelang2@gmail.com</a></p><p>Phone: <a className="underline underline-offset-4 transition-opacity hover:opacity-70" href="tel:+918884815436">8884815436</a></p></div></section><Footer /></main>;
}