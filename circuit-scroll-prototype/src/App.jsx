import React, { useEffect, useRef, useState } from "react";

const STAGE_WIDTH = 390;
const CONTENT_HEIGHT = 4480;
const EXTRA_BLANK_SPACE = 1200;

const storyBlocks = [
  {
    id: "01",
    title: "I like trees.",
    body: "quiet systems, roots, fungi, shade, and long time scales",
    x: 108,
    y: 540,
    width: 250,
    revealAt: 0.03,
  },
  {
    id: "02",
    title: "I like strange stories.",
    body: "hardboiled worlds, odd tenderness, and characters who survive",
    x: 58,
    y: 1383,
    width: 280,
    revealAt: 0.22,
  },
  {
    id: "03",
    title: "I love coffee with depth.",
    body: "body, aroma, acidity, and tiny emotional weather changes",
    x: 166,
    y: 1697,
    width: 210,
    revealAt: 0.38,
  },
  {
    id: "04",
    title: "I like messy data.",
    body: "labels, edge cases, QA, and the human judgment behind datasets",
    x: 158,
    y: 1979,
    width: 220,
    revealAt: 0.32,
  },
  {
    id: "05",
    title: "I like robots.",
    body: "especially the boundary between motion, perception, and people",
    x: 72,
    y: 2429,
    width: 185,
    revealAt: 0.67,
  },
  {
    id: "06",
    title: "I like math, even when it hurts.",
    body: "abstraction, structure, and the weird comfort of difficult ideas",
    x: 154,
    y: 2857,
    width: 174,
    revealAt: 0.72,
  },
  {
    key: "07-copy",
    id: "07",
    title: "I like people who notice small things.",
    body: "small jokes, tiny design choices, quiet kindness, odd details",
    x: 62,
    y: 3181,
    width: 225,
    revealAt: 0.88,
  },
  {
    id: "07",
    title: "I like people who notice small things.",
    body: "small jokes, tiny design choices, quiet kindness, odd details",
    x: 62,
    y: 3721,
    width: 250,
    revealAt: 0.95,
  },
];

const terminals = [
  [195, 380],
  [44, 881],
  [82, 911],
  [279, 964],
  [324, 1216],
  [34, 2079],
  [55, 2845],
  [82, 3049],
  [26, 3185],
  [54, 3185],
  [82, 3185],
  [300, 3361],
  [258, 3979],
  [300, 4061],
];

const shortCircuits = [
  { path: "M 90 911 L 190 911 L 273 961", startAt: 0.085, endAt: 0.14 },
  { path: "M 304 2681 L 304 2821 L 353 2951", startAt: 0.67, endAt: 0.86 },
  { path: "M 300 3361 L 330 3451 L 330 3991 L 292 4075", startAt: 0.9, endAt: 0.98 },
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
      <circle className="intro-signal signal-one" cx="195" cy="380" r="8" />
      <circle className="intro-signal signal-two" cx="195" cy="380" r="8" />
      <g className={`scroll-circuit${hasStarted ? " is-active" : ""}`}>
        <path
          className="circuit-ghost"
          d="M 195 392 L 195 500 L 44 542 L 44 881 L 190 881 L 324 961 L 324 1471 L 38 1529 L 38 2031 L 350 2031 L 350 2581 L 304 2581 L 304 2761 L 282 2761 L 282 2939 L 225 2939 L 188 3041 L 115 3131 L 85 3185 L 42 3185 L 42 2991 L 18 2943 L 18 2081 L 34 2081"
        />
        <path
          ref={mainPath}
          className="circuit-line"
          d="M 195 392 L 195 500 L 44 542 L 44 881 L 190 881 L 324 961 L 324 1471 L 38 1529 L 38 2031 L 350 2031 L 350 2581 L 304 2581 L 304 2761 L 282 2761 L 282 2939 L 225 2939 L 188 3041 L 115 3131 L 85 3185 L 42 3185 L 42 2991 L 18 2943 L 18 2081 L 34 2081"
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
          <rect className="pillar-body" x="55" y="1565" width="20" height="620" />
          <circle className="pillar-terminal" cx="65" cy="1565" r="6" />
          <circle className="pillar-terminal" cx="65" cy="2185" r="6" />
        </g>
        <g className="chip-block" aria-hidden="true">
          {[2331, 2347, 2363, 2379, 2395].map((y) => (
            <path key={`left-${y}`} className="chip-pin" d={`M 34 ${y} L 56 ${y}`} />
          ))}
          <rect className="chip-body" x="56" y="2319" width="96" height="88" />
          {[2331, 2347, 2363, 2379, 2395].map((y) => (
            <path key={`right-${y}`} className="chip-pin" d={`M 152 ${y} L 174 ${y}`} />
          ))}
        </g>
        <rect className="robot-rail" x="339" y="2951" width="20" height="760" />
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
        cy="380"
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
