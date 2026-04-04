import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const categories = [
  "UI/UX",
  "Branding",
  "Website",
  "Dashboard",
  "App Design",
  "Full Stack Dev",
];

function ensureHttp(url) {
  if (!url) return "";
  const trimmed = url.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

const emptyForm = {
  title: "",
  category: "UI/UX",
  short_description: "",
  full_description: "",
  year: "",
  live_url: "",
  github_url: "",
  is_featured: false,
  is_published: true,
};

export default function AddProject() {
  const navigate = useNavigate();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState("add");

  const [form, setForm] = useState(emptyForm);
  const [coverImage, setCoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [manageStatus, setManageStatus] = useState("");
  const [editForm, setEditForm] = useState(emptyForm);

  const isAdmin = useMemo(() => {
    return (
      !!user?.email &&
      !!adminEmail &&
      user.email.trim().toLowerCase() === adminEmail.trim().toLowerCase()
    );
  }, [user, adminEmail]);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setAuthLoading(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab === "manage" && isAdmin) {
      fetchProjects();
    }
  }, [activeTab, isAdmin]);

  function resetAddForm() {
    setForm(emptyForm);
    setCoverImage(null);
    setGalleryImages([]);
    setStatus("");
  }

  function resetEditForm() {
    setEditingId(null);
    setEditForm(emptyForm);
    setManageStatus("");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function uploadSingleFile(file, folder = "projects") {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function fetchProjects() {
    setLoadingProjects(true);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setManageStatus("Failed to load projects");
    } else {
      setProjects(data || []);
      setManageStatus("");
    }

    setLoadingProjects(false);
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      console.error(error);
      setAuthError(error.message || "Login failed");
      setLoggingIn(false);
      return;
    }

    setActiveTab("add");
    setLoggingIn(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setLoginEmail("");
    setLoginPassword("");
    setAuthError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("Uploading project...");

    try {
      let coverImageUrl = "";
      let galleryImageUrls = [];

      if (coverImage) {
        coverImageUrl = await uploadSingleFile(coverImage, "projects/cover");
      }

      if (galleryImages.length > 0) {
        galleryImageUrls = await Promise.all(
          Array.from(galleryImages).map((file) =>
            uploadSingleFile(file, "projects/gallery")
          )
        );
      }

      const payload = {
        ...form,
        live_url: ensureHttp(form.live_url),
        github_url: ensureHttp(form.github_url),
        cover_image_url: coverImageUrl,
        gallery_images: galleryImageUrls,
      };

      const { error } = await supabase.from("projects").insert([payload]);

      if (error) throw error;

      setStatus("Project added successfully");
      resetAddForm();

      setTimeout(() => {
        navigate("/work");
      }, 900);
    } catch (error) {
      console.error(error);
      setStatus(error.message || "Something went wrong while saving project");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(project) {
    setEditingId(project.id);
    setEditForm({
      title: project.title || "",
      category: project.category || "UI/UX",
      short_description: project.short_description || "",
      full_description: project.full_description || "",
      year: project.year || "",
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      is_featured: !!project.is_featured,
      is_published: !!project.is_published,
    });
    setManageStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editingId) return;

    setManageStatus("Saving changes...");

    const payload = {
      ...editForm,
      live_url: ensureHttp(editForm.live_url),
      github_url: ensureHttp(editForm.github_url),
    };

    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", editingId);

    if (error) {
      console.error(error);
      setManageStatus("Failed to update project");
      return;
    }

    setManageStatus("Project updated successfully");
    await fetchProjects();
    resetEditForm();
  }

  async function deleteProject(project) {
    const yes = window.confirm(`Delete "${project.title}"?`);
    if (!yes) return;

    setManageStatus("Deleting project...");

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (error) {
      console.error(error);
      setManageStatus("Failed to delete project");
      return;
    }

    if (editingId === project.id) {
      resetEditForm();
    }

    setManageStatus("Project deleted successfully");
    await fetchProjects();
  }

  async function toggleFeatured(project) {
    const { error } = await supabase
      .from("projects")
      .update({ is_featured: !project.is_featured })
      .eq("id", project.id);

    if (error) {
      console.error(error);
      setManageStatus("Failed to change featured status");
      return;
    }

    await fetchProjects();
  }

  async function togglePublished(project) {
    const { error } = await supabase
      .from("projects")
      .update({ is_published: !project.is_published })
      .eq("id", project.id);

    if (error) {
      console.error(error);
      setManageStatus("Failed to change publish status");
      return;
    }

    await fetchProjects();
  }

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0a0f16",
          color: "white",
          fontFamily: "Calibri, Arial, sans-serif",
        }}
      >
        Checking access...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div
  style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top, rgba(255,179,92,0.10), transparent 20%), #0a0f16",
    color: "white",
    fontFamily: "Calibri, Arial, sans-serif",
    padding: "40px 20px",
  }}
