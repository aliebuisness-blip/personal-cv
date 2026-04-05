import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

function groupProjectsByCategory(projects) {
  return projects.reduce((acc, project) => {
    const key = project.category || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(project);
    return acc;
  }, {});
}

function ProjectModal({ project, onClose }) {
  const images = useMemo(() => {
    const arr = [];

    if (project.cover_image_url) arr.push(project.cover_image_url);

    if (project.gallery_images && Array.isArray(project.gallery_images)) {
      project.gallery_images.forEach((img) => {
        if (img) arr.push(img);
      });
    }

    const unique = [...new Set(arr)];
    return unique.length ? unique : [null];
  }, [project]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedImage, setDisplayedImage] = useState(images[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setFade(false);

    const timeout = setTimeout(() => {
      setDisplayedImage(images[currentIndex]);
      setFade(true);
    }, 120);

    return () => clearTimeout(timeout);
  }, [currentIndex, images]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (images.length <= 1) return;

      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }

      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images, onClose]);

  function prevImage() {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function nextImage() {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.76)",
        backdropFilter: "blur(10px)",
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1020px, 100%)",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#11161f",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 28,
          boxShadow: "0 30px 80px rgba(0,0,0,0.42)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", background: "#0b1017" }}>
          <div
            style={{
              position: "relative",
              height: 440,
              overflow: "hidden",
            }}
          >
            {displayedImage ? (
              <img
                src={displayedImage}
                alt={project.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: fade ? 1 : 0.25,
                  transform: fade ? "scale(1)" : "scale(1.02)",
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                No Image
              </div>
            )}

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.84), rgba(10,10,10,0.10))",
              }}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.35)",
                color: "white",
                borderRadius: 999,
                padding: "10px 14px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Close
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  style={{
                    position: "absolute",
                    left: 18,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(0,0,0,0.35)",
                    color: "white",
                    borderRadius: 999,
                    width: 46,
                    height: 46,
                    cursor: "pointer",
                    fontSize: 22,
                    lineHeight: 1,
                    transition: "all 0.22s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #ffb35c, #ff8c3a)";
                    e.currentTarget.style.color = "#111";
                    e.currentTarget.style.borderColor = "rgba(255,179,92,0.30)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.35)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  }}
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  style={{
                    position: "absolute",
                    right: 18,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(0,0,0,0.35)",
                    color: "white",
                    borderRadius: 999,
                    width: 46,
                    height: 46,
                    cursor: "pointer",
                    fontSize: 22,
                    lineHeight: 1,
                    transition: "all 0.22s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #ffb35c, #ff8c3a)";
                    e.currentTarget.style.color = "#111";
                    e.currentTarget.style.borderColor = "rgba(255,179,92,0.30)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.35)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 10,
                padding: 14,
                overflowX: "auto",
                background: "#0f141c",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {images.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  style={{
                    flex: "0 0 auto",
                    width: 88,
                    height: 64,
                    borderRadius: 12,
                    overflow: "hidden",
                    border:
                      currentIndex === index
                        ? "2px solid #ffb35c"
                        : "1px solid rgba(255,255,255,0.10)",
                    background: "#0b1017",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <img
                    src={img}
                    alt={`thumb-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: 28 }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,179,92,0.12)",
                border: "1px solid rgba(255,179,92,0.18)",
                fontSize: 12,
                color: "#ffbf77",
              }}
            >
              {project.category}
            </span>

            {project.year ? (
              <span
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.74)",
                }}
              >
                {project.year}
              </span>
            ) : null}
          </div>

          <h2
            style={{
              margin: "0 0 12px 0",
              fontSize: 38,
              lineHeight: 1.05,
              letterSpacing: "-0.05em",
            }}
          >
            {project.title}
          </h2>

          <p
            style={{
              margin: "0 0 14px 0",
              color: "rgba(255,255,255,0.66)",
              lineHeight: 1.8,
              fontSize: 15,
            }}
          >
            {project.full_description ||
              project.short_description ||
              "No description added yet."}
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "13px 18px",
                  borderRadius: 999,
                  background: "#ffb35c",
                  color: "#111",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Visit Website
              </a>
            ) : null}

            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "13px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                GitHub
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({ category, projects, onProjectClick }) {
  const rowRef = useRef(null);

  function scrollRow(direction) {
    if (!rowRef.current) return;
    const amount = rowRef.current.clientWidth * 0.82;
    rowRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="category-section">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
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
            Category
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.05,
              letterSpacing: "-0.05em",
            }}
          >
            {category}
          </h2>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => scrollRow("left")}
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "white",
              cursor: "pointer",
              fontSize: 20,
              transition: "all 0.22s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #ffb35c, #ff8c3a)";
              e.currentTarget.style.color = "#111";
              e.currentTarget.style.borderColor = "rgba(255,179,92,0.30)";
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(255,179,92,0.20)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => scrollRow("right")}
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "white",
              cursor: "pointer",
              fontSize: 20,
              transition: "all 0.22s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #ffb35c, #ff8c3a)";
              e.currentTarget.style.color = "#111";
              e.currentTarget.style.borderColor = "rgba(255,179,92,0.30)";
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(255,179,92,0.20)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="projects-row"
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          scrollBehavior: "smooth",
          paddingBottom: 8,
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => onProjectClick(project)}
            style={{
              flex: "0 0 min(560px, 88vw)",
            }}
          >
            {project.cover_image_url ? (
              <img
                src={project.cover_image_url}
                alt={project.title}
                className="project-image"
              />
            ) : (
              <div
                className="project-image"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.34)",
                  fontSize: 14,
                }}
              >
                No Image
              </div>
            )}

            <div style={{ padding: 22 }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    padding: "7px 12px",
                    borderRadius: 999,
                    background: "rgba(255,179,92,0.12)",
                    border: "1px solid rgba(255,179,92,0.18)",
                    fontSize: 12,
                    color: "#ffbf77",
                  }}
                >
                  {project.category}
                </span>

                {project.year ? (
                  <span
                    style={{
                      padding: "7px 12px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.74)",
                    }}
                  >
                    {project.year}
                  </span>
                ) : null}
              </div>

              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: 24,
                  letterSpacing: "-0.03em",
                }}
              >
                {project.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.62)",
                  lineHeight: 1.75,
                  fontSize: 14,
                }}
              >
                {project.short_description || "No short description added yet."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function WorkPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setProjects(data || []);
      }

      setLoading(false);
    }

    fetchProjects();
  }, []);

  const groupedProjects = useMemo(
    () => groupProjectsByCategory(projects),
    [projects]
  );

  return (
    <div>
      <style>{`
  * { box-sizing: border-box; }

  html, body {
    overflow-x: hidden;
  }

  .container {
    width: min(1240px, calc(100% - 32px));
    margin: 0 auto;
  }

  .category-section {
    margin-top: 34px;
  }

  .project-card {
    background: #11161f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    overflow: hidden;
    transition: 0.28s ease;
    cursor: pointer;
    min-width: 0;
  }

  .project-card:hover {
    transform: translateY(-6px);
    border-color: rgba(255,255,255,0.16);
    box-shadow: 0 20px 40px rgba(0,0,0,0.28);
  }

  .project-image {
    width: 100%;
    height: 280px;
    object-fit: cover;
    object-position: center top;
    display: block;
    background: #0d1219;
    transition: transform 0.35s ease;
  }

  .project-card:hover .project-image {
    transform: scale(1.04);
  }

  .projects-row::-webkit-scrollbar {
    height: 6px;
  }

  .projects-row::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.04);
    border-radius: 999px;
  }

  .projects-row::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.14);
    border-radius: 999px;
  }

  .projects-row {
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.14) rgba(255,255,255,0.04);
  }

  /* 🔥 MOBILE FIXES */

  @media (max-width: 900px) {
    .container {
      width: min(1240px, calc(100% - 20px));
    }

    .project-card {
      border-radius: 18px;
    }

    .project-image {
      height: 240px;
    }
  }

  @media (max-width: 600px) {
    .container {
      width: min(1240px, calc(100% - 16px));
    }

    .category-section {
      margin-top: 26px;
    }

    .project-image {
      height: 200px;
    }

    .project-card {
      border-radius: 16px;
    }
  }
`}</style>

      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "#0d1219",
        }}
      >
        <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
          <div
            style={{
              color: "rgba(255,255,255,0.42)",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              marginBottom: 10,
            }}
          >
            Portfolio
          </div>

          <h1
            style={{
              margin: "0 0 10px 0",
              fontSize: "clamp(42px, 7vw, 84px)",
              lineHeight: 0.95,
              letterSpacing: "-0.06em",
            }}
          >
            Work Archive
          </h1>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 760,
              lineHeight: 1.8,
              fontSize: 15,
            }}
          >
            Projects grouped by category, shown in horizontal rows with detailed popups.
          </p>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.68)" }}>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.68)" }}>No projects found.</p>
        ) : (
          Object.entries(groupedProjects).map(([category, categoryProjects]) => (
            <CategoryRow
              key={category}
              category={category}
              projects={categoryProjects}
              onProjectClick={setActiveProject}
            />
          ))
        )}
      </main>

      {activeProject ? (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      ) : null}
    </div>
  );
}