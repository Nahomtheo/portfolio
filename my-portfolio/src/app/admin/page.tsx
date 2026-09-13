"use client";

import { useState, useEffect } from "react";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  images?: string[];
  link?: string;
}

interface Testimonial {
  _id: string;
  company: string;
  role: string;
  quote: string;
  logoUrl: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  phone?: string;
  createdAt?: string;
}

const emptyProjectForm = { title: "", description: "", technologies: "", imageUrl: "", images: [] as string[], link: "" };
const emptyTestimonialForm = { company: "", role: "", quote: "", logoUrl: "" };
const emptyUserForm = { name: "", email: "", password: "", role: "user", company: "", phone: "" };

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "testimonials" | "users">("projects");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonialForm);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.role === "admin") {
        setAuthenticated(true);
        localStorage.setItem("admin_auth", "true");
        setMessage("");
      } else if (res.ok) {
        setMessage("Access denied: admin role required");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch {
      setMessage("Login failed");
    }
  };

  useEffect(() => {
    const isAuthed = localStorage.getItem("admin_auth") === "true";
    const t = setTimeout(() => {
      setAuthenticated(isAuthed);
      setHydrated(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      setProjects(await res.json());
    } catch { setMessage("Failed to load projects"); }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      setTestimonials(await res.json());
    } catch { setMessage("Failed to load testimonials"); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      setUsers(await res.json());
    } catch { setMessage("Failed to load users"); }
  };

  useEffect(() => {
    if (authenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fetches are async; setState runs after await
      fetchProjects();
      fetchTestimonials();
      fetchUsers();
    }
  }, [authenticated]);

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      return data.url || null;
    } catch { return null; }
  };

  const handleMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    let count = 0;
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      if (url) { setProjectForm((prev) => ({ ...prev, images: [...prev.images, url] })); count++; }
    }
    if (count > 0) setMessage(`${count} image(s) uploaded!`);
    setUploading(false);
    e.target.value = "";
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) { setTestimonialForm((prev) => ({ ...prev, logoUrl: url })); setMessage("Logo uploaded!"); }
    else setMessage("Upload failed");
    setUploading(false);
    e.target.value = "";
  };

  const removeProjectImage = (index: number) => {
    setProjectForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: projectForm.title,
      description: projectForm.description,
      technologies: projectForm.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      imageUrl: projectForm.images[0] || "",
      images: projectForm.images,
      link: projectForm.link,
    };
    try {
      if (editingProjectId) {
        await fetch(`/api/projects/${editingProjectId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        setMessage("Project updated!");
      } else {
        await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        setMessage("Project added!");
      }
      setProjectForm(emptyProjectForm);
      setEditingProjectId(null);
      fetchProjects();
    } catch { setMessage("Error saving project"); }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...testimonialForm };
    try {
      if (editingTestimonialId) {
        await fetch(`/api/testimonials/${editingTestimonialId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        setMessage("Testimonial updated!");
      } else {
        await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        setMessage("Testimonial added!");
      }
      setTestimonialForm(emptyTestimonialForm);
      setEditingTestimonialId(null);
      fetchTestimonials();
    } catch { setMessage("Error saving testimonial"); }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setMessage("Project deleted!");
    fetchProjects();
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setMessage("Testimonial deleted!");
    fetchTestimonials();
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...userForm };
    try {
      const res = await fetch(editingUserId ? `/api/users/${editingUserId}` : "/api/users", {
        method: editingUserId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Error saving user");
        return;
      }
      setMessage(editingUserId ? "User updated!" : "User created!");
      setUserForm(emptyUserForm);
      setEditingUserId(null);
      fetchUsers();
    } catch { setMessage("Error saving user"); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setMessage("User deleted!");
    fetchUsers();
  };

  const handleLogout = () => { setAuthenticated(false); localStorage.removeItem("admin_auth"); };

  if (!hydrated || !authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-card border border-card-border rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-lg bg-background border border-card-border mb-4 focus:outline-none focus:border-accent" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-4 py-3 rounded-lg bg-background border border-card-border mb-4 focus:outline-none focus:border-accent" />
          <button type="submit" className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors">Login</button>
          {message && <p className="text-red-500 text-sm mt-3 text-center">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-sm text-muted hover:text-accent transition-colors">Logout</button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm flex items-center justify-between">
          {message}
          <button onClick={() => setMessage("")} className="font-bold ml-2">&times;</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab("projects")}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === "projects" ? "bg-accent text-white" : "bg-card border border-card-border hover:border-accent"}`}>
          Projects ({projects.length})
        </button>
        <button onClick={() => setActiveTab("testimonials")}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === "testimonials" ? "bg-accent text-white" : "bg-card border border-card-border hover:border-accent"}`}>
          Testimonials ({testimonials.length})
        </button>
        <button onClick={() => setActiveTab("users")}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === "users" ? "bg-accent text-white" : "bg-card border border-card-border hover:border-accent"}`}>
          Users ({users.length})
        </button>
      </div>

      {/* ===== PROJECTS TAB ===== */}
      {activeTab === "projects" && (
        <>
          <form onSubmit={handleProjectSubmit} className="bg-card border border-card-border rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{editingProjectId ? "Edit Project" : "Add New Project"}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Project Title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required
                className="px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
              <input type="text" placeholder="Technologies (comma separated)" value={projectForm.technologies} onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                className="px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
            </div>
            <textarea placeholder="Project Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required rows={3}
              className="w-full px-4 py-3 mt-4 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent resize-none" />
            <div className="mt-4">
              <input type="text" placeholder="Project Link (optional)" value={projectForm.link} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Project Screenshots <span className="text-muted font-normal">(multiple files for carousel)</span></label>
              <input type="file" accept="image/*" multiple onChange={handleMultiImageUpload} disabled={uploading}
                className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:cursor-pointer" />
            </div>
            {projectForm.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted mb-2">{projectForm.images.length} image(s) — first is cover:</p>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {projectForm.images.map((url, i) => (
                    <div key={i} className="relative flex-shrink-0 group">
                      <img src={url} alt={`Screenshot ${i + 1}`} className="h-24 w-40 rounded-lg object-cover border border-card-border" />
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">{i === 0 ? "Cover" : `#${i + 1}`}</div>
                      <button type="button" onClick={() => removeProjectImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={uploading} className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors disabled:opacity-50">
                {uploading ? "Uploading..." : editingProjectId ? "Update Project" : "Add Project"}
              </button>
              {editingProjectId && (
                <button type="button" onClick={() => { setEditingProjectId(null); setProjectForm(emptyProjectForm); }}
                  className="px-6 py-3 border border-card-border rounded-lg font-medium hover:border-accent transition-colors">Cancel</button>
              )}
            </div>
          </form>

          <h2 className="text-xl font-bold mb-4">Projects</h2>
          <div className="space-y-3">
            {projects.map((project) => {
              const imgs = project.images?.length ? project.images : project.imageUrl ? [project.imageUrl] : [];
              return (
                <div key={project._id} className="bg-card border border-card-border rounded-xl p-4 flex items-center gap-4">
                  {imgs.length > 0 ? (
                    <img src={imgs[0]} alt={project.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-accent/40">{project.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{project.title}</h3>
                    <p className="text-sm text-muted truncate">{project.description}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {imgs.length > 1 && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">{imgs.length} screenshots</span>}
                      {project.technologies.slice(0, 3).map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditingProjectId(project._id); setProjectForm({ title: project.title, description: project.description, technologies: project.technologies.join(", "), imageUrl: project.imageUrl || "", images: project.images || [], link: project.link || "" }); }}
                      className="p-2 rounded-lg border border-card-border hover:border-accent hover:text-accent transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDeleteProject(project._id)}
                      className="p-2 rounded-lg border border-card-border hover:border-red-500 hover:text-red-500 transition-colors" title="Delete">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && <p className="text-muted text-center py-8">No projects yet.</p>}
          </div>
        </>
      )}

      {/* ===== TESTIMONIALS TAB ===== */}
      {activeTab === "testimonials" && (
        <>
          <form onSubmit={handleTestimonialSubmit} className="bg-card border border-card-border rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{editingTestimonialId ? "Edit Testimonial" : "Add New Testimonial"}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Company Name" value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} required
                className="px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
              <input type="text" placeholder="Your Role (e.g. Full Stack Developer)" value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} required
                className="px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
            </div>
            <textarea placeholder="Testimonial quote..." value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} required rows={3}
              className="w-full px-4 py-3 mt-4 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent resize-none" />
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Company Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading}
                className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:cursor-pointer" />
            </div>
            {testimonialForm.logoUrl && (
              <div className="mt-4 relative inline-block">
                <img src={testimonialForm.logoUrl} alt="Logo preview" className="h-16 w-16 rounded-xl object-cover border border-card-border" />
                <button type="button" onClick={() => setTestimonialForm({ ...testimonialForm, logoUrl: "" })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">&times;</button>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={uploading} className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors disabled:opacity-50">
                {uploading ? "Uploading..." : editingTestimonialId ? "Update Testimonial" : "Add Testimonial"}
              </button>
              {editingTestimonialId && (
                <button type="button" onClick={() => { setEditingTestimonialId(null); setTestimonialForm(emptyTestimonialForm); }}
                  className="px-6 py-3 border border-card-border rounded-lg font-medium hover:border-accent transition-colors">Cancel</button>
              )}
            </div>
          </form>

          <h2 className="text-xl font-bold mb-4">Testimonials</h2>
          <div className="space-y-3">
            {testimonials.map((t) => (
              <div key={t._id} className="bg-card border border-card-border rounded-xl p-4 flex items-center gap-4">
                {t.logoUrl ? (
                  <img src={t.logoUrl} alt={t.company} className="w-14 h-14 rounded-xl object-cover border border-card-border flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-accent/10 border border-card-border flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-accent">{t.company.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{t.company}</h3>
                  <p className="text-sm text-muted">{t.role}</p>
                  <p className="text-xs text-muted mt-1 truncate italic">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditingTestimonialId(t._id); setTestimonialForm({ company: t.company, role: t.role, quote: t.quote, logoUrl: t.logoUrl || "" }); }}
                    className="p-2 rounded-lg border border-card-border hover:border-accent hover:text-accent transition-colors" title="Edit">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDeleteTestimonial(t._id)}
                    className="p-2 rounded-lg border border-card-border hover:border-red-500 hover:text-red-500 transition-colors" title="Delete">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <p className="text-muted text-center py-8">No testimonials yet.</p>}
          </div>
        </>
      )}

      {/* ===== USERS TAB ===== */}
      {activeTab === "users" && (
        <>
          <form onSubmit={handleUserSubmit} className="bg-card border border-card-border rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{editingUserId ? "Edit User" : "Create New User"}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required
                className="px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
              <input type="email" placeholder="Email address" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required
                className="px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
              <input type="password" placeholder={editingUserId ? "New password (leave blank to keep)" : "Password"} value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required={!editingUserId}
                className="px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
              <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent">
                <option value="user">User</option>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
              <input type="text" placeholder="Company (optional)" value={userForm.company} onChange={(e) => setUserForm({ ...userForm, company: e.target.value })}
                className="px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
              <input type="text" placeholder="Phone (optional)" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                className="px-4 py-3 rounded-lg bg-background border border-card-border focus:outline-none focus:border-accent" />
            </div>
            <p className="text-sm text-muted mt-3">Roles: <span className="text-accent">admin</span> (full access), <span className="text-accent">client</span> (can order projects), <span className="text-accent">user</span> (general).</p>
            <div className="mt-6 flex gap-3">
              <button type="submit" className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors">
                {editingUserId ? "Update User" : "Create User"}
              </button>
              {editingUserId && (
                <button type="button" onClick={() => { setEditingUserId(null); setUserForm(emptyUserForm); }}
                  className="px-6 py-3 border border-card-border rounded-lg font-medium hover:border-accent transition-colors">Cancel</button>
              )}
            </div>
          </form>

          <h2 className="text-xl font-bold mb-4">Users</h2>
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u._id} className="bg-card border border-card-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-card-border flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-accent">{u.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold truncate">{u.name}</h3>
                    <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-medium ${u.role === "admin" ? "bg-accent/15 text-accent" : u.role === "client" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"}`}>{u.role}</span>
                  </div>
                  <p className="text-sm text-muted truncate">{u.email}</p>
                  {(u.company || u.phone) && <p className="text-xs text-muted truncate">{[u.company, u.phone].filter(Boolean).join(" · ")}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditingUserId(u._id); setUserForm({ name: u.name, email: u.email, password: "", role: u.role, company: u.company || "", phone: u.phone || "" }); }}
                    className="p-2 rounded-lg border border-card-border hover:border-accent hover:text-accent transition-colors" title="Edit">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDeleteUser(u._id)}
                    className="p-2 rounded-lg border border-card-border hover:border-red-500 hover:text-red-500 transition-colors" title="Delete">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
            {users.length === 0 && <p className="text-muted text-center py-8">No users yet. Create your first user above.</p>}
          </div>
        </>
      )}
    </div>
  );
}
