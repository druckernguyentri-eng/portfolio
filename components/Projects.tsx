"use client";

import { useState } from "react";

const projects = [
  {
    id: "01",
    title: "Flux Dashboard",
    description:
      "Real-time analytics platform for monitoring distributed systems. Built with Next.js, Kafka, and WebSockets — handles 500k events/second.",
    tags: ["Next.js", "Kafka", "TypeScript", "WebSockets"],
    year: "2026",
    link: "#",
  },
  {
    id: "02",
    title: "Serif CMS",
    description:
      "Headless content management system designed for editorial teams. Clean API, visual editor, multi-tenant support out of the box.",
    tags: ["React", "Node.js", "PostgreSQL", "S3"],
    year: "2025",
    link: "#",
  },
  {
    id: "03",
    title: "Orbit Design System",
    description:
      "Component library and design tokens used across 4 production applications. Built with Storybook, Radix, and Tailwind.",
    tags: ["Radix UI", "Storybook", "Tailwind", "Figma"],
    year: "2025",
    link: "#",
  },
  {
    id: "04",
    title: "Relay API",
    description:
      "Lightweight GraphQL gateway for microservices. Handles schema stitching, request batching, and per-field caching automatically.",
    tags: ["GraphQL", "Go", "Redis", "Docker"],
    year: "2024",
    link: "#",
  },
];

export default function Projects() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="projects" className="py-32 px-6 max-w-6xl mx-auto w-full">
      <div className="flex items-baseline gap-4 mb-16">
        <span className="font-mono text-xs tracking-widest uppercase text-[#f0f0f0]/30">
          Selected work
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="divide-y divide-white/10">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.link}
            className="group block py-10 cursor-pointer"
            onMouseEnter={() => setHovered(project.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-mono text-xs text-[#f0f0f0]/20">
                    {project.id}
                  </span>
                  <h3
                    className={`text-2xl md:text-3xl font-semibold tracking-tight transition-colors duration-300 ${
                      hovered === project.id
                        ? "text-[#f0f0f0]"
                        : "text-[#f0f0f0]/70"
                    }`}
                  >
                    {project.title}
                  </h3>
                </div>
                <p
                  className={`text-sm leading-relaxed max-w-xl transition-all duration-300 ${
                    hovered === project.id
                      ? "text-[#f0f0f0]/60"
                      : "text-[#f0f0f0]/30"
                  }`}
                >
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] tracking-widest uppercase px-2 py-1 border border-white/10 text-[#f0f0f0]/30 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-mono text-xs text-[#f0f0f0]/20">
                  {project.year}
                </span>
                <span
                  className={`text-xl transition-all duration-300 ${
                    hovered === project.id
                      ? "translate-x-1 -translate-y-1 text-[#f0f0f0]"
                      : "text-[#f0f0f0]/20"
                  }`}
                >
                  ↗
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