>
        <div
  style={{
    width: "100%",
    maxWidth: 620,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 26,
    padding: "44px 40px",
    boxShadow:
      "0 0 120px rgba(255,140,60,0.08), 0 30px 80px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.04)",
    backdropFilter: "blur(16px)",
    position: "relative",
    overflow: "hidden",
  }}
>
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Restricted Access

              <div
  style={{
    position: "absolute",
    width: 260,
    height: 260,
    right: -60,
    top: -60,
    background: "rgba(255,179,92,0.12)",
    filter: "blur(90px)",
    pointerEvents: "none",
  }}
/>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 34,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
              }}
            >
              Admin Login
            </h1>

            <p
              style={{
                marginTop: 10,
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                lineHeight: 1.6,
                marginBottom: 0,
              }}
            >
              This panel is private. Sign in with the admin account to continue.
            </p>
          </div>

          <form
            onSubmit={handleAdminLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={{
                  width: "93%",
                  padding: "16px 18px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "#11161f",
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                  transition: "0.2s",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{
                  width: "93%",
                  padding: "16px 18px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "#11161f",
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                  transition: "0.2s",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              style={{
                marginTop: 8,
                padding: "16px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #ffb35c, #ff8c3a)",
                color: "#0a0f16",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                transition: "0.25s",
                boxShadow: "0 10px 30px rgba(255,140,58,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {loggingIn ? "Signing in..." : "Login"}
            </button>

            {authError ? (
              <p style={{ margin: 0, color: "#ff9a9a", fontSize: 14 }}>
                {authError}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f16",
        color: "white",
        fontFamily: "Calibri, Arial, sans-serif",
        padding: "32px 16px 48px",
      }}
    >
      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-shell {
          width: min(1200px, 100%);
          margin: 0 auto;
        }

        .panel {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.24);
        }

        .admin-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 22px;
        }

        .input,
        .textarea,
        .select {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.10);
          background: #0d1219;
          color: white;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: 0.22s ease;
        }

        .input:focus,
        .textarea:focus,
        .select:focus {
          border-color: rgba(255,179,92,0.40);
          box-shadow: 0 0 0 3px rgba(255,179,92,0.08);
        }

        .textarea {
          min-height: 140px;
          resize: vertical;
        }

        .label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255,255,255,0.78);
        }

        .field {
          margin-bottom: 16px;
        }

        .section-title {
          margin: 0 0 8px 0;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .section-text {
          margin: 0;
          color: rgba(255,255,255,0.62);
          line-height: 1.7;
          font-size: 14px;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,179,92,0.12);
          border: 1px solid rgba(255,179,92,0.18);
          color: #ffbf77;
          font-size: 12px;
          font-weight: 600;
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.10);
          background: transparent;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: 0.22s ease;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #ffb35c, #ff8c3a);
          color: #111;
          border-color: rgba(255,179,92,0.24);
          box-shadow: 0 10px 24px rgba(255,179,92,0.18);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          border: none;
          background: #ffb35c;
          color: #111;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: 0.22s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.03);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary,
        .btn-small,
        .btn-danger,
        .btn-logout {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: 0.22s ease;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: white;
        }

        .btn-danger {
          border: 1px solid rgba(255,80,80,0.18);
          background: rgba(255,80,80,0.10);
          color: #ff9a9a;
        }

        .btn-secondary:hover,
        .btn-small:hover,
        .btn-danger:hover,
        .btn-logout:hover {
          transform: translateY(-2px);
        }

        .checkbox-row {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.78);
          font-size: 14px;
        }

        .side-list {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }

        .side-item {
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.72);
          font-size: 14px;
          line-height: 1.7;
        }

        .file-note {
          margin-top: 8px;
          color: rgba(255,255,255,0.50);
          font-size: 13px;
        }

        .status {
          margin-top: 14px;
          color: rgba(255,255,255,0.72);
          font-size: 14px;
        }

        .manage-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
        }

        .row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .projects-table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 16px 14px;
          text-align: left;
          vertical-align: top;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 14px;
        }

        th {
          color: rgba(255,255,255,0.50);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 11px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.80);
        }

        .pill.orange {
          background: rgba(255,179,92,0.12);
          border-color: rgba(255,179,92,0.18);
          color: #ffbf77;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        @media (max-width: 980px) {
          .admin-grid,
          .row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="admin-shell">
        <div className="topbar">
          <div>
            <div
              style={{
                color: "rgba(255,255,255,0.42)",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                marginBottom: 10,
              }}
            >
              Admin
            </div>

            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: "clamp(34px, 6vw, 56px)",
                lineHeight: 0.98,
                letterSpacing: "-0.06em",
              }}
            >
              Project Panel
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.62)",
                lineHeight: 1.75,
                fontSize: 15,
                maxWidth: 760,
              }}
            >
              Add new projects or manage existing ones from the same place.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="badge">{user?.email || "Supabase Connected"}</div>
            <button type="button" className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
            type="button"
          >
            Add Project
          </button>

          <button
            className={`tab-btn ${activeTab === "manage" ? "active" : ""}`}
            onClick={() => setActiveTab("manage")}
            type="button"
          >
            Manage Projects
          </button>
        </div>

        {activeTab === "add" && (
          <div className="admin-grid">
            <div className="panel" style={{ padding: 24 }}>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Project Title</label>
                  <input
                    className="input"
                    name="title"
                    placeholder="e.g. VenueOS Dashboard"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="field">
                    <label className="label">Category</label>
                    <select
                      className="select"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          style={{ background: "#0d1219" }}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Year</label>
                    <input
                      className="input"
                      name="year"
                      placeholder="e.g. 2026"
                      value={form.year}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Short Description</label>
                  <textarea
                    className="textarea"
                    name="short_description"
                    placeholder="A short summary for card preview"
                    value={form.short_description}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label className="label">Full Description</label>
                  <textarea
                    className="textarea"
                    name="full_description"
                    placeholder="Detailed project description for popup/modal"
                    value={form.full_description}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="field">
                    <label className="label">Website / Live Link</label>
                    <input
                      className="input"
                      name="live_url"
                      placeholder="https://example.com"
                      value={form.live_url}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label className="label">GitHub Link</label>
                    <input
                      className="input"
                      name="github_url"
                      placeholder="https://github.com/..."
                      value={form.github_url}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Cover Image</label>
                  <input
                    className="input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files[0])}
                  />
                  <div className="file-note">
                    This image will show on the project card and as the first image in the popup.
                  </div>
                </div>

                <div className="field">
                  <label className="label">Gallery Images (Multiple)</label>
                  <input
                    className="input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setGalleryImages(e.target.files)}
                  />
                  <div className="file-note">
                    These images will appear in the popup slider.
                  </div>
                </div>

                <div className="field">
                  <label className="label">Display Settings</label>
                  <div className="checkbox-row">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={form.is_featured}
                        onChange={handleChange}
                      />
                      Featured Project
                    </label>

                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="is_published"
                        checked={form.is_published}
                        onChange={handleChange}
                      />
                      Published
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Saving Project..." : "Add Project"}
                </button>

                <p className="status">{status}</p>
              </form>
            </div>

            <div className="panel" style={{ padding: 24 }}>
              <h2 className="section-title">What this form adds</h2>
              <p className="section-text">
                This form supports all the important fields your portfolio needs.
              </p>

              <div className="side-list">
                <div className="side-item">
                  <strong>Title + Category</strong>
                  <br />
                  Used in grouped portfolio sections.
                </div>

                <div className="side-item">
                  <strong>Short + Full Description</strong>
                  <br />
                  Short description for cards, full description for popup detail view.
                </div>

                <div className="side-item">
                  <strong>Website + GitHub</strong>
                  <br />
                  Useful for clients, recruiters, and case-study style viewing.
                </div>

                <div className="side-item">
                  <strong>Cover + Gallery Images</strong>
                  <br />
                  Cover for cards and multiple gallery images for slider popup.
                </div>

                <div className="side-item">
                  <strong>Featured + Published</strong>
                  <br />
                  Control homepage highlights and whether project appears publicly.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "manage" && (
          <div className="manage-grid">
            <div className="panel" style={{ padding: 24 }}>
              <h2 className="section-title" style={{ marginBottom: 18 }}>
                {editingId ? "Edit Project" : "Manage Existing Projects"}
              </h2>

              {editingId ? (
                <form onSubmit={saveEdit}>
                  <div className="field">
                    <label className="label">Project Title</label>
                    <input
                      className="input"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div className="row-2">
                    <div className="field">
                      <label className="label">Category</label>
                      <select
                        className="select"
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                      >
                        {categories.map((category) => (
                          <option
                            key={category}
                            value={category}
                            style={{ background: "#0d1219" }}
                          >
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field">
                      <label className="label">Year</label>
                      <input
                        className="input"
                        name="year"
                        value={editForm.year}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Short Description</label>
                    <textarea
                      className="textarea"
                      name="short_description"
                      value={editForm.short_description}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Full Description</label>
                    <textarea
                      className="textarea"
                      name="full_description"
                      value={editForm.full_description}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="row-2">
                    <div className="field">
                      <label className="label">Website / Live Link</label>
                      <input
                        className="input"
                        name="live_url"
                        placeholder="Leave empty if no website"
                        value={editForm.live_url}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="field">
                      <label className="label">GitHub Link</label>
                      <input
                        className="input"
                        name="github_url"
                        placeholder="Leave empty if no GitHub"
                        value={editForm.github_url}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Display Settings</label>
                    <div className="checkbox-row">
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          name="is_featured"
                          checked={editForm.is_featured}
                          onChange={handleEditChange}
                        />
                        Featured
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          name="is_published"
                          checked={editForm.is_published}
                          onChange={handleEditChange}
                        />
                        Published
                      </label>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button type="submit" className="btn-primary" style={{ width: "auto" }}>
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="status">{manageStatus}</div>
                </form>
              ) : (
                <>
                  {loadingProjects ? (
                    <p style={{ color: "rgba(255,255,255,0.68)" }}>
                      Loading projects...
                    </p>
                  ) : projects.length === 0 ? (
                    <p style={{ color: "rgba(255,255,255,0.68)" }}>
                      No projects found.
                    </p>
                  ) : (
                    <div className="projects-table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Project</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Links</th>
                            <th>Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {projects.map((project) => (
                            <tr key={project.id}>
                              <td>
                                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                                  {project.title}
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.56)" }}>
                                  {project.year || "No year"}
                                </div>
                              </td>

                              <td>
                                <span className="pill orange">{project.category}</span>
                              </td>

                              <td>
                                <div style={{ display: "grid", gap: 8 }}>
                                  <span className="pill">
                                    {project.is_featured ? "Featured" : "Not Featured"}
                                  </span>
                                  <span className="pill">
                                    {project.is_published ? "Published" : "Hidden"}
                                  </span>
                                </div>
                              </td>

                              <td>
                                <div style={{ display: "grid", gap: 8 }}>
                                  <span className="pill">
                                    {project.live_url ? "Website Added" : "No Website"}
                                  </span>
                                  <span className="pill">
                                    {project.github_url ? "GitHub Added" : "No GitHub"}
                                  </span>
                                </div>
                              </td>

                              <td>
                                <div className="actions">
                                  <button
                                    type="button"
                                    className="btn-small"
                                    onClick={() => startEdit(project)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    className="btn-small"
                                    onClick={() => toggleFeatured(project)}
                                  >
                                    {project.is_featured ? "Unfeature" : "Feature"}
                                  </button>

                                  <button
                                    type="button"
                                    className="btn-small"
                                    onClick={() => togglePublished(project)}
                                  >
                                    {project.is_published ? "Hide" : "Publish"}
                                  </button>

                                  <button
                                    type="button"
                                    className="btn-danger"
                                    onClick={() => deleteProject(project)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {!!manageStatus && <div className="status">{manageStatus}</div>}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}