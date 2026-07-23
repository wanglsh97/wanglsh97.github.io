import { useEffect, useRef, useState } from "react";
import "./PolarityGame.css";

type Polarity = "attract" | "repel";
type Phase = "idle" | "playing" | "over";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  kind: "token" | "noise";
  life: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
};

type Ring = {
  x: number;
  y: number;
  r: number;
  max: number;
  life: number;
  color: string;
};

const BEST_KEY = "polarity-swap-best";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function PolarityGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem(BEST_KEY) || 0);
    } catch {
      return 0;
    }
  });
  const [polarity, setPolarity] = useState<Polarity>("attract");
  const [combo, setCombo] = useState(0);

  const stateRef = useRef({
    phase: "idle" as Phase,
    polarity: "attract" as Polarity,
    score: 0,
    combo: 0,
    best,
    pointer: { x: 0, y: 0, active: false },
    player: { x: 0, y: 0, px: 0, py: 0 },
    particles: [] as Particle[],
    sparks: [] as Spark[],
    rings: [] as Ring[],
    spawnTimer: 0,
    shake: 0,
    hp: 3,
    time: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      state.width = rect.width;
      state.height = rect.height;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!state.pointer.active) {
        state.player.x = rect.width * 0.5;
        state.player.y = rect.height * 0.55;
        state.player.px = state.player.x;
        state.player.py = state.player.y;
      }
    };

    const spawn = (forceKind?: Particle["kind"]) => {
      const edge = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;
      if (edge === 0) {
        x = rand(0, state.width);
        y = -20;
      } else if (edge === 1) {
        x = state.width + 20;
        y = rand(0, state.height);
      } else if (edge === 2) {
        x = rand(0, state.width);
        y = state.height + 20;
      } else {
        x = -20;
        y = rand(0, state.height);
      }

      const kind =
        forceKind ?? (Math.random() < 0.62 ? "token" : "noise");
      const speed = rand(18, 42) + state.score * 0.15;
      const angle = Math.atan2(state.player.y - y, state.player.x - x) + rand(-0.4, 0.4);

      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: kind === "token" ? rand(7, 11) : rand(9, 14),
        kind,
        life: 1,
      });
    };

    const burst = (x: number, y: number, hue: number, count = 14) => {
      for (let i = 0; i < count; i++) {
        const a = rand(0, Math.PI * 2);
        const s = rand(40, 180);
        state.sparks.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: rand(0.35, 0.8),
          hue,
        });
      }
      state.rings.push({
        x,
        y,
        r: 4,
        max: rand(48, 90),
        life: 1,
        color: hue > 40 ? "rgba(251,191,36,0.55)" : "rgba(45,212,191,0.5)",
      });
    };

    const startGame = () => {
      state.phase = "playing";
      state.score = 0;
      state.combo = 0;
      state.hp = 3;
      state.particles = [];
      state.sparks = [];
      state.rings = [];
      state.spawnTimer = 0;
      state.time = 0;
      state.polarity = "attract";
      setPhase("playing");
      setScore(0);
      setCombo(0);
      setPolarity("attract");
      for (let i = 0; i < 8; i++) spawn();
    };

    const endGame = () => {
      state.phase = "over";
      setPhase("over");
      if (state.score > state.best) {
        state.best = state.score;
        setBest(state.score);
        try {
          localStorage.setItem(BEST_KEY, String(state.score));
        } catch {
          /* ignore */
        }
      }
    };

    const swapPolarity = () => {
      if (state.phase !== "playing") return;
      state.polarity = state.polarity === "attract" ? "repel" : "attract";
      setPolarity(state.polarity);
      state.rings.push({
        x: state.player.x,
        y: state.player.y,
        r: 8,
        max: 120,
        life: 1,
        color:
          state.polarity === "attract"
            ? "rgba(45,212,191,0.45)"
            : "rgba(251,191,36,0.45)",
      });
    };

    const pointerPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onPointerDown = (e: PointerEvent) => {
      const p = pointerPos(e);
      state.pointer.x = p.x;
      state.pointer.y = p.y;
      state.pointer.active = true;
      if (state.phase === "idle" || state.phase === "over") startGame();
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = pointerPos(e);
      state.pointer.x = p.x;
      state.pointer.y = p.y;
      state.pointer.active = true;
    };

    const onPointerUp = () => {
      /* keep last position */
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (state.phase === "idle" || state.phase === "over") startGame();
        else swapPolarity();
      }
      if (e.key === "Enter" && (state.phase === "idle" || state.phase === "over")) {
        startGame();
      }
    };

    const onSwapClick = (e: Event) => {
      e.stopPropagation();
      if (state.phase === "idle" || state.phase === "over") startGame();
      else swapPolarity();
    };

    const swapBtn = wrap.querySelector("[data-swap]");
    swapBtn?.addEventListener("click", onSwapClick);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", resize);
    resize();

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      state.time += dt;

      const { width: w, height: h } = state;
      const attract = state.polarity === "attract";

      // player follow
      const targetX = state.pointer.active ? state.pointer.x : state.player.x;
      const targetY = state.pointer.active ? state.pointer.y : state.player.y;
      state.player.px = state.player.x;
      state.player.py = state.player.y;
      state.player.x += (targetX - state.player.x) * (1 - Math.exp(-10 * dt));
      state.player.y += (targetY - state.player.y) * (1 - Math.exp(-10 * dt));
      state.player.x = clamp(state.player.x, 24, w - 24);
      state.player.y = clamp(state.player.y, 24, h - 24);

      if (state.phase === "playing") {
        state.spawnTimer -= dt;
        const spawnEvery = Math.max(0.28, 0.85 - state.score * 0.004);
        if (state.spawnTimer <= 0) {
          spawn();
          if (Math.random() < 0.25) spawn("noise");
          state.spawnTimer = spawnEvery;
        }

        for (const p of state.particles) {
          const dx = state.player.x - p.x;
          const dy = state.player.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const nx = dx / dist;
          const ny = dy / dist;

          const forceBase =
            p.kind === "token"
              ? attract
                ? 520
                : -180
              : attract
                ? -120
                : 420;
          const falloff = forceBase / (dist * dist + 1800);
          p.vx += nx * falloff * dt * 60;
          p.vy += ny * falloff * dt * 60;
          p.vx *= 0.992;
          p.vy *= 0.992;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }

        // collisions
        const next: Particle[] = [];
        for (const p of state.particles) {
          const d = Math.hypot(p.x - state.player.x, p.y - state.player.y);
          if (d < p.r + 16) {
            if (p.kind === "token") {
              if (attract) {
                state.combo += 1;
                const gain = 10 + Math.min(40, state.combo * 2);
                state.score += gain;
                setScore(state.score);
                setCombo(state.combo);
                burst(p.x, p.y, 48, 16);
              } else {
                state.combo = 0;
                setCombo(0);
                burst(p.x, p.y, 20, 8);
              }
            } else {
              if (!attract) {
                // repelling into noise hurts less / bounce
                p.vx *= -1.2;
                p.vy *= -1.2;
                p.x += p.vx * dt * 2;
                p.y += p.vy * dt * 2;
                next.push(p);
                continue;
              }
              state.hp -= 1;
              state.combo = 0;
              setCombo(0);
              state.shake = 10;
              burst(p.x, p.y, 0, 20);
              if (state.hp <= 0) endGame();
            }
            continue;
          }

          if (
            p.x < -80 ||
            p.y < -80 ||
            p.x > w + 80 ||
            p.y > h + 80
          ) {
            continue;
          }
          next.push(p);
        }
        state.particles = next;
      }

      // sparks / rings
      state.sparks = state.sparks
        .map((s) => ({
          ...s,
          x: s.x + s.vx * dt,
          y: s.y + s.vy * dt,
          vx: s.vx * 0.96,
          vy: s.vy * 0.96,
          life: s.life - dt,
        }))
        .filter((s) => s.life > 0);

      state.rings = state.rings
        .map((r) => ({
          ...r,
          r: r.r + (r.max - r.r) * (1 - Math.exp(-6 * dt)),
          life: r.life - dt * 1.4,
        }))
        .filter((r) => r.life > 0);

      state.shake = Math.max(0, state.shake - dt * 28);

      // draw
      const sx = state.shake ? rand(-state.shake, state.shake) : 0;
      const sy = state.shake ? rand(-state.shake, state.shake) : 0;
      ctx.save();
      ctx.translate(sx, sy);

      const g = ctx.createRadialGradient(
        state.player.x,
        state.player.y,
        0,
        state.player.x,
        state.player.y,
        Math.max(w, h) * 0.75,
      );
      g.addColorStop(0, attract ? "#14352c" : "#2a2410");
      g.addColorStop(0.45, "#0f1a16");
      g.addColorStop(1, "#070b09");
      ctx.fillStyle = g;
      ctx.fillRect(-20, -20, w + 40, h + 40);

      // subtle grid
      ctx.strokeStyle = "rgba(140,190,170,0.05)";
      ctx.lineWidth = 1;
      const grid = 48;
      const ox = (state.time * 8) % grid;
      for (let x = -grid + ox; x < w + grid; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = -grid + ox * 0.4; y < h + grid; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // field aura
      const aura = ctx.createRadialGradient(
        state.player.x,
        state.player.y,
        10,
        state.player.x,
        state.player.y,
        160,
      );
      if (attract) {
        aura.addColorStop(0, "rgba(45,212,191,0.28)");
        aura.addColorStop(1, "rgba(45,212,191,0)");
      } else {
        aura.addColorStop(0, "rgba(251,191,36,0.26)");
        aura.addColorStop(1, "rgba(251,191,36,0)");
      }
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 160, 0, Math.PI * 2);
      ctx.fill();

      // orbit ring
      ctx.strokeStyle = attract
        ? "rgba(45,212,191,0.35)"
        : "rgba(251,191,36,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(
        state.player.x,
        state.player.y,
        34 + Math.sin(state.time * 4) * 2,
        0,
        Math.PI * 2,
      );
      ctx.stroke();

      // force lines toward/away nearby particles
      ctx.lineWidth = 1;
      for (const p of state.particles) {
        const d = Math.hypot(p.x - state.player.x, p.y - state.player.y);
        if (d > 180) continue;
        const alpha = (1 - d / 180) * 0.35;
        ctx.strokeStyle =
          p.kind === "token"
            ? `rgba(251,191,36,${alpha})`
            : `rgba(251,113,133,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(state.player.x, state.player.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      // particles
      for (const p of state.particles) {
        if (p.kind === "token") {
          ctx.fillStyle = "#fbbf24";
          ctx.shadowColor = "rgba(251,191,36,0.7)";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.r);
          ctx.lineTo(p.x + p.r, p.y);
          ctx.lineTo(p.x, p.y + p.r);
          ctx.lineTo(p.x - p.r, p.y);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "#fb7185";
          ctx.shadowColor = "rgba(251,113,133,0.55)";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "rgba(255,255,255,0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x - p.r * 0.45, p.y - p.r * 0.45);
          ctx.lineTo(p.x + p.r * 0.45, p.y + p.r * 0.45);
          ctx.moveTo(p.x + p.r * 0.45, p.y - p.r * 0.45);
          ctx.lineTo(p.x - p.r * 0.45, p.y + p.r * 0.45);
          ctx.stroke();
        }
      }

      for (const s of state.sparks) {
        ctx.fillStyle = `hsla(${s.hue}, 90%, 65%, ${s.life})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const r of state.rings) {
        ctx.strokeStyle = r.color.replace(
          /[\d.]+\)$/,
          `${Math.max(0, r.life) * 0.55})`,
        );
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // player core
      const core = ctx.createRadialGradient(
        state.player.x - 4,
        state.player.y - 4,
        2,
        state.player.x,
        state.player.y,
        18,
      );
      core.addColorStop(0, "#f4fffb");
      core.addColorStop(0.4, attract ? "#2dd4bf" : "#fbbf24");
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ecfdf8";
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // motion streak
      ctx.strokeStyle = attract
        ? "rgba(45,212,191,0.35)"
        : "rgba(251,191,36,0.35)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(state.player.px, state.player.py);
      ctx.lineTo(state.player.x, state.player.y);
      ctx.stroke();

      // hp pips drawn in canvas top-left of playfield under HUD area
      if (state.phase === "playing") {
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle =
            i < state.hp ? "rgba(236,253,245,0.9)" : "rgba(255,255,255,0.15)";
          ctx.beginPath();
          ctx.arc(28 + i * 18, h - 28, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      swapBtn?.removeEventListener("click", onSwapClick);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="hero" ref={wrapRef} aria-label="Polarity Swap 游戏">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="hero-chrome">
        <div className="hero-top">
          <p className="brand">wangliangsheng</p>
          <div className="hud" aria-live="polite">
            <span>SCORE {score}</span>
            <span>BEST {best}</span>
            {phase === "playing" && combo > 1 ? <span>COMBO ×{combo}</span> : null}
          </div>
        </div>

        <div className="hero-main">
          <h1>Polarity Swap</h1>
          <p className="hero-lede">
            移动指针操控探针。空格 / 按钮切换极性：吸引收集金色信号，排斥推开玫红噪声。
          </p>
        </div>

        <div className="hero-bottom">
          <button type="button" className="swap-btn" data-swap>
            {phase === "playing"
              ? polarity === "attract"
                ? "切换 → 排斥"
                : "切换 → 吸引"
              : phase === "over"
                ? "再来一局"
                : "开始游戏"}
          </button>
          <p className="hint">
            {phase === "playing"
              ? polarity === "attract"
                ? "当前：吸引 · 去吞金色菱形"
                : "当前：排斥 · 躲开噪声或把它推开"
              : phase === "over"
                ? `本局 ${score} 分 · 点击或按空格重开`
                : "点击画面或按空格开始"}
          </p>
          <a className="scroll-about" href="#about">
            关于我
          </a>
        </div>
      </div>
    </section>
  );
}
