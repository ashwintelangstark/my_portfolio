import { createFileRoute } from "@tanstack/react-router";
import { AwardsSection, Footer, Nav } from "@/components/portfolio";

export const Route = createFileRoute("/awards")({
  head: () => ({ meta: [
    { title: "Awards & Certifications — Ashwin" },
    { name: "description", content: "Explore Ashwin's technical AI certifications from Anthropic Claude Academy and published literature awards." },
    { property: "og:title", content: "Awards & Certifications — Ashwin" },
    { property: "og:description", content: "Explore Ashwin's technical AI certifications from Anthropic Claude Academy and published literature awards." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <main className="overflow-x-clip bg-background"><Nav /><AwardsSection full /><Footer /></main>,
});
