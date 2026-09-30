import { createFileRoute } from "@tanstack/react-router";
import { AboutSection, FeaturedProjects, Footer, Hero, Marquee } from "@/components/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Ashwin — AI & Robotics Engineer" },
    { name: "description", content: "Explore Ashwin's AI, robotics, computer vision and engineering projects." },
    { property: "og:title", content: "Ashwin — AI & Robotics Engineer" },
    { property: "og:description", content: "Explore Ashwin's AI, robotics, computer vision and engineering projects." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return <main className="overflow-x-clip bg-background"><Hero /><Marquee /><AboutSection /><FeaturedProjects /><Footer /></main>;
}
