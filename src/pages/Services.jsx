import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Supabase services error:", error);
      } else {
        setServices(data || []);
      }

      setLoading(false);
    }

    fetchServices();
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

        .hero-wrap {
          padding-top: 34px;
          padding-bottom: 24px;
        }

        .hero-card {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 22px;
          border-radius: 30px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(circle at 78% 28%, rgba(255,179,92,0.22), transparent 18%),
            linear-gradient(135deg, #10141b 0%, #151922 52%, #10141b 100%);
          box-shadow: 0 24px 60px rgba(0,0,0,0.30);
        }

        .hero-left {
          padding: 38px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 420px;
        }

        .hero-right {
          padding: 24px;
          display: flex;
          align-items: stretch;
          justify-content: center;
        }

        .hero-visual {
          width: 100%;
          min-height: 100%;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(circle at 70% 24%, rgba(255,179,92,0.28), transparent 18%),
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
          display: grid;
          gap: 14px;
          padding: 22px;
        }

        .visual-box {
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
        }

        .visual-box.large {
          min-height: 180px;
        }

        .visual-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .badge-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .badge {
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.78);
          font-size: 12px;
        }

        .badge.accent {
          background: rgba(255,179,92,0.12);
          border-color: rgba(255,179,92,0.18);
          color: #ffbf77;
        }

        .eyebrow {
          color: #ffb35c;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .hero-title {
          margin: 0 0 14px 0;
          font-size: clamp(42px, 7vw, 78px);
          line-height: 0.96;
          letter-spacing: -0.07em;
        }

        .hero-copy {
          margin: 0;
          color: rgba(255,255,255,0.64);
          line-height: 1.85;
          font-size: 15px;
          max-width: 720px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border-radius: 999px;
          background: #ffb35c;
          color: #111;
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

        .section {
          padding-top: 34px;
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
          font-size: clamp(30px, 4vw, 44px);
          line-height: 1.05;
          letter-spacing: -0.05em;
        }

        .section-copy {
          margin: 0;
          color: rgba(255,255,255,0.64);
          max-width: 760px;
          line-height: 1.8;
          font-size: 15px;
        }

        .feature-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        .feature-item {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 20px;
          transition: 0.28s ease;
        }

        .feature-item:hover,
        .service-card:hover,
        .info-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.16);
          box-shadow: 0 20px 40px rgba(0,0,0,0.24);
        }

        .feature-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.04em;
          margin-bottom: 8px;
        }

        .feature-copy {
          color: rgba(255,255,255,0.60);
          line-height: 1.7;
          font-size: 14px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 26px;
        }

        .service-card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 28px;
          transition: 0.28s ease;
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,179,92,0.45), transparent);
        }

        .service-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: rgba(255,179,92,0.12);
          border: 1px solid rgba(255,179,92,0.18);
          color: #ffbf77;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .service-title {
          margin: 0 0 12px 0;
          font-size: 30px;
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .service-copy {
          margin: 0;
          color: rgba(255,255,255,0.64);
          line-height: 1.8;
          font-size: 15px;
        }

        .service-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .service-tag {
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.74);
          font-size: 12px;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 20px;
          margin-top: 34px;
        }

        .info-card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 28px;
          transition: 0.28s ease;
        }

        .process-list {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .process-item {
          display: grid;
          grid-template-columns: 54px 1fr;
          gap: 14px;
          align-items: start;
          padding: 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .process-badge {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: rgba(255,179,92,0.12);
          border: 1px solid rgba(255,179,92,0.18);
          color: #ffbf77;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .check-list {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }

        .check-item {
          padding: 14px 16px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.76);
          font-size: 14px;
          line-height: 1.75;
        }

        @media (max-width: 1080px) {
          .hero-card,
          .feature-strip,
          .services-grid,
          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="hero-wrap">
        <div className="container">
          <div className="hero-card">
            <div className="hero-left">
              <div className="badge-row">
                <span className="badge">Client Ready</span>
                <span className="badge accent">Design + Execution</span>
              </div>

              <div className="eyebrow">Services</div>

              <h1 className="hero-title">
                Strong digital work,
                <br />
                properly presented.
              </h1>

              <p className="hero-copy">
                I help shape websites, interfaces, brands, and digital systems so they
                do not just look good — they feel structured, premium, and ready to show
                with confidence.
              </p>

              <div className="hero-actions">
                <a href="/contact" className="btn-primary">
                  Let’s Work
                </a>
                <a href="/work" className="btn-secondary">
                  View Projects
                </a>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-visual">
<div
  style={{
    display: "grid",
    gap: 14,
    width: "100%",
    minHeight: "100%",
  }}
>
  <div
    style={{
      borderRadius: 22,
      border: "1px solid rgba(255,255,255,0.08)",
      background:
        "radial-gradient(circle at 80% 20%, rgba(255,179,92,0.16), transparent 18%), rgba(255,255,255,0.03)",
      padding: 20,
      minHeight: 150,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div
      style={{
        color: "rgba(255,255,255,0.45)",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
      }}
    >
      Problem
    </div>

    <div
      style={{
        fontSize: 26,
        fontWeight: 700,
        lineHeight: 1.25,
      }}
    >
      Most digital work does not look bad.
      <br />
      It just does not feel finished.
    </div>
  </div>

  <div
    style={{
      borderRadius: 20,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.03)",
      padding: 18,
    }}
  >
    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginBottom: 8 }}>
      UI / UX
    </div>
    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
      Better flow. Better structure.
    </div>
    <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.7 }}>
      Screens that feel cleaner, clearer, and easier to trust.
    </div>
  </div>

  <div
    style={{
      borderRadius: 20,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.03)",
      padding: 18,
    }}
  >
    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginBottom: 8 }}>
      Websites
    </div>
    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
      Stronger first impression.
    </div>
    <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.7 }}>
      Not just pages. Something you can actually show with confidence.
    </div>
  </div>

  <div
    style={{
      borderRadius: 20,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.03)",
      padding: 18,
    }}
  >
    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginBottom: 8 }}>
      Frontend
    </div>
    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
      Good design, properly translated.
    </div>
    <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.7 }}>
      Clean implementation without breaking the whole visual feel.
    </div>
  </div>
