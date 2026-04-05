import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Mail, Phone, Link2, Camera, Globe, AtSign } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Contact() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("profile_settings")
        .select("*")
        .limit(1);

      if (error) {
        console.error("Profile fetch error:", error);
      } else {
        setProfile(data?.[0] || null);
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  const email = profile?.email || "your@email.com";
  const whatsapp = profile?.whatsapp || "+92 300 0000000";
  const linkedin = profile?.linkedin || "https://linkedin.com/in/your-link";
  const instagram = profile?.instagram || "https://instagram.com/your-handle";
  const xUrl = profile?.x_url || "https://x.com/your-handle";
  const website = profile?.website || "https://yourwebsite.com";

  const whatsappLink = whatsapp.startsWith("http")
    ? whatsapp
    : `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  return (
    <div>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          overflow-x: hidden;
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
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
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
          min-width: 0;
        }

        .hero-right {
          padding: 24px;
          display: flex;
          align-items: stretch;
          justify-content: center;
          min-width: 0;
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
          min-width: 0;
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
          max-width: 100%;
          word-break: break-word;
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
          overflow-wrap: anywhere;
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
          maxWidth: 760px;
          line-height: 1.8;
          font-size: 15px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 20px;
          margin-top: 24px;
        }

        .card {
          background: #11161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 28px;
          transition: 0.28s ease;
          min-width: 0;
        }

        .card:hover,
        .contact-item:hover,
        .quick-card:hover,
        .faq-item:hover,
        .social-item:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.16);
          box-shadow: 0 20px 40px rgba(0,0,0,0.24);
        }

        .contact-list {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .contact-item {
          display: grid;
          grid-template-columns: 58px 1fr;
          gap: 14px;
          align-items: center;
          padding: 16px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: 0.28s ease;
          text-decoration: none;
          min-width: 0;
        }

        .contact-icon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          background: rgba(255,179,92,0.12);
          border: 1px solid rgba(255,179,92,0.18);
          color: #ffbf77;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }

        .contact-label {
          color: rgba(255,255,255,0.42);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 6px;
        }

        .contact-value {
          color: rgba(255,255,255,0.82);
          font-size: 15px;
          line-height: 1.7;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
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
          min-height: 48px;
          line-height: 1.2;
          text-align: center;
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
          min-height: 48px;
          line-height: 1.2;
          text-align: center;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }

        .socials-grid {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }

        .social-item {
          display: grid;
          grid-template-columns: 58px 1fr;
          gap: 14px;
          align-items: center;
          padding: 16px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: 0.28s ease;
          text-decoration: none;
          min-width: 0;
        }

        .faq-list {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .faq-item {
          padding: 16px 18px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: 0.28s ease;
        }

        .faq-question {
          font-weight: 700;
          margin-bottom: 8px;
          font-size: 15px;
          color: rgba(255,255,255,0.88);
        }

        .faq-answer {
          color: rgba(255,255,255,0.62);
          line-height: 1.75;
          font-size: 14px;
        }

        .contact-visual-stage {
          position: relative;
          width: 100%;
          min-height: 340px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(circle at 75% 18%, rgba(255,179,92,0.18), transparent 22%),
            rgba(255,255,255,0.03);
          overflow: hidden;
          isolation: isolate;
        }

        .floating-social {
          position: absolute;
          width: 84px;
          height: 84px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          box-shadow: 0 12px 26px rgba(0,0,0,0.20);
          transition: 0.28s ease;
          z-index: 2;
        }

        .floating-social:hover {
          transform: translateY(-8px) scale(1.04);
          background: linear-gradient(135deg, #ffb35c, #ff8c3a);
          color: #111;
          border-color: rgba(255,179,92,0.28);
          box-shadow: 0 20px 40px rgba(255,179,92,0.22);
        }

        .floating-social-1 {
          left: 20px;
          top: 30px;
          animation: floatY1 3.2s ease-in-out infinite;
        }

        .floating-social-2 {
          left: 110px;
          top: 115px;
          animation: floatY2 3.8s ease-in-out infinite;
        }

        .floating-social-3 {
          right: 20px;
          top: 140px;
          animation: floatY3 3.4s ease-in-out infinite;
        }

        .floating-social-4 {
          right: 118px;
          top: 42px;
          animation: floatY4 4s ease-in-out infinite;
        }

        @keyframes floatY1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes floatY2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(12px); }
        }

        @keyframes floatY3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes floatY4 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }

        .particles-layer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 120px;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
        }

        .particle {
          position: absolute;
          bottom: -8px;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,179,92,0.85);
          box-shadow: 0 0 10px rgba(255,179,92,0.45);
          animation: emberRise linear infinite;
          opacity: 0.8;
        }

        @keyframes emberRise {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(-120px) scale(1.15);
            opacity: 0;
          }
        }

        .particle-1  { left: 6%;  animation-duration: 3.2s; animation-delay: 0.1s; }
        .particle-2  { left: 12%; animation-duration: 4.1s; animation-delay: 0.8s; }
        .particle-3  { left: 18%; animation-duration: 3.8s; animation-delay: 1.2s; }
        .particle-4  { left: 24%; animation-duration: 4.4s; animation-delay: 0.4s; }
        .particle-5  { left: 30%; animation-duration: 3.5s; animation-delay: 1.5s; }
        .particle-6  { left: 36%; animation-duration: 4.3s; animation-delay: 0.6s; }
        .particle-7  { left: 42%; animation-duration: 3.7s; animation-delay: 1.8s; }
        .particle-8  { left: 48%; animation-duration: 4.6s; animation-delay: 0.9s; }
        .particle-9  { left: 54%; animation-duration: 3.4s; animation-delay: 1.1s; }
        .particle-10 { left: 60%; animation-duration: 4.0s; animation-delay: 0.2s; }
        .particle-11 { left: 66%; animation-duration: 3.9s; animation-delay: 1.4s; }
        .particle-12 { left: 72%; animation-duration: 4.5s; animation-delay: 0.7s; }
        .particle-13 { left: 78%; animation-duration: 3.6s; animation-delay: 1.7s; }
        .particle-14 { left: 84%; animation-duration: 4.2s; animation-delay: 0.5s; }
        .particle-15 { left: 88%; animation-duration: 3.3s; animation-delay: 1.0s; }
        .particle-16 { left: 92%; animation-duration: 4.7s; animation-delay: 0.3s; }
        .particle-17 { left: 96%; animation-duration: 3.8s; animation-delay: 1.3s; }
        .particle-18 { left: 50%; animation-duration: 4.9s; animation-delay: 0.6s; }

        @media (max-width: 1080px) {
          .hero-card,
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .hero-left {
            min-height: auto;
          }

          .hero-right {
            padding-top: 0;
          }
        }

        @media (max-width: 720px) {
          .container {
            width: min(1240px, calc(100% - 20px));
          }

          .hero-wrap {
            padding-top: 18px;
            padding-bottom: 20px;
          }

          .hero-card {
            border-radius: 22px;
            gap: 0;
          }

          .hero-left {
            padding: 22px 18px 16px;
          }

          .hero-right {
            padding: 0 18px 18px;
          }

          .hero-visual {
            padding: 16px;
            border-radius: 20px;
          }

          .hero-title {
            font-size: clamp(34px, 11vw, 54px);
            line-height: 0.98;
          }

          .hero-copy,
          .section-copy {
            font-size: 14px;
            line-height: 1.75;
          }

          .section {
            padding-top: 26px;
          }

          .section-title {
            font-size: clamp(26px, 8vw, 34px);
            line-height: 1.08;
          }

          .card {
            padding: 18px;
            border-radius: 18px;
          }

          .contact-item,
          .social-item {
            grid-template-columns: 50px 1fr;
            gap: 12px;
            padding: 14px;
            border-radius: 16px;
          }

          .contact-icon {
            width: 50px;
            height: 50px;
            border-radius: 14px;
          }

          .cta-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .cta-row .btn-primary,
          .cta-row .btn-secondary {
            width: 100%;
          }

          .contact-visual-stage {
            min-height: 300px;
            border-radius: 20px;
          }

          .floating-social {
            width: 72px;
            height: 72px;
            border-radius: 20px;
          }

          .floating-social-1 {
            left: 22px;
            top: 26px;
          }

          .floating-social-2 {
            left: 50%;
            top: 70px;
            transform: translateX(-50%);
            animation: floatCenter1 3.6s ease-in-out infinite;
          }

          .floating-social-3 {
            right: 24px;
            top: 126px;
          }

          .floating-social-4 {
            right: auto;
            left: 50%;
            bottom: 34px;
            top: auto;
            transform: translateX(-50%);
            animation: floatCenter2 3.8s ease-in-out infinite;
          }

          @keyframes floatCenter1 {
            0%, 100% { transform: translateX(-50%) translateY(0px); }
            50% { transform: translateX(-50%) translateY(10px); }
          }

          @keyframes floatCenter2 {
            0%, 100% { transform: translateX(-50%) translateY(0px); }
            50% { transform: translateX(-50%) translateY(-10px); }
          }
        }

        @media (max-width: 480px) {
          .container {
            width: min(1240px, calc(100% - 16px));
          }

          .hero-left {
            padding: 18px 14px 14px;
          }

          .hero-right {
            padding: 0 14px 14px;
          }

          .hero-visual {
            padding: 14px;
            border-radius: 18px;
          }

          .badge {
            font-size: 11px;
            padding: 7px 12px;
          }

          .eyebrow {
            font-size: 13px;
            margin-bottom: 10px;
          }

          .hero-title {
            font-size: clamp(30px, 11vw, 42px);
          }

          .hero-copy,
          .section-copy,
          .contact-value,
          .faq-answer {
            font-size: 13px;
          }

          .card {
            padding: 16px;
          }

          .contact-item,
          .social-item {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }

          .contact-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
          }

          .contact-label {
            font-size: 11px;
          }

          .btn-primary,
          .btn-secondary {
            padding: 12px 16px;
            font-size: 13px;
          }

          .faq-item {
            padding: 14px;
            border-radius: 16px;
          }

          .contact-visual-stage {
            min-height: 270px;
            border-radius: 18px;
          }

          .floating-social {
            width: 62px;
            height: 62px;
            border-radius: 18px;
          }

          .floating-social-1 {
            left: 14px;
            top: 18px;
          }

          .floating-social-2 {
            left: 50%;
            top: 52px;
            transform: translateX(-50%);
          }

          .floating-social-3 {
            right: 14px;
            top: 108px;
          }

          .floating-social-4 {
            left: 50%;
            bottom: 24px;
            transform: translateX(-50%);
          }

          .particles-layer {
            height: 88px;
          }

          .particle {
            width: 5px;
            height: 5px;
          }
        }
      `}</style>

      <section className="hero-wrap">
        <div className="container">
          <div className="hero-card">
            <div className="hero-left">
              <div className="badge-row">
                <span className="badge">Open to Work</span>
                <span className="badge accent">Freelance Friendly</span>
              </div>

              <div className="eyebrow">Contact</div>

              <h1 className="hero-title">
                Let’s build
                <br />
                something strong.
              </h1>

              <p className="hero-copy">
                If your website, interface, or digital presence feels off, you already know it.
                Let’s clean it up.
              </p>
            </div>

            <div className="hero-right">
              <div className="hero-visual">
                <div className="contact-visual-stage">
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="floating-social floating-social-1"
                    title="Instagram"
                  >
                    <FaInstagram size={28} color="#E4405F" />
                  </a>

                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="floating-social floating-social-2"
                    title="LinkedIn"
                  >
                    <FaLinkedinIn size={28} color="#0A66C2" />
                  </a>

                  <a
                    href={xUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="floating-social floating-social-3"
                    title="X"
                  >
                    <FaXTwitter size={28} color="#ffffff" />
                  </a>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="floating-social floating-social-4"
                    title="WhatsApp"
                  >
                    <FaWhatsapp size={28} color="#25D366" />
                  </a>

                  <div className="particles-layer">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <span key={i} className={`particle particle-${i + 1}`} />
                    ))}
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      width: 240,
                      height: 240,
                      right: -30,
                      top: -20,
                      background: "rgba(255,179,92,0.16)",
                      filter: "blur(90px)",
                      pointerEvents: "none",
                      zIndex: 0,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container" style={{ paddingBottom: 50 }}>
        <section className="section">
          <div className="section-label">Contact Details</div>
          <h2 className="section-title">Reach out directly</h2>
          <p className="section-copy">
            Whether it is a portfolio website, business site, UI problem, or product presentation issue, you can reach out here.
          </p>

          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.68)", marginTop: 24 }}>
              Loading contact info...
            </p>
          ) : (
            <div className="contact-grid">
              <div className="card">
                <div className="contact-list">
                  <a className="contact-item" href={`mailto:${email}`}>
                    <div className="contact-icon">
                      <Mail size={22} />
                    </div>
                    <div>
                      <div className="contact-label">Email</div>
                      <div className="contact-value">{email}</div>
                    </div>
                  </a>

                  <a
                    className="contact-item"
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="contact-icon">
                      <Phone size={22} />
                    </div>
                    <div>
                      <div className="contact-label">WhatsApp</div>
                      <div className="contact-value">{whatsapp}</div>
                    </div>
                  </a>

                  <a
                    className="contact-item"
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="contact-icon">
                      <Link2 size={22} />
                    </div>
                    <div>
                      <div className="contact-label">LinkedIn</div>
                      <div className="contact-value">{linkedin}</div>
                    </div>
                  </a>
                </div>

                <div className="cta-row">
                  <a href={`mailto:${email}`} className="btn-primary">
                    Send Email
                  </a>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                  >
                    Open WhatsApp
                  </a>
                </div>
              </div>

              <div className="card">
                <div className="section-label">Socials</div>
                <h2
                  className="section-title"
                  style={{ fontSize: "clamp(28px, 4vw, 38px)" }}
                >
                  Elsewhere online
                </h2>

                <div className="socials-grid">
                  <a className="social-item" href={instagram} target="_blank" rel="noreferrer">
                    <div className="contact-icon">
                      <Camera size={22} />
                    </div>
                    <div>
                      <div className="contact-label">Instagram</div>
                      <div className="contact-value">{instagram}</div>
                    </div>
                  </a>

                  <a className="social-item" href={xUrl} target="_blank" rel="noreferrer">
                    <div className="contact-icon">
                      <AtSign size={22} />
                    </div>
                    <div>
                      <div className="contact-label">X</div>
                      <div className="contact-value">{xUrl}</div>
                    </div>
                  </a>

                  <a className="social-item" href={website} target="_blank" rel="noreferrer">
                    <div className="contact-icon">
                      <Globe size={22} />
                    </div>
                    <div>
                      <div className="contact-label">Website</div>
                      <div className="contact-value">{website}</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="section">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">Before you message</h2>
          <p className="section-copy">
            A few practical notes that make the process easier from the start.
          </p>

          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-question">What should I send first?</div>
              <div className="faq-answer">
                Start with a short message explaining what you need, what type of work it is,
                and if you already have references or rough direction in mind.
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">Do you work on both design and development?</div>
              <div className="faq-answer">
                Yes. Depending on the project, the work can include visual direction,
                UI/UX design, website structure, and frontend implementation.
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">Can I reach out for just design?</div>
              <div className="faq-answer">
                Yes. It does not have to be a full build. You can also reach out for
                design direction, website UI, branding help, or interface structure only.
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">What kind of projects fit best?</div>
              <div className="faq-answer">
                Websites, portfolios, landing pages, dashboards, product interfaces,
                and projects where digital presentation actually matters.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}