"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-8 text-center"
        >
          About <span className="text-accent">Me</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-card-border rounded-2xl p-8 leading-relaxed text-muted"
        >
          <p className="text-foreground text-lg mb-4">
            I&apos;m a Computer Engineering graduate with a passion for building full-stack web applications
            that solve real-world problems.
          </p>
          <p className="mb-4">
            My journey in tech has led me to create diverse projects — from marketplace platforms with
            AI-powered assistants to professional networking systems and enterprise ERP solutions. I love
            working across the entire stack, from designing intuitive user interfaces to architecting
            robust backend systems.
          </p>
          <p>
            When I&apos;m not coding, I&apos;m exploring new technologies, contributing to open-source projects,
            and continuously learning to stay at the forefront of software development.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-background rounded-xl p-4 border border-card-border">
              <div className="text-2xl font-bold text-accent">4+</div>
              <div className="text-sm text-muted">Projects</div>
            </div>
            <div className="bg-background rounded-xl p-4 border border-card-border">
              <div className="text-2xl font-bold text-accent">B.Sc</div>
              <div className="text-sm text-muted">Degree</div>
            </div>
            <div className="bg-background rounded-xl p-4 border border-card-border">
              <div className="text-2xl font-bold text-accent">Full Stack</div>
              <div className="text-sm text-muted">Development</div>
            </div>
            <div className="bg-background rounded-xl p-4 border border-card-border">
              <div className="text-2xl font-bold text-accent">AI</div>
              <div className="text-sm text-muted">Integration</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
