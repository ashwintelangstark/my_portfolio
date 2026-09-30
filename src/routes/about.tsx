import { createFileRoute } from "@tanstack/react-router";
import { AboutSection, Footer, Nav } from "@/components/portfolio";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Ashwin — AI & Robotics Engineer" },
    { name: "description", content: "Learn about Ashwin's work across AI engineering, robotics, computer vision, IoT and full-stack software." },
    { property: "og:title", content: "About Ashwin — AI & Robotics Engineer" },
    { property: "og:description", content: "Learn about Ashwin's work across AI engineering, robotics, computer vision, IoT and full-stack software." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <main className="overflow-x-clip bg-background"><Nav /><AboutSection full /><Footer /></main>,
});