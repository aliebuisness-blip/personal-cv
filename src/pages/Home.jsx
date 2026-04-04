import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [
          { data: projectsData, error: projectsError },
          { data: servicesData, error: servicesError },
          { data: profileData, error: profileError },
        ] = await Promise.all([
          supabase
            .from("projects")
            .select("*")
            .eq("is_published", true)
            .eq("is_featured", true)
            .order("created_at", { ascending: false })
            .limit(3),

          supabase
            .from("services")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .limit(6),

          supabase
            .from("profile_settings")
            .select("*")
            .limit(1)
        ]);

        if (projectsError) console.error(projectsError);
        if (servicesError) console.error(servicesError);
        if (profileError) console.error(profileError);

        setFeaturedProjects(projectsData || []);
        setServices(servicesData || []);
        setProfile(profileData?.[0] || null);
      } catch (error) {
        console.error("Home page fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  return (
    <div>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .container {
          width: min(1240px, calc(100% - 32px));
          margin: 0 auto;
        }

        .hero-shell {
          padding-top: 34px;
          padding-bottom: 34px;
        }

        .hero-card {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
          min-height: 620px;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(circle at 72% 35%, rgba(255,143,41,0.35), transparent 20%),
            linear-gradient(135deg, #111111 0%, #171717 45%, #111111 100%);
          box-shadow: 0 24px 60px rgba(0,0,0,0.35);
        }

        .hero-left {
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-right {
          position: relative;
          min-height: 100%;
          overflow: hidden;
        }

        .hero-image-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: end;
          justify-content: center;
          padding: 28px;
        }

        .hero-portrait-frame {
          width: 100%;
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(circle at 60% 30%, rgba(255,149,56,0.55), transparent 22%),
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
        }

        .hero-portrait-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: saturate(0.95) contrast(1.02);
        }

        .hero-portrait-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,8,8,0.78), rgba(8,8,8,0.08));
        }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 22px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.78);
          font-size: 12px;
        }

        .hero-badge.accent {
          background: rgba(255,163,71,0.14);
          border-color: rgba(255,163,71,0.22);
          color: #ffc37f;
        }

        .eyebrow {
          color: #ffb35c;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(52px, 8vw, 92px);
          line-height: 0.92;
          letter-spacing: -0.08em;
          color: #ffffff;
        }

        .hero-role {
          margin: 20px 0 14px 0;
          font-size: 24px;
          line-height: 1.4;
          color: rgba(255,255,255,0.82);
          max-width: 760px;
        }

        .hero-copy {
          margin: 0;
          color: rgba(255,255,255,0.64);
          line-height: 1.85;
          font-size: 15px;
          max-width: 720px;
        }

        .hero-contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 22px;
          color: rgba(255,255,255,0.78);
          font-size: 14px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border-radius: 999px;
          background: #ffb35c;
          color: #101010;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          transition: 0.22s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: 0.22s ease;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }

        .stats-row {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          padding: 20px;
          transition: 0.28s ease;
        }

        .stat-card:hover,
        .service-card:hover,
        .about-card:hover,
        .contact-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.16);
          box-shadow: 0 20px 40px rgba(0,0,0,0.24);
        }

        .stat-value {
          font-size: 34px;
          font-weight: 700;
          letter-spacing: -0.06em;
          margin-bottom: 6px;
        }

        .stat-label {
          color: rgba(255,255,255,0.58);
          font-size: 14px;
          line-height: 1.6;
        }

        .section {
          padding-top: 34px;
          padding-bottom: 8px;
        }

        .section-label {
          color: rgba(255,255,255,0.42);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          margin-bottom: 10px;
        }

        .section-title {
          margin: 0 0 10px 0;
          font-size: clamp(32px, 4vw, 46px);
          line-height: 1.04;
          letter-spacing: -0.06em;
        }

        .section-text {
          margin: 0;
          color: rgba(255,255,255,0.62);
          max-width: 760px;
          line-height: 1.8;
          font-size: 15px;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 24px;
        }

        .project-card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          overflow: hidden;
          transition: 0.28s ease;
        }

        .project-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.16);
          box-shadow: 0 20px 40px rgba(0,0,0,0.28);
        }

        .project-image-wrap {
          position: relative;
          height: 240px;
          overflow: hidden;
        }

        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: #0d1219;
          transition: transform 0.35s ease;
        }

        .project-card:hover .project-image {
          transform: scale(1.04);
        }

        .project-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.82), rgba(10,10,10,0.10));
        }

        .project-content {
          padding: 22px;
        }

        .project-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .tag {
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          font-size: 12px;
          color: rgba(255,255,255,0.76);
        }

        .tag.accent {
          background: rgba(255,163,71,0.12);
          border-color: rgba(255,163,71,0.18);
          color: #ffbf77;
        }

        .project-title {
          margin: 0 0 10px 0;
          font-size: 24px;
          letter-spacing: -0.03em;
        }

        .project-copy {
          margin: 0;
          color: rgba(255,255,255,0.62);
          line-height: 1.75;
          font-size: 14px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 24px;
        }

        .service-card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 24px;
          transition: 0.28s ease;
        }

        .service-number {
          color: #ffb35c;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .service-title {
          margin: 0 0 10px 0;
          font-size: 24px;
          letter-spacing: -0.03em;
        }

        .service-copy {
          margin: 0;
          color: rgba(255,255,255,0.62);
          line-height: 1.75;
          font-size: 14px;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
          margin-top: 24px;
        }

        .about-card,
        .contact-card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 28px;
          transition: 0.28s ease;
        }

        .contact-list {
          display: grid;
          gap: 12px;
          margin-top: 16px;
        }

        .contact-pill {
          padding: 12px 14px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.78);
          font-size: 14px;
        }

        @media (max-width: 1100px) {
          .hero-card,
          .projects-grid,
          .services-grid,
          .bottom-grid,
          .stats-row {
            grid-template-columns: 1fr;
          }

          .hero-right {
            min-height: 420px;
          }
        }

        @media (max-width: 720px) {
          .hero-left {
            padding: 28px;
          }

          .hero-card {
            min-height: auto;
          }
        }
      `}</style>

      <section className="hero-shell">
        <div className="container">
          <div className="hero-card">
            <div className="hero-left">
              <div className="hero-meta">
                <span className="hero-badge">Open to work</span>
                <span className="hero-badge accent">Vibe Coder</span>
              </div>

              <div className="eyebrow">Digital Presentation</div>

              <h1 className="hero-title">
                A L I
                <br />
                A B D U L L A H
              </h1>

              <p className="hero-role">
                {profile?.hero_title ||
                  "Your product doesn’t need more features. It needs better visuals."}
              </p>

              <p className="hero-copy">
                {profile?.hero_description ||
                  "Most websites look fine. Very few feel right. I fix the structure, the spacing, and the way your product presents itself so people actually take it seriously."}
              </p>

              <div className="hero-contact-row">
                <span>{profile?.email || "your@email.com"}</span>
                <span>{profile?.linkedin || "linkedin.com/in/your-link"}</span>
                <span>{profile?.whatsapp || "+92 300 0000000"}</span>
              </div>

              <div className="hero-actions">
                <Link to="/work" className="btn-primary">
                  View Work
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Let’s Talk
                </Link>
                <a
                  href={profile?.cv_url || "#"}
                  className="btn-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download CV
                </a>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-image-wrap">
                <div className="hero-portrait-frame">
                  {profile?.profile_image_url ? (
                    <img
                      src={profile.profile_image_url}
                      alt={profile?.full_name || "Profile"}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255,255,255,0.30)",
                        fontSize: 16,
                        background:
                          "radial-gradient(circle at 70% 30%, rgba(255,149,56,0.55), transparent 20%), #151515",
                      }}
                    >
                      Add profile photo from backend later
                    </div>
                  )}
                  <div className="hero-portrait-overlay" />
                </div>
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">Design</div>
              <div className="stat-label">UI/UX, branding, interfaces, websites, visual structure.</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">Build</div>
              <div className="stat-label">Frontend execution, digital systems, and product presentation.</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{featuredProjects.length}+</div>
              <div className="stat-label">Featured projects currently shown from Supabase.</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">Focus</div>
              <div className="stat-label">Clean dark premium websites with stronger hierarchy and feel.</div>
            </div>
          </div>
        </div>
      </section>

      <main className="container" style={{ paddingBottom: 52 }}>
        <section className="section">
          <div className="section-label">Featured Work</div>
          <h2 className="section-title">Selected projects</h2>
          <p className="section-text">
            A curated selection of featured projects pulled directly from your database.
          </p>

          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.68)", marginTop: 24 }}>
              Loading featured work...
            </p>
          ) : featuredProjects.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.68)", marginTop: 24 }}>
              No featured projects yet.
            </p>
          ) : (
            <div className="projects-grid">
              {featuredProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-image-wrap">
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
                    <div className="project-image-overlay" />
                  </div>

                  <div className="project-content">
                    <div className="project-tags">
                      <span className="tag accent">{project.category}</span>
                      {project.year ? <span className="tag">{project.year}</span> : null}
                    </div>

                    <h3 className="project-title">{project.title}</h3>

                    <p className="project-copy">
                      {project.short_description || "No short description added yet."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <div className="section-label">Services</div>
          <h2 className="section-title">What I can help with</h2>
          <p className="section-text">
            Most digital work feels off — bad spacing, weak hierarchy, messy layout.  
This is where I step in.
          </p>

          <div className="services-grid">
            {services.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.68)" }}>No services found yet.</p>
            ) : (
              services.map((service, index) => (
                <div key={service.id} className="service-card">
                  <div className="service-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="service-title">{service.title}</h3>

                  <p className="service-copy">{service.description}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="section">
          <div className="bottom-grid">
            <div className="about-card">
              <div className="section-label">About</div>
              <h2 className="section-title" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
                More than just a portfolio
              </h2>

              <p className="section-text" style={{ marginBottom: 14 }}>
                {profile?.about_text ||
                  "I don’t like messy work.Not messy layouts, not messy spacing, not messy thinking. Most products don’t fail because of bad ideas, they fail because they look unfinished."}
              </p>

              <p className="section-text" style={{ marginBottom: 18 }}>
                This site isn’t just a portfolio.
                It’s how I present work the way it should be presented.
              </p>

              <Link to="/about" className="btn-secondary">
                Read More
              </Link>
            </div>

            <div className="contact-card">
              <div className="section-label">Contact</div>
              <h2 className="section-title" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
                Let’s work together
              </h2>

              <div className="contact-list">
                <div className="contact-pill">{profile?.email || "your@email.com"}</div>
                <div className="contact-pill">{profile?.whatsapp || "+92 300 0000000"}</div>
                <div className="contact-pill">
                  {profile?.linkedin || "https://www.linkedin.com/in/ali-abdullah-028845333/"}
                </div>
                <div className="contact-pill">
                  {profile?.github || "github.com/your-github"}
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <Link to="/contact" className="btn-primary">
                  Contact Page
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}