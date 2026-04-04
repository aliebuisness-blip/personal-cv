export default function About() {
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
          grid-template-columns: 1.1fr 0.9fr;
          gap: 22px;
          border-radius: 30px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(circle at 78% 28%, rgba(255,179,92,0.18), transparent 18%),
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
            radial-gradient(circle at 70% 24%, rgba(255,179,92,0.24), transparent 18%),
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

        .story-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
          margin-top: 24px;
        }

        .card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 28px;
          transition: 0.28s ease;
        }

        .card:hover,
        .pillar-card:hover,
        .approach-card:hover,
        .stat-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.16);
          box-shadow: 0 20px 40px rgba(0,0,0,0.24);
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 24px;
        }

        .pillar-card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 24px;
          transition: 0.28s ease;
        }

        .pillar-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 999px;
          background: rgba(255,179,92,0.12);
          border: 1px solid rgba(255,179,92,0.18);
          color: #ffbf77;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .pillar-title {
          margin: 0 0 10px 0;
          font-size: 28px;
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .pillar-copy {
          margin: 0;
          color: rgba(255,255,255,0.64);
          line-height: 1.8;
          font-size: 15px;
        }

        .approach-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 24px;
        }

        .approach-card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 24px;
          transition: 0.28s ease;
        }

        .approach-badge {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: rgba(255,179,92,0.12);
          border: 1px solid rgba(255,179,92,0.18);
          color: #ffbf77;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        .stat-card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 20px;
          transition: 0.28s ease;
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
          .story-grid,
          .pillars-grid,
          .approach-grid,
          .stats-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="hero-wrap">
        <div className="container">
          <div className="hero-card">
            <div className="hero-left">
              <div className="badge-row">
                <span className="badge">Personal Story</span>
                <span className="badge accent">Design + Development</span>
              </div>

              <div className="eyebrow">About</div>

              <h1 className="hero-title">
                Clean thinking,
                <br />
                stronger output.
              </h1>

              <p className="hero-copy">
                I’m focused on building digital work that feels structured, presentable,
                and worth showing. The aim is never random decoration. It is better
                hierarchy, clearer communication, and digital experiences that look
                properly put together.
              </p>
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
      borderRadius: 24,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.08)",
      minHeight: 360,
      position: "relative",
      background: "rgba(255,255,255,0.03)",
    }}
  >
    <img
      src="/MyPic.jpeg"
      alt="Ali Abdullah"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.32), rgba(0,0,0,0.02))",
      }}
    />
  </div>

  <div
    style={{
      borderRadius: 20,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.03)",
      padding: 18,
      display: "grid",
      gap: 12,
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
      Personal Note
    </div>

    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        lineHeight: 1.35,
      }}
    >
      I care about how things feel before I care about how they flex.
    </div>

    <div
      style={{
        color: "rgba(255,255,255,0.62)",
        fontSize: 14,
        lineHeight: 1.8,
      }}
    >
      Clean thinking. Better visuals. Stronger presentation.
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
          <div className="section-label">Story</div>
          <h2 className="section-title">The way I approach digital work</h2>
          <p className="section-copy">
            My focus sits between design, branding, and execution. I care about how
            something looks, but also how it feels, how it is presented, and whether
            it actually looks ready for real use.
          </p>

          <div className="story-grid">
            <div className="card">
              <p className="section-copy" style={{ marginBottom: 14 }}>
                I like digital work that feels intentional. Good spacing, better
                hierarchy, stronger visual rhythm, cleaner UI, and a sense that
                someone actually thought through the whole output.
              </p>

              <p className="section-copy" style={{ marginBottom: 14 }}>
                That is why I naturally move between UI/UX, branding, websites,
                systems, and frontend implementation. I don’t like work that feels
                disconnected. I prefer when the whole thing feels unified.
              </p>

              <p className="section-copy">
                The goal is simple: build things that feel stronger, cleaner, and
                more confident than the average portfolio template or random design drop.
              </p>
            </div>

            <div className="card">
              <div className="section-label">Focus Areas</div>
              <div className="check-list">
                {[
                  "UI/UX design with stronger structure",
                  "Portfolio and business websites",
                  "Brand presentation and cleaner visual direction",
                  "Dashboard and system interfaces",
                  "Frontend implementation for polished UI",
                  "Better overall digital presentation",
                ].map((item) => (
                  <div key={item} className="check-item">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-label">Core Pillars</div>
          <h2 className="section-title">What matters most in my work</h2>
          <p className="section-copy">
            These are the main ideas that keep showing up in the way I design,
            build, and present digital work.
          </p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-number">01</div>
              <h3 className="pillar-title">Clarity</h3>
              <p className="pillar-copy">
                Work should feel understandable at first glance. Strong hierarchy and
                clean layout make a huge difference.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-number">02</div>
              <h3 className="pillar-title">Presentation</h3>
              <p className="pillar-copy">
                The same idea can feel average or premium depending on how well it is
                framed and visually structured.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-number">03</div>
              <h3 className="pillar-title">Execution</h3>
              <p className="pillar-copy">
                Good visuals matter more when they can actually turn into a polished,
                working digital output.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-label">Approach</div>
          <h2 className="section-title">How I usually move through a project</h2>
          <p className="section-copy">
            Not a rigid system, but a practical flow that keeps the output cleaner and stronger.
          </p>

          <div className="approach-grid">
            <div className="approach-card">
              <div className="approach-badge">01</div>
              <h3 className="pillar-title" style={{ fontSize: 26 }}>Understand</h3>
              <p className="pillar-copy">
                Start by understanding what the project actually needs to communicate,
                not just what looks cool in isolation.
              </p>
            </div>

            <div className="approach-card">
              <div className="approach-badge">02</div>
              <h3 className="pillar-title" style={{ fontSize: 26 }}>Structure</h3>
              <p className="pillar-copy">
                Build section flow, layout rhythm, spacing, and hierarchy so the work
                feels more deliberate.
              </p>
            </div>

            <div className="approach-card">
              <div className="approach-badge">03</div>
              <h3 className="pillar-title" style={{ fontSize: 26 }}>Refine</h3>
              <p className="pillar-copy">
                Push the details until the final result feels presentable, usable, and
                worth showing with confidence.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-label">Snapshot</div>
          <h2 className="section-title">A quick read of what I bring</h2>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">Design</div>
              <div className="stat-label">UI/UX, websites, branding, and structured interfaces.</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">Build</div>
              <div className="stat-label">Frontend execution and digital systems with cleaner presentation.</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">Taste</div>
              <div className="stat-label">Focused on work that feels premium without being noisy or overdone.</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">Goal</div>
              <div className="stat-label">Make the final output feel stronger than the average template.</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}