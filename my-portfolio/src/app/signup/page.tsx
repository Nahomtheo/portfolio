"use client";

import { useState } from "react";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";

const emptyForm = { name: "", email: "", password: "", company: "", phone: "" };

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function SignupPage() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user_id", data._id);
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_email", data.email);
        setSuccess(true);
      } else {
        setError(data.error || "Google sign in failed");
      }
    } catch {
      setError("Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user_id", data._id);
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_email", data.email);
        setSuccess(true);
      } else {
        setError(data.error || "Sign up failed");
      }
    } catch {
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-card border border-card-border rounded-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Account created!</h1>
          <p className="text-muted mb-6">
            Welcome, {form.name.split(" ")[0]}! Your client account is ready. We&apos;ll get back to you about your project.
          </p>
          <Link href="/" className="inline-block px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Create an <span className="text-accent">Account</span>
          </h1>
          <p className="text-muted">Sign up to request projects and manage your orders.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-card-border rounded-2xl p-8 space-y-4">
          {googleClientId && (
            <>
              <GoogleOAuthProvider clientId={googleClientId}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign in failed")}
                  theme="filled_blue"
                  size="large"
                  width="100%"
                  useOneTap
                />
              </GoogleOAuthProvider>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-card-border" />
                <span className="text-xs text-muted uppercase tracking-wide">or</span>
                <div className="flex-1 h-px bg-card-border" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <input type="text" placeholder="Nahom Theodros" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input type="password" placeholder="At least 6 characters" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Company <span className="text-muted font-normal">(optional)</span></label>
            <input type="text" placeholder="Company name" value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Phone <span className="text-muted font-normal">(optional)</span></label>
            <input type="tel" placeholder="Phone number" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors disabled:opacity-50">
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-sm text-muted text-center pt-2">
            Already have an account?{" "}
            <Link href="/" className="text-accent hover:underline">Contact us</Link>
          </p>
        </form>
      </div>
    </div>
  );
}