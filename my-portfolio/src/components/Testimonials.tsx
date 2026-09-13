"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Testimonial {
  _id: string;
  company: string;
  role: string;
  quote: string;
  logoUrl: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    _id: "t1",
    company: "TechCorp Solutions",
    role: "Full Stack Developer",
    quote: "Nahom delivered exceptional work on our marketplace platform. His expertise in React and Node.js was invaluable.",
    logoUrl: "",
  },
  {
    _id: "t2",
    company: "BuildConnect",
    role: "Frontend Engineer",
    quote: "A talented developer who understands both the technical and business side of things. Highly recommended.",
    logoUrl: "",
  },
  {
    _id: "t3",
    company: "InnovateTech",
    role: "Software Engineer",
    quote: "Professional, dedicated, and skilled. Nahom's ERP solution transformed our operations.",
    logoUrl: "",
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setTestimonials(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-2 text-center"
        >
          Companies I&apos;ve <span className="text-accent">Worked With</span>
        </motion.h2>
        <p className="text-muted text-center mb-10">Swipe to see more</p>

        <div
          ref={scrollRef}
          className="overflow-x-auto hide-scrollbar snap-x snap-mandatory flex gap-5 pb-4 -mx-4 px-4 touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[280px] max-w-[320px] bg-card border border-card-border rounded-2xl p-6 flex-shrink-0 snap-center hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
            >
              <div className="flex items-center gap-3 mb-4">
                {t.logoUrl ? (
                  <img src={t.logoUrl} alt={t.company} className="w-12 h-12 rounded-xl object-cover border border-card-border" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-card-border flex items-center justify-center">
                    <span className="text-lg font-bold text-accent">{t.company.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-sm">{t.company}</h3>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
