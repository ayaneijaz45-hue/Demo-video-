import { useCurrentFrame } from "remotion";
import { C } from "../design";

// Original vector art: a visual metaphor for creation, never a claimed AI output.
export const ConceptArt = ({ mode = "image" }: { mode?: string }) => {
  const f = useCurrentFrame();
  return (
    <svg
      viewBox="0 0 800 420"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#18203E" />
          <stop offset="1" stopColor="#42627B" />
        </linearGradient>
        <linearGradient id="sculpt" x1="0" y1="0" x2=".8" y2="1">
          <stop stopColor="#EAF7FC" />
          <stop offset=".35" stopColor="#7EE7FF" />
          <stop offset=".7" stopColor="#8FA7FF" />
          <stop offset="1" stopColor="#233758" />
        </linearGradient>
        <radialGradient id="sun">
          <stop stopColor="#F5F8FB" />
          <stop offset="1" stopColor="#B1C7F9" />
        </radialGradient>
      </defs>
      <rect width="800" height="420" fill="url(#sky)" />
      <circle cx="620" cy="105" r="62" fill="url(#sun)" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={`M -40 ${290 + i * 23} Q 210 ${170 + i * 38} 430 ${300 + i * 17} T 850 ${285 + i * 28}`}
          fill="none"
          stroke={C.violet}
          strokeOpacity={0.1 + i * 0.02}
        />
      ))}
      <ellipse cx="385" cy="352" rx="132" ry="18" fill="#02061744" />
      <g
        transform={`translate(385 215) rotate(${mode === "video" ? Math.sin(f / 28) * 10 : -12})`}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse
            key={i}
            rx={102 - i * 12}
            ry={145 - i * 12}
            fill="none"
            stroke="url(#sculpt)"
            strokeWidth="25"
            transform={`rotate(${i * 32 + (mode === "video" ? f * 0.5 : 0)})`}
          />
        ))}
      </g>
    </svg>
  );
};
