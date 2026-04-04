import { useEffect, useState } from "react";
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

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "UI/UX",
    short_description: "",
    full_description: "",
    year: "",
    live_url: "",
    github_url: "",
    is_featured: false,
    is_published: true,
  });

  async function fetchProjects() {
    setLoading(true);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setStatus("Failed to load projects");
    } else {
      setProjects(data || []);
      setStatus("");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function startEdit(project) {
    setEditingId(project.id);
    setForm({
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

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({
      title: "",
      category: "UI/UX",
      short_description: "",
      full_description: "",
      year: "",
      live_url: "",
      github_url: "",
      is_featured: false,
      is_published: true,
    });
    setStatus("");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleUpdate(e) {
    e.preventDefault();

    if (!editingId) return;

    setStatus("Updating project...");

    const payload = {
      ...form,
      live_url: ensureHttp(form.live_url),
      github_url: ensureHttp(form.github_url),
    };

    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", editingId);

    if (error) {
      console.error(error);
      setStatus("Failed to update project");
      return;
    }

    setStatus("Project updated successfully");
    await fetchProjects();
    cancelEdit();
  }

  async function handleDelete(project) {
    const confirmDelete = window.confirm(
      `Delete "${project.title}"? This cannot be undone.`
    );

    if (!confirmDelete) return;

    setStatus("Deleting project...");

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (error) {
      console.error(error);
      setStatus("Failed to delete project");
      return;
    }

    if (editingId === project.id) {
      cancelEdit();
    }

    setStatus("Project deleted successfully");
    await fetchProjects();
  }

  async function toggleFeatured(project) {
    const { error } = await supabase
      .from("projects")
      .update({ is_featured: !project.is_featured })
      .eq("id", project.id);

    if (error) {
      console.error(error);
      setStatus("Failed to update featured status");
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
      setStatus("Failed to update published status");
      return;
    }

    await fetchProjects();
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
        * { box-sizing: border-box; }

        .admin-shell {
          width: min(1240px, 100%);
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .panel {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.24);
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
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
          min-height: 130px;
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

        .row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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

        .btn-primary,
        .btn-secondary,
        .btn-danger,
        .btn-small {
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: 0.22s ease;
        }

        .btn-primary {
          padding: 14px 18px;
          border-radius: 14px;
          background: #ffb35c;
          color: #111;
          font-weight: 700;
          font-size: 15px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        .btn-secondary {
          padding: 14px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          color: white;
          font-weight: 600;
          font-size: 15px;
        }

        .btn-danger {
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255,80,80,0.12);
          border: 1px solid rgba(255,80,80,0.18);
          color: #ff9a9a;
          font-weight: 700;
          font-size: 14px;
        }

        .btn-small {
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .btn-small:hover,
        .btn-danger:hover,
        .btn-secondary:hover {
          transform: translateY(-2px);
        }

        .status {
          margin-top: 14px;
          color: rgba(255,255,255,0.72);
          font-size: 14px;
        }

        .table-wrap {
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
          gap: 8px;
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

        @media (max-width: 900px) {
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
              Manage Projects
            </h1>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.62)",
                lineHeight: 1.75,
                fontSize: 15,
                maxWidth: 780,
              }}
            >
              Edit titles, descriptions, links, featured status, published status,
              or delete projects you no longer want.
            </p>
          </div>
        </div>

        <div className="grid">
          <div className="panel" style={{ padding: 24 }}>
            <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: 28 }}>
              {editingId ? "Edit Project" : "Select a project to edit"}
            </h2>

            {editingId ? (
              <form onSubmit={handleUpdate}>
                <div className="field">
                  <label className="label">Project Title</label>
                  <input
                    className="input"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row-2">
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
                    value={form.short_description}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label className="label">Full Description</label>
                  <textarea
                    className="textarea"
                    name="full_description"
                    value={form.full_description}
                    onChange={handleChange}
                  />
                </div>

                <div className="row-2">
                  <div className="field">
                    <label className="label">Website / Live Link</label>
                    <input
                      className="input"
                      name="live_url"
                      placeholder="Leave empty if no website"
                      value={form.live_url}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label className="label">GitHub Link</label>
                    <input
                      className="input"
                      name="github_url"
                      placeholder="Leave empty if no GitHub"
                      value={form.github_url}
                      onChange={handleChange}
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
                        checked={form.is_featured}
                        onChange={handleChange}
                      />
                      Featured
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

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button type="submit" className="btn-primary">
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

                <div className="status">{status}</div>
              </form>
            ) : (
              <p style={{ color: "rgba(255,255,255,0.68)", margin: 0 }}>
                Pick a project from the list below to edit it.
              </p>
            )}
          </div>

          <div className="panel" style={{ padding: 24 }}>
            <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: 28 }}>
              All Projects
            </h2>

            {loading ? (
              <p style={{ color: "rgba(255,255,255,0.68)" }}>
                Loading projects...
              </p>
            ) : projects.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.68)" }}>
                No projects found.
              </p>
            ) : (
              <div className="table-wrap">
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
                              onClick={() => handleDelete(project)}
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

            {!!status && !editingId && <div className="status">{status}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}