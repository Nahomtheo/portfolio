"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  images?: string[];
  link?: string;
}

const defaultProjects: Project[] = [
  {
    _id: "1",
    title: "RentHub Marketplace",
    description: "A marketplace for cars, houses, and rentals featuring an AI assistant that helps users create listings and chat within the platform.",
    technologies: ["React", "Vite", "Node.js", "MongoDB", "AI"],
    images: [
      "https://picsum.photos/seed/renthub1/400/250",
      "https://picsum.photos/seed/renthub2/400/250",
      "https://picsum.photos/seed/renthub3/400/250",
      "https://picsum.photos/seed/renthub4/400/250",
    ],
  },
  {
    _id: "2",
    title: "ProConnect Platform",
    description: "A platform connecting professionals with contractors, enabling job posting and vacancy management tailored to related fields.",
    technologies: ["React", "Vite", "Supabase"],
    images: [
      "https://picsum.photos/seed/procon1/400/250",
      "https://picsum.photos/seed/procon2/400/250",
      "https://picsum.photos/seed/procon3/400/250",
    ],
  },
  {
    _id: "3",
    title: "ERP Management System",
    description: "A comprehensive ERP solution with booking, ordering, order tracking, inventory management, and automated report generation.",
    technologies: ["React", "Node.js", "Database"],
    images: [
      "https://picsum.photos/seed/erp1/400/250",
      "https://picsum.photos/seed/erp2/400/250",
      "https://picsum.photos/seed/erp3/400/250",
      "https://picsum.photos/seed/erp4/400/250",
    ],
  },
  {
    _id: "4",
    title: "Contractor Portal",
    description: "A web application for contractors to post vacancies and manage tenders efficiently.",
    technologies: ["React", "Vite", "Supabase"],
    images: [
      "https://picsum.photos/seed/contract1/400/250",
      "https://picsum.photos/seed/contract2/400/250",
      "https://picsum.photos/seed/contract3/400/250",
    ],
  },
];

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const index = Math.round(el.scrollTop / el.clientHeight);
    setActiveIndex(index);
  };

  return (
    <div className="relative">
      <div className="px-4 pt-3 pb-1 flex justify-center">
        <div className="relative w-[150px] h-[270px] rounded-2xl overflow-hidden border-[3px] border-card-border bg-black/10 shadow-lg">
          <div className="absolute top-0 inset-x-0 h-5 bg-card-border/30 flex justify-center items-end pb-0.5 z-10">
            <div className="w-16 h-1.5 rounded-full bg-foreground/10" />
          </div>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-y-auto hide-scrollbar snap-y snap-mandatory flex flex-col h-full touch-pan-y"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {images.map((src, i) => (
              <div key={i} className="min-h-full snap-center flex-shrink-0 w-full">
                <img
                  src={src}
                  alt={`${title} screenshot ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-1.5 justify-center mt-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-accent w-4" : "bg-muted/30 w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setProjects(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-2 text-center"
        >
          My <span className="text-accent">Projects</span>
        </motion.h2>
        <p className="text-muted text-center mb-10">Swipe to explore my work</p>
      </div>

      <div
        className="overflow-x-auto hide-scrollbar snap-x snap-mandatory flex gap-5 pb-4 px-4 touch-pan-x"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {projects.map((project, i) => {
          const allImages =
            project.images && project.images.length > 0
              ? project.images
              : project.imageUrl
              ? [project.imageUrl]
              : [];

          return (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[280px] max-w-[320px] bg-card border border-card-border rounded-2xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 flex-shrink-0 snap-center"
            >
              {allImages.length > 0 ? (
                <ImageCarousel images={allImages} title={project.title} />
              ) : (
                <div className="aspect-[16/10] bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                  <span className="text-5xl font-bold text-accent/30">
                    {project.title.charAt(0)}
                  </span>
                </div>
              )}

              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-muted mb-3 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light transition-colors"
                  >
                    View Project
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted mt-4 md:hidden">
        ← Swipe to see more →
      </p>
    </section>
  );
}
