import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 24px",
        gap: 18,
      }}
    >
      <div style={{ position: "relative" }}>
        <h1
          className="nf-glitch"
          data-text="404"
          style={{
            fontFamily: "var(--font-wide)",
            fontSize: "8rem",
            lineHeight: 1,
            fontWeight: 800,
            color: "var(--cyan)",
            textShadow: "0 0 40px rgba(0,222,255,0.3)",
            margin: 0,
          }}
        >
          404
        </h1>
      </div>

      <p
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: "0.95rem",
          color: "#ef4444",
        }}
      >
        <span style={{ fontWeight: 700 }}>✗ Test failed:</span> route not found
        <span className="nf-cursor">_</span>
      </p>

      <p
        style={{ color: "var(--text-gray)", fontSize: "1.15rem", maxWidth: 460 }}
      >
        This page took a wrong turn. Let&apos;s get you back on track.
      </p>

      <div className="nf-walk-stage" aria-hidden="true">
        <div className="nf-walker">
          <svg
            viewBox="0 0 100 150"
            width="90"
            height="135"
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="4"
            strokeLinecap="round"
          >
            {/* whole body bobs + leans forward (sad slump) */}
            <g className="nf-body">
              {/* head, drooped down */}
              <circle cx="50" cy="34" r="12" />
              {/* sad eyes + frown */}
              <circle cx="46" cy="35" r="1.4" fill="var(--cyan)" stroke="none" />
              <circle cx="54" cy="35" r="1.4" fill="var(--cyan)" stroke="none" />
              <path d="M45 42 Q50 38 55 42" strokeWidth="2.5" />
              {/* spine, slightly hunched */}
              <line x1="50" y1="46" x2="50" y2="92" />
              {/* arms hang from shoulder (50,52) */}
              <g className="nf-arm-back">
                <line x1="50" y1="52" x2="50" y2="86" />
              </g>
              <g className="nf-arm-front">
                <line x1="50" y1="52" x2="50" y2="86" />
              </g>
            </g>
            {/* legs swing from hip (50,92) */}
            <g className="nf-leg-back">
              <line x1="50" y1="92" x2="50" y2="134" />
            </g>
            <g className="nf-leg-front">
              <line x1="50" y1="92" x2="50" y2="134" />
            </g>
          </svg>
        </div>
      </div>

      <Link href="/" className="btn-hero">
        Back to home
      </Link>

      <style>{`
        .nf-glitch {
          position: relative;
          animation: nfFlicker 4s infinite;
        }
        .nf-glitch::before,
        .nf-glitch::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: var(--cyan);
        }
        .nf-glitch::before {
          animation: nfGlitchA 3s infinite linear alternate;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          opacity: 0.8;
          color: #ef4444;
        }
        .nf-glitch::after {
          animation: nfGlitchB 2.4s infinite linear alternate;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          opacity: 0.7;
        }
        @keyframes nfGlitchA {
          0%   { transform: translate(0, 0); }
          20%  { transform: translate(-3px, 1px); }
          40%  { transform: translate(2px, -1px); }
          60%  { transform: translate(-2px, 2px); }
          80%  { transform: translate(3px, -2px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes nfGlitchB {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(2px, -1px); }
          50%  { transform: translate(-3px, 1px); }
          75%  { transform: translate(2px, 2px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes nfFlicker {
          0%, 92%, 100% { opacity: 1; }
          93%   { opacity: 0.4; }
          94%   { opacity: 1; }
          96%   { opacity: 0.6; }
          97%   { opacity: 1; }
        }
        .nf-cursor {
          display: inline-block;
          margin-left: 2px;
          animation: nfBlink 1s steps(1) infinite;
        }
        @keyframes nfBlink {
          50% { opacity: 0; }
        }

        /* --- sad walk --- */
        .nf-walk-stage {
          width: 100%;
          max-width: 520px;
          height: 150px;
          overflow: hidden;
          position: relative;
          opacity: 0.9;
        }
        .nf-walker {
          position: absolute;
          bottom: 0;
          left: 0;
          /* trudge slowly across, then loop */
          animation: nfWalkAcross 12s linear infinite;
        }
        .nf-walker svg {
          /* slumped forward posture */
          transform: rotate(4deg);
        }
        .nf-body {
          transform-box: view-box;
          transform-origin: 50px 92px;
          animation: nfBob 1.2s ease-in-out infinite;
        }
        .nf-arm-back, .nf-arm-front {
          transform-box: view-box;
          transform-origin: 50px 52px;
        }
        .nf-leg-back, .nf-leg-front {
          transform-box: view-box;
          transform-origin: 50px 92px;
        }
        /* limited swing range = heavy, tired gait */
        .nf-arm-front { animation: nfArmFront 1.2s ease-in-out infinite; }
        .nf-arm-back  { animation: nfArmBack  1.2s ease-in-out infinite; }
        .nf-leg-front { animation: nfLegFront 1.2s ease-in-out infinite; }
        .nf-leg-back  { animation: nfLegBack  1.2s ease-in-out infinite; }

        @keyframes nfWalkAcross {
          0%   { transform: translateX(-100px); }
          100% { transform: translateX(520px); }
        }
        @keyframes nfBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(3px); }
        }
        @keyframes nfLegFront {
          0%, 100% { transform: rotate(16deg); }
          50%      { transform: rotate(-16deg); }
        }
        @keyframes nfLegBack {
          0%, 100% { transform: rotate(-16deg); }
          50%      { transform: rotate(16deg); }
        }
        @keyframes nfArmFront {
          0%, 100% { transform: rotate(-10deg); }
          50%      { transform: rotate(10deg); }
        }
        @keyframes nfArmBack {
          0%, 100% { transform: rotate(10deg); }
          50%      { transform: rotate(-10deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-walker, .nf-body,
          .nf-arm-back, .nf-arm-front,
          .nf-leg-back, .nf-leg-front { animation: none; }
        }
      `}</style>
    </main>
  );
}
