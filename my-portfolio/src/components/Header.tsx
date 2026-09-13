"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-card/80 border-b border-card-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-accent">
          Nahom
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#about" className="hover:text-accent transition-colors">About</a>
          <a href="#projects" className="hover:text-accent transition-colors">Projects</a>
          <a href="#skills" className="hover:text-accent transition-colors">Skills</a>
          <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          <Link href="/admin" className="text-muted hover:text-accent transition-colors">Admin</Link>
          <Link href="/signup" className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors">Sign Up</Link>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-lg bg-card border border-card-border hover:border-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button className="md:hidden p-2" aria-label="Menu">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
