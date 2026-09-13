"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "HTML/CSS"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "Python", "REST APIs", "GraphQL"],
  },
  {
    title: "Database",
    skills: ["MongoDB", "Supabase", "PostgreSQL", "Firebase"],
  },
  {
    title: "Tools & Other",
    skills: ["Git", "Docker", "Cloudinary", "AI/ML Integration", "Vercel"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-10 text-center"
        >
          Technical <span className="text-accent">Skills</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-card-border rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold mb-4 text-accent">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1.5 rounded-lg bg-background border border-card-border hover:border-accent hover:text-accent transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
