import { useEffect, useRef, useState } from "react";

const CONTENT_HEIGHT = 3220;
const EXTRA_BLANK_SPACE = 1200;

const storyBlocks = [
  {
    id: "01",
    title: "I like trees.",
    body: "quiet systems, roots, fungi, shade, and long time scales",
    x: 112,
    y: 456,
    revealAt: 0.03,
  },
  {
    id: "02",
    title: "I like strange stories.",
    body: "hardboiled worlds, odd tenderness, and characters who survive",
    x: 60,
    y: 810,
    revealAt: 0.18,
  },
  {
    id: "03",
    title: "I love coffee with depth.",
    body: "body, aroma, acidity, and tiny emotional weather changes",
    x: 190,
    y: 1125,
    revealAt: 0.327,
  },
  {
    id: "04",
    title: "I like messy data.",
    body: "labels, edge cases, QA, and the human judgment behind datasets",
    x: 185,
    y: 1408,
    revealAt: 0.451,
  },
  {
    id: "05",
    title: "I like robots.",
    body: "especially the boundary between motion, perception, and people",
    x: 72,
    y: 1966,
    width: 112,
    revealAt: 0.636,
  },
  {
    id: "06",
    title: "I like math, even when it hurts.",
    body: "abstraction, structure, and the weird comfort of difficult ideas",
    x: 166,
    y: 2288,
    width: 108,
    revealAt: 0.683,
  },
  {
    id: "07",
    title: "I like people who notice small things.",
    body: "small jokes, tiny design choices, quiet kindness, odd details",
    x: 58,
    y: 2988,
    revealAt: 0.93,
  },
];

const terminals = [
  [195, 292],
  [44, 565],
  [82, 595],
  [279, 648],
  [324, 726],
  [34, 1598],
  [55, 2044],
  [82, 2248],
  [26, 2384],
  [54, 2384],
  [82, 2384],
  [349, 2164],
  [300, 2560],
  [258, 3178],
];

const shortCircuits = [
  { path: "M 90 595 L 190 595 L 273 645", startAt: 0.065, endAt: 0.11 },
  { path: "M 250 1880 L 250 2020 L 353 2150", startAt: 0.64, endAt: 0.85 },
  { path: "M 300 2560 L 330 2650 L 330 3190 L 292 3274", startAt: 0.9, endAt: 0.98 },
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
      viewBox={`0 0 390 ${CONTENT_HEIGHT}`}
      role="img"
      aria-label="A circuit-like path that draws itself while the page scrolls"
    >
      <circle className="intro-signal signal-one" cx="195" cy="292" r="8" />
      <circle className="intro-signal signal-two" cx="195" cy="292" r="8" />
      <g className={`scroll-circuit${hasStarted ? " is-active" : ""}`}>
        <path
          className="circuit-ghost"
          d="M 195 304 L 195 410 L 44 452 L 44 565 L 190 565 L 324 645 L 324 990 L 38 1048 L 38 1550 L 350 1550 L 350 1780 L 250 1780 L 250 1880 L 210 1880 L 210 2030 L 150 2030 L 150 2240 L 115 2330 L 85 2384 L 42 2384 L 42 2190 L 18 2142 L 18 1600 L 34 1600"
        />
        <path
          ref={mainPath}
          className="circuit-line"
          d="M 195 304 L 195 410 L 44 452 L 44 565 L 190 565 L 324 645 L 324 990 L 38 1048 L 38 1550 L 350 1550 L 350 1780 L 250 1780 L 250 1880 L 210 1880 L 210 2030 L 150 2030 L 150 2240 L 115 2330 L 85 2384 L 42 2384 L 42 2190 L 18 2142 L 18 1600 L 34 1600"
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
          <rect className="pillar-body" x="102" y="1084" width="20" height="620" />
          <circle className="pillar-terminal" cx="112" cy="1084" r="6" />
          <circle className="pillar-terminal" cx="112" cy="1704" r="6" />
        </g>
        <g className="chip-block" aria-hidden="true">
          {[1850, 1866, 1882, 1898, 1914].map((y) => (
            <path key={`left-${y}`} className="chip-pin" d={`M 34 ${y} L 56 ${y}`} />
          ))}
          <rect className="chip-body" x="56" y="1838" width="96" height="88" />
          {[1850, 1866, 1882, 1898, 1914].map((y) => (
            <path key={`right-${y}`} className="chip-pin" d={`M 152 ${y} L 174 ${y}`} />
          ))}
        </g>
        <rect className="robot-rail" x="339" y="2150" width="20" height="760" />
        <circle className="rail-terminal top" cx="349" cy="2150" r="6" />
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
        cy="292"
        r="8"
      />
    </svg>
  );
}

export function App() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [stageScale, setStageScale] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const stage = stageRef.current;
      const canvas = canvasRef.current;
      if (!stage || !canvas) return;

      setStageScale(Math.min(1, window.innerWidth / 390));
      const rect = stage.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const end = Math.max(canvasRect.height - viewport, 1);
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
          "--content-height": `${CONTENT_HEIGHT}px`,
          "--frame-height": `${CONTENT_HEIGHT + EXTRA_BLANK_SPACE}px`,
        }}
      >
        <div className="stage-canvas" ref={canvasRef}>
          <p className="kicker">MOBILE / scroll-driven circuit path</p>
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
              key={block.id}
              block={block}
              visible={hasStarted && progress >= block.revealAt}
            />
          ))}
        </div>
        <div className="stage-blank" aria-hidden="true" />
      </section>
    </main>
  );
}