</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container" style={{ paddingBottom: 50 }}>
        <section className="section">
          <div className="section-label">Highlights</div>
          <h2 className="section-title">Why clients hire for this work</h2>
          <p className="section-copy">
            The goal is not random visuals. The goal is stronger presentation,
            clearer structure, and outputs that feel worth showing.
          </p>

          <div className="feature-strip">
            <div className="feature-item">
              <div className="feature-title">Clean Hierarchy</div>
              <div className="feature-copy">
                Better spacing, section rhythm, and structure that feels intentional.
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-title">Modern Execution</div>
              <div className="feature-copy">
                Design that translates into polished interfaces and working screens.
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-title">Client Presentation</div>
              <div className="feature-copy">
                Work shaped to look stronger in real business and portfolio settings.
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-title">Usable Systems</div>
              <div className="feature-copy">
                Layouts and flows that are practical, not just visually impressive.
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-label">Core Services</div>
          <h2 className="section-title">What I can help with</h2>
          <p className="section-copy">
            Focused on design, websites, systems, branding, and turning strong ideas
            into cleaner digital outcomes.
          </p>

          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.68)", marginTop: 24 }}>
              Loading services...
            </p>
          ) : services.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.68)", marginTop: 24 }}>
              No services found.
            </p>
          ) : (
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={service.id} className="service-card">
                  <div className="service-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h2 className="service-title">{service.title}</h2>

                  <p className="service-copy">{service.description}</p>

                  <div className="service-tags">
                    <span className="service-tag">Structured</span>
                    <span className="service-tag">Modern</span>
                    <span className="service-tag">Professional</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <div className="bottom-grid">
            <div className="info-card">
              <div className="section-label">Approach</div>
              <h2 className="section-title">How the process usually works</h2>
              <p className="section-copy">
                Every strong output starts with understanding what needs to be communicated,
                then shaping it with cleaner visual logic and proper execution.
              </p>

              <div className="process-list">
                <div className="process-item">
                  <div className="process-badge">01</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Define the direction</div>
                    <div style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.75, fontSize: 14 }}>
                      Clarify the purpose, audience, and visual direction before jumping into random design.
                    </div>
                  </div>
                </div>

                <div className="process-item">
                  <div className="process-badge">02</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Build the structure</div>
                    <div style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.75, fontSize: 14 }}>
                      Organize the layout, hierarchy, and section flow so it feels cleaner and more premium.
                    </div>
                  </div>
                </div>

                <div className="process-item">
                  <div className="process-badge">03</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Refine and execute</div>
                    <div style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.75, fontSize: 14 }}>
                      Polish the final output so it is not only attractive but also presentable and usable.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="section-label">Best Fit</div>
              <h2 className="section-title" style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>
                Projects that suit this best
              </h2>

              <div className="check-list">
                {[
                  "Portfolio websites with stronger visual presence",
                  "Business websites that need cleaner structure",
                  "Landing pages for software and service presentation",
                  "Dashboard interfaces with better clarity",
                  "Brand identity support for digital consistency",
                  "Frontend execution of polished UI concepts",
                ].map((item) => (
                  <div key={item} className="check-item">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}