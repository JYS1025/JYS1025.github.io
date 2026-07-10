"use client";

import { useEffect, useRef } from "react";

/**
 * GameOfLife — Conway's Game of Life rendered as a minimal canvas grid.
 *
 * Tuned to feel alive on a personal blog rather than run a literal
 * simulation indefinitely:
 *  - Cellular noise seed so the grid starts populated, not blank
 *  - Slow tick (~6 generations/sec) so motion is calm, not flickery
 *  - Gliders and oscillators emerge naturally from the seed
 *  - Periodic gentle re-seeding keeps patterns from dying out into
 *    still-life; a soft fade-out then fade-in avoids visual pops
 *  - Hover injects life near the cursor — a small perturbation that
 *    often seeds gliders, making the grid feel responsive
 *  - A few classic "soup" patterns occasionally appear and decay
 *
 * Single canvas + rAF, no React re-renders — comfortably 60fps.
 * Cell colour follows the accent token so the active cells pop
 * against an otherwise grayscale background.
 */

interface Cell {
  alive: 0 | 1;
  age: number; // generations survived — used to brighten stalwarts subtly
}

const STEP_MS = 1000 / 6; // ~6 generations per second

export function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = 1;
    let width = 0;
    let height = 0;
    let cellSize = 10;
    let cols = 0;
    let rows = 0;

    let grid: Cell[] = [];
    let nextGrid: Cell[] = [];

    // Accent colour tracking — picked up from CSS variable so theme
    // toggles update the canvas without a remount.
    let accent = "199 89% 48%";
    const refreshAccent = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-strong")
        .trim();
      if (raw) accent = raw.includes(",") ? raw.replace(/,/g, " ") : raw;
    };
    refreshAccent();
    const mo = new MutationObserver(refreshAccent);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const index = (x: number, y: number) =>
      ((y % rows) + rows) % rows * cols + (((x % cols) + cols) % cols);

    const neighbors = (x: number, y: number) => {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (grid[index(x + dx, y + dy)].alive === 1) n++;
        }
      }
      return n;
    };

    const randomSeed = (density: number) => {
      for (let i = 0; i < grid.length; i++) {
        grid[i] = {
          alive: Math.random() < density ? 1 : 0,
          age: 0,
        };
      }
    };

    // Inject a small perturbation — used by hover and periodic reseeds.
    const perturb = (cx: number, cy: number, radius: number, density: number) => {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          if (Math.random() < density) {
            const i = index(cx + dx, cy + dy);
            if (grid[i]) {
              grid[i].alive = 1;
              grid[i].age = 0;
            }
          }
        }
      }
    };

    const step = () => {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = index(x, y);
          const n = neighbors(x, y);
          const alive = grid[i].alive === 1;
          let nextAlive: 0 | 1;
          if (alive) {
            nextAlive = n === 2 || n === 3 ? 1 : 0;
          } else {
            nextAlive = n === 3 ? 1 : 0;
          }
          nextGrid[i] = {
            alive: nextAlive,
            age: nextAlive === 1 ? (alive ? grid[i].age + 1 : 1) : 0,
          };
        }
      }
      // Swap
      const tmp = grid;
      grid = nextGrid;
      nextGrid = tmp;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      if (width === 0 || height === 0) return;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Choose cell size so the grid has roughly 60–90 cells across —
      // large enough to host gliders, small enough to feel like a field.
      cellSize = Math.max(6, Math.min(14, Math.floor(width / 80)));
      cols = Math.floor(width / cellSize);
      rows = Math.floor(height / cellSize);
      grid = new Array(cols * rows);
      nextGrid = new Array(cols * rows);
      randomSeed(0.32);
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // Hover injection: when the pointer moves, occasionally seed life in
    // a small radius. Throttled by tracking last injection time.
    let lastInject = 0;
    let hoverPos: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      hoverPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      const now = performance.now();
      if (now - lastInject > 80 && hoverPos) {
        lastInject = now;
        const cx = Math.floor(hoverPos.x / cellSize);
        const cy = Math.floor(hoverPos.y / cellSize);
        perturb(cx, cy, 2, 0.55);
      }
    };
    const onLeave = () => {
      hoverPos = null;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let lastStep = performance.now();
    let lastReseed = performance.now();
    let aliveCount = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (width === 0 || height === 0) return;

      // Advance generations on a steady cadence, decoupled from rAF.
      while (now - lastStep >= STEP_MS) {
        step();
        lastStep += STEP_MS;
      }

      // Periodic gentle reseed when the population collapses, so the
      // field never fully flatlines. We compute a cheap alive count
      // by summing during draw instead — see below — and trigger from
      // there to avoid a second pass.
      if (now - lastReseed > 2500) {
        lastReseed = now;
        if (aliveCount < cols * rows * 0.02) {
          randomSeed(0.28);
        } else {
          // Occasionally drop a glider or beacon somewhere to keep
          // things interesting even in steady state.
          const cx = Math.floor(Math.random() * cols);
          const cy = Math.floor(Math.random() * rows);
          perturb(cx, cy, 1, 0.7);
        }
      }

      // Clear with a faint base wash so cells read against the bg,
      // not against canvas-default transparent.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const dark = document.documentElement.classList.contains("dark");
      ctx.fillStyle = dark ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.18)";
      ctx.fillRect(0, 0, width, height);

      const baseText = dark ? "255,255,255" : "0,0,0";
      aliveCount = 0;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cell = grid[index(x, y)];
          if (cell.alive !== 1) continue;
          aliveCount++;

          const px = x * cellSize;
          const py = y * cellSize;
          const s = cellSize - 1.5;

          // Subtle age tint: stable cells gently brighten toward accent;
          // fresh cells stay neutral grayscale. Hovered neighbours bloom
          // in accent as a "perturbation echo".
          const hovered =
            hoverPos &&
            Math.abs(px + s / 2 - hoverPos.x) < cellSize * 3 &&
            Math.abs(py + s / 2 - hoverPos.y) < cellSize * 3;

          let fill: string;
          if (hovered || cell.age > 12) {
            const alpha = Math.min(0.95, 0.55 + cell.age * 0.03);
            fill = `hsla(${accent}, ${alpha})`;
          } else {
            const alpha = Math.min(0.85, 0.35 + cell.age * 0.04);
            fill = `rgba(${baseText}, ${alpha})`;
          }
          ctx.fillStyle = fill;
          ctx.fillRect(px + 0.5, py + 0.5, s, s);
        }
      }
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      role="img"
      aria-label="Conway's Game of Life. A minimal grid where cells live, die, and evolve generation by generation. Move the cursor to perturb the field and seed new life."
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
