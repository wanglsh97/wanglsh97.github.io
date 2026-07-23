import { useCallback, useEffect, useRef, useState } from "react";
import "./QuietRunGame.css";

type Phase = "idle" | "playing" | "over" | "won";

type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  word: string;
};

const GAME_SECONDS = 30;
const BEST_KEY = "quiet-run-best";
const WORDS = ["返工", "噪声", "失焦", "延迟", "BUG", "打断"];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY) || 0);
  } catch {
    return 0;
  }
}

export function QuietRunGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<() => void>(() => undefined);
  const phaseRef = useRef<Phase>("idle");
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [best, setBest] = useState(readBest);

  const startGame = useCallback(() => startRef.current(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let uiTimer = 0;
    let width = 0;
    let height = 0;
    let elapsed = 0;
    let spawnTimer = 0;
    let flash = 0;
    let obstacles: Obstacle[] = [];
    const keys = new Set<string>();
    const player = { x: 72, y: 180, size: 11 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      player.x = clamp(player.x, 26, Math.max(26, width - 26));
      player.y = clamp(player.y, 26, Math.max(26, height - 26));
    };

    const saveBest = (score: number) => {
      const nextBest = Math.max(readBest(), Math.floor(score));
      setBest(nextBest);
      try {
        localStorage.setItem(BEST_KEY, String(nextBest));
      } catch {
        // The game remains playable when storage is unavailable.
      }
    };

    const finish = (nextPhase: "over" | "won") => {
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
      setSeconds(Math.min(GAME_SECONDS, Math.floor(elapsed)));
      saveBest(elapsed);
      keys.clear();
    };

    const start = () => {
      elapsed = 0;
      spawnTimer = 0.5;
      flash = 0;
      obstacles = [];
      player.x = Math.max(48, width * 0.16);
      player.y = height * 0.5;
      phaseRef.current = "playing";
      setPhase("playing");
      setSeconds(0);
      frame.focus();
    };
    startRef.current = start;

    const spawn = () => {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      const fontSize = width < 520 ? 12 : 13;
      ctx.font = `600 ${fontSize}px "SFMono-Regular", Consolas, monospace`;
      const obstacleWidth = ctx.measureText(word).width + 22;
      const obstacleHeight = 30;
      obstacles.push({
        x: width + obstacleWidth,
        y: 30 + Math.random() * Math.max(20, height - 60),
        width: obstacleWidth,
        height: obstacleHeight,
        speed: 88 + Math.random() * 48 + elapsed * 1.25,
        word,
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const movementKey = [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "w",
        "a",
        "s",
        "d",
      ].includes(key);

      if (phaseRef.current === "playing" && movementKey) {
        event.preventDefault();
        keys.add(key);
      }
      if (event.key === "Enter" && phaseRef.current !== "playing") {
        event.preventDefault();
        start();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keys.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", resize);
    resize();

    const draw = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      if (phaseRef.current === "playing") {
        elapsed += dt;
        uiTimer += dt;

        if (uiTimer >= 0.12) {
          setSeconds(Math.min(GAME_SECONDS, Math.floor(elapsed)));
          uiTimer = 0;
        }

        const dx =
          (keys.has("arrowright") || keys.has("d") ? 1 : 0) -
          (keys.has("arrowleft") || keys.has("a") ? 1 : 0);
        const dy =
          (keys.has("arrowdown") || keys.has("s") ? 1 : 0) -
          (keys.has("arrowup") || keys.has("w") ? 1 : 0);
        const length = Math.hypot(dx, dy) || 1;
        const playerSpeed = width < 520 ? 190 : 230;
        player.x = clamp(player.x + (dx / length) * playerSpeed * dt, 20, width - 20);
        player.y = clamp(player.y + (dy / length) * playerSpeed * dt, 20, height - 20);

        spawnTimer -= dt;
        if (spawnTimer <= 0) {
          spawn();
          spawnTimer = Math.max(0.45, 0.92 - elapsed * 0.012);
        }

        for (const obstacle of obstacles) {
          obstacle.x -= obstacle.speed * dt;
        }
        obstacles = obstacles.filter((obstacle) => obstacle.x > -obstacle.width);

        const hit = obstacles.some((obstacle) => {
          const left = obstacle.x - obstacle.width / 2;
          const right = obstacle.x + obstacle.width / 2;
          const top = obstacle.y - obstacle.height / 2;
          const bottom = obstacle.y + obstacle.height / 2;
          return (
            player.x + player.size > left &&
            player.x - player.size < right &&
            player.y + player.size > top &&
            player.y - player.size < bottom
          );
        });

        if (hit) {
          flash = 1;
          finish("over");
        } else if (elapsed >= GAME_SECONDS) {
          finish("won");
        }
      }

      flash = Math.max(0, flash - dt * 2.8);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = flash > 0 ? `rgba(208, 93, 69, ${0.08 * flash})` : "#e8ece8";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(35, 45, 40, 0.09)";
      ctx.lineWidth = 1;
      const lineGap = 34;
      for (let y = lineGap; y < height; y += lineGap) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(63, 77, 70, 0.16)";
      ctx.font = '500 10px "SFMono-Regular", Consolas, monospace';
      ctx.textAlign = "right";
      ctx.fillText("30 秒专注区", width - 16, 18);

      for (const obstacle of obstacles) {
        ctx.fillStyle = "#d9dfda";
        ctx.strokeStyle = "rgba(108, 123, 115, 0.32)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(
          obstacle.x - obstacle.width / 2,
          obstacle.y - obstacle.height / 2,
          obstacle.width,
          obstacle.height,
          4,
        );
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#68776f";
        ctx.font = '600 12px "SFMono-Regular", Consolas, monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(obstacle.word, obstacle.x, obstacle.y + 0.5);
      }

      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.fillStyle = "#1f2c26";
      ctx.beginPath();
      ctx.moveTo(-9, -11);
      ctx.lineTo(12, 0);
      ctx.lineTo(-9, 11);
      ctx.lineTo(-3, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#d05d45";
      ctx.fillRect(-15, -2, 7, 4);
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const status =
    phase === "playing"
      ? `${GAME_SECONDS - seconds} 秒`
      : phase === "won"
        ? "抵达"
        : phase === "over"
          ? "被打断"
          : "待出发";

  return (
    <section className="game-shell" aria-labelledby="game-title">
      <div className="game-heading">
        <div>
          <p className="game-index">开场实验 · 01</p>
          <h2 id="game-title">静默航线</h2>
        </div>
        <div className="game-stat" aria-live="polite">
          <span>{status}</span>
          <small>最佳 {best}s</small>
        </div>
      </div>

      <div
        className="game-frame"
        ref={frameRef}
        tabIndex={0}
        aria-label="静默航线游戏区域"
      >
        <canvas ref={canvasRef} className="game-canvas">
          使用方向键或 WASD 移动光标，避开屏幕中的文字障碍。
        </canvas>

        {phase !== "playing" ? (
          <div className="game-overlay">
            <p>{phase === "won" ? "你保住了 30 秒专注。" : phase === "over" ? `坚持了 ${seconds} 秒。` : "从干扰之间穿过去。"}</p>
            <button type="button" onClick={startGame}>
              {phase === "idle" ? "开始 30 秒" : "再试一次"}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        ) : null}

      </div>

      <div className="game-caption">
        <p>方向键 / WASD 移动。避开干扰，坚持 30 秒。</p>
        <a href="#profile">跳过游戏，直接看我是谁</a>
      </div>
    </section>
  );
}
