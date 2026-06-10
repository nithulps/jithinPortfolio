export default function Loading() {
  const cases = [
    "Initializing test suite",
    "Running unit tests",
    "Executing integration tests",
    "Validating UI components",
    "All tests passed",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: 14,
        }}
      >
        {cases.map((label, i) => {
          const isFinal = i === cases.length - 1;
          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: 0,
                animation: `caseIn 0.4s ease forwards`,
                animationDelay: `${i * 0.55}s`,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="check"
                  style={{
                    color: isFinal ? "#22c55e" : "var(--cyan)",
                    opacity: 0,
                    animation: `checkPop 0.3s ease forwards`,
                    animationDelay: `${i * 0.55 + 0.25}s`,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              </span>
              <span
                style={{
                  color: isFinal ? "#22c55e" : "rgba(255,255,255,0.85)",
                  fontWeight: isFinal ? 700 : 400,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          width: 240,
          height: 4,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          marginTop: 6,
        }}
      >
        <div
          style={{
            height: "100%",
            background: "var(--cyan)",
            boxShadow: "0 0 10px var(--cyan)",
            animation: "testBar 2.75s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes caseIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkPop {
          0%   { opacity: 0; transform: scale(0.4); }
          60%  { opacity: 1; transform: scale(1.25); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes testBar {
          0%   { width: 0%; }
          70%  { width: 100%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
