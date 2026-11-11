import { createFileRoute } from "@tanstack/react-router";
import { Footer, Nav, ProjectIndex } from "@/components/portfolio";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [
    { title: "Projects — Ashwin" },
    { name: "description", content: "Projects by Ashwin spanning AI assistants, multi-agent intelligence, fintech, robotics, computer vision, IoT, software and engineering research." },
    { property: "og:title", content: "Projects — Ashwin" },
    { property: "og:description", content: "Projects by Ashwin spanning AI assistants, multi-agent intelligence, fintech, robotics, computer vision, IoT, software and engineering research." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <main className="overflow-x-clip bg-background"><Nav /><ProjectIndex /><Footer /></main>,
});