"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-28 h-28 mx-auto mb-8 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center text-4xl font-bold text-accent"
        >
          N
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Hi, I&apos;m <span className="text-accent">Nahom</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted mb-6">
          Computer Engineer & Full Stack Developer
        </p>
        <p className="text-muted max-w-xl mx-auto mb-8 leading-relaxed">
          Building innovative web applications with modern technologies.
          Passionate about creating solutions that make a difference.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#projects"
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-card-border rounded-lg font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Contact Me
          </a>
        </div>
      </motion.div>
    </section>
  );
}
