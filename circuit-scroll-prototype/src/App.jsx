import React, { useEffect, useRef, useState } from "react";

const STAGE_WIDTH = 390;
const CONTENT_HEIGHT = 7200;
const EXTRA_BLANK_SPACE = 1200;

const storyBlocks = [
  {
    id: "01",
    title: "I like trees.",
    body: "quiet systems, roots, fungi, shade, and long time scales",
    x: 92,
    y: 1000,
    width: 285,
    revealAt: 0.04,
  },
  {
    id: "02",
    title: "I like strange stories.",
    body: "hardboiled worlds, odd tenderness, and characters who survive",
    x: 48,
    y: 2100,
    width: 320,
    revealAt: 0.24,
  },
  {
    id: "03",
    title: "I love coffee with depth.",
    body: "body, aroma, acidity, and tiny emotional weather changes",
    x: 142,
    y: 2920,
    width: 235,
    revealAt: 0.43,
  },
  {
    id: "04",
    title: "I like messy data.",
    body: "labels, edge cases, QA, and the human judgment behind datasets",
    x: 138,
    y: 3540,
    width: 245,
    revealAt: 0.39,
  },
  {
    id: "05",
    title: "I like robots.",
    body: "especially the boundary between motion, perception, and people",
    x: 62,
    y: 4400,
    width: 255,
    revealAt: 0.67,
  },
  {
    id: "06",
    title: "I like math, even when it hurts.",
    body: "abstraction, structure, and the weird comfort of difficult ideas",
    x: 128,
    y: 5140,
    width: 255,
    revealAt: 0.75,
  },
  {
    key: "07-copy",
    id: "07",
    title: "I like people who notice small things.",
    body: "small jokes, tiny design choices, quiet kindness, odd details",
    x: 54,
    y: 5850,
    width: 315,
    revealAt: 0.88,
  },
  {
    id: "07",
    title: "I like people who notice small things.",
    body: "small jokes, tiny design choices, quiet kindness, odd details",
    x: 54,
    y: 6620,
    width: 315,
    revealAt: 0.95,
  },
];

const terminals = [
  [195, 390],
  [44, 1490],
  [82, 1528],
  [279, 1600],
  [324, 2500],
  [34, 3660],
  [55, 5010],
  [82, 5390],
  [26, 5600],
  [54, 5600],
  [82, 5600],
  [300, 5920],
  [258, 6900],
  [300, 7040],
];

const shortCircuits = [
  { path: "M 90 1528 L 190 1528 L 273 1596", startAt: 0.09, endAt: 0.15 },
  { path: "M 304 4720 L 304 4980 L 353 5260", startAt: 0.67, endAt: 0.86 },
  { path: "M 300 5920 L 330 6060 L 330 6920 L 292 7100", startAt: 0.9, endAt: 0.98 },
];

function StoryBlock({ block, visible }) {
  return (
    <article
      className={`story-block${visible ? " is-visible" : ""}`}
      style={{ left: block.x, top: block.y, width: block.width ?? 205 }}
    >
      <span className="story-index">{block.id}</span>
      <h2>{block.title}</h2>
      <p>{block.body}</p>
    </article>
  );
}

function usePathLength() {
  const ref = useRef(null);
  const [length, setLength] = useState(1);

  useEffect(() => {
    if (ref.current) {
      setLength(ref.current.getTotalLength());
    }
  }, []);

  return [ref, length];
}

function CircuitBranch({ branch, progress, index }) {
  const [pathRef, length] = usePathLength();
  const localProgress = Math.min(
    Math.max((progress - branch.startAt) / (branch.endAt - branch.startAt), 0),
    1,
  );

  return (
    <path
      ref={pathRef}
      className="branch-line"
      d={branch.path}
      style={{
        "--delay": `${0.18 + index * 0.12}s`,
        opacity: localProgress > 0 ? undefined : 0,
        strokeDasharray: length,
        strokeDashoffset: length - length * localProgress,
      }}
    />
  );
}

function CircuitPath({ progress, hasStarted }) {
  const [mainPath, length] = usePathLength();
  const dashOffset = length - length * progress;

  return (
    <svg
      className="circuit"
      viewBox={`0 0 ${STAGE_WIDTH} ${CONTENT_HEIGHT}`}
      role="img"
      aria-label="A circuit-like path that draws itself while the page scrolls"
    >
      <circle className="intro-signal signal-one" cx="195" cy="390" r="8" />
      <circle className="intro-signal signal-two" cx="195" cy="390" r="8" />
      <g className={`scroll-circuit${hasStarted ? " is-active" : ""}`}>
        <path
          className="circuit-ghost"
          d="M 195 402 L 195 860 L 44 930 L 44 1490 L 190 1490 L 324 1596 L 324 2500 L 38 2605 L 38 3480 L 350 3480 L 350 4550 L 304 4550 L 304 4930 L 282 4930 L 282 5260 L 225 5260 L 188 5450 L 115 5560 L 85 5600 L 42 5600 L 42 5280 L 18 5200 L 18 3600 L 34 3600"
        />
        <path
          ref={mainPath}
          className="circuit-line"
          d="M 195 402 L 195 860 L 44 930 L 44 1490 L 190 1490 L 324 1596 L 324 2500 L 38 2605 L 38 3480 L 350 3480 L 350 4550 L 304 4550 L 304 4930 L 282 4930 L 282 5260 L 225 5260 L 188 5450 L 115 5560 L 85 5600 L 42 5600 L 42 5280 L 18 5200 L 18 3600 L 34 3600"
          style={{
            strokeDasharray: length,
            strokeDashoffset: dashOffset,
          }}
        />
        {shortCircuits.map((branch, index) => (
          <CircuitBranch
            key={branch.path}
            branch={branch}
            progress={progress}
            index={index}
          />
        ))}
        <g className="pillar-chip" aria-hidden="true">
          <rect className="pillar-body" x="55" y="2780" width="20" height="1180" />
          <circle className="pillar-terminal" cx="65" cy="2780" r="6" />
          <circle className="pillar-terminal" cx="65" cy="3960" r="6" />
        </g>
        <g className="chip-block" aria-hidden="true">
          {[4250, 4282, 4314, 4346, 4378].map((y) => (
            <path key={`left-${y}`} className="chip-pin" d={`M 34 ${y} L 56 ${y}`} />
          ))}
          <rect className="chip-body" x="56" y="4218" width="116" height="192" />
          {[4250, 4282, 4314, 4346, 4378].map((y) => (
            <path key={`right-${y}`} className="chip-pin" d={`M 152 ${y} L 174 ${y}`} />
          ))}
        </g>
        <rect className="robot-rail" x="339" y="5260" width="20" height="1520" />
        {terminals.slice(1).map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}-${index}`}
            className="terminal"
            cx={cx}
            cy={cy}
            r={cx === 300 && cy === 2560 ? 6 : 5}
          />
        ))}
      </g>
      <circle
        className={`intro-terminal${hasStarted ? " is-connected" : ""}`}
        cx="195"
        cy="390"
        r="8"
      />
    </svg>
  );
}

export function App() {
  const stageRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [stageScale, setStageScale] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const stage = stageRef.current;
      if (!stage) return;

      const nextScale = Math.min(1, window.innerWidth / STAGE_WIDTH);
      setStageScale(nextScale);
      const rect = stage.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const end = Math.max(CONTENT_HEIGHT * nextScale - viewport, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), end);
      setHasStarted(scrolled > 2);
      setProgress(end <= 0 ? 1 : scrolled / end);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <main className="page-shell">
      <section
        className={`prototype-frame${hasStarted ? " has-started" : ""}`}
        ref={stageRef}
        style={{
          "--stage-scale": stageScale,
          width: `${STAGE_WIDTH * stageScale}px`,
          height: `${(CONTENT_HEIGHT + EXTRA_BLANK_SPACE) * stageScale}px`,
        }}
      >
        <div className="stage-canvas">
          <h1>
            wanna
            <br />
            know
            <br />
            me?
          </h1>
          <CircuitPath progress={progress} hasStarted={hasStarted} />
          {storyBlocks.map((block) => (
            <StoryBlock
              key={block.key ?? block.id}
              block={block}
              visible={hasStarted && progress >= block.revealAt}
            />
          ))}
        </div>
        <p className="end-marker">여기가 끝</p>
      </section>
    </main>
  );
}
