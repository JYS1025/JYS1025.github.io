"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";

// --- Math Utilities ---
const M3 = {
  rot: (yaw: number, pitch: number) => {
    const cy = Math.cos(yaw),
      sy = Math.sin(yaw);
    const cp = Math.cos(pitch),
      sp = Math.sin(pitch);
    return [
      [cy, 0, sy],
      [sp * sy, cp, -sp * cy],
      [-cp * sy, sp, cp * cy],
    ];
  },
  apply: (m: number[][], v: number[]) => [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ],
  project: (v: number[], scale: number, cx: number, cy: number) => {
    // Orthographic projection
    return { x: cx + v[0] * scale, y: cy - v[1] * scale, z: v[2] };
  },
  dist3D: (a: number[], b: number[]) => {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },
};

// --- Data Generation ---
type Node3D = { id: string; pos: number[]; layer: 1 | 2; label?: string; dataVal?: string };
type Edge3D = { a: string; b: string; type: "s1" | "s2" | "cross" };

function generateData() {
  const nodes: Node3D[] = [];
  const edges: Edge3D[] = [];

  // System 2 (Outer Cage - Logic & Structure)
  // Icosahedron vertices scaled to radius
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawS2 = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ];

  const R2 = 1.05;
  rawS2.forEach((v, i) => {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    nodes.push({
      id: `s2-${i}`,
      pos: [(v[0] / len) * R2, (v[1] / len) * R2, (v[2] / len) * R2],
      layer: 2,
      label: `SYS2:N${i}`,
      dataVal: (Math.random() * 90).toFixed(1)
    });
  });

  // System 2 Edges (connect vertices of icosahedron)
  const s2Nodes = nodes.filter(n => n.layer === 2);
  for (let i = 0; i < s2Nodes.length; i++) {
    for (let j = i + 1; j < s2Nodes.length; j++) {
      if (M3.dist3D(s2Nodes[i].pos, s2Nodes[j].pos) < R2 * 1.1) {
        edges.push({ a: s2Nodes[i].id, b: s2Nodes[j].id, type: "s2" });
      }
    }
  }

  // System 1 (Inner Core - Chaos & Intuition)
  // Random points within a smaller sphere
  const R1 = 0.7;
  const S1_COUNT = 70;
  for (let i = 0; i < S1_COUNT; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const p = Math.acos(2 * Math.random() - 1);
    const r = Math.cbrt(Math.random()) * R1;
    nodes.push({
      id: `s1-${i}`,
      pos: [
        r * Math.sin(p) * Math.cos(theta),
        r * Math.sin(p) * Math.sin(theta),
        r * Math.cos(p),
      ],
      layer: 1,
    });
  }

  // System 1 Edges (Connect close neighbors)
  const s1Nodes = nodes.filter(n => n.layer === 1);
  for (let i = 0; i < s1Nodes.length; i++) {
    for (let j = i + 1; j < s1Nodes.length; j++) {
      if (M3.dist3D(s1Nodes[i].pos, s1Nodes[j].pos) < 0.65) {
        edges.push({ a: s1Nodes[i].id, b: s1Nodes[j].id, type: "s1" });
      }
    }
  }

  // Cross Edges (Pipelines between Core and Cage)
  // Each S1 node connects to its absolute closest S2 node
  s1Nodes.forEach((n1) => {
    let closestS2 = s2Nodes[0];
    let minDist = Infinity;
    s2Nodes.forEach((n2) => {
      const d = M3.dist3D(n1.pos, n2.pos);
      if (d < minDist) {
        minDist = d;
        closestS2 = n2;
      }
    });
    // Add pipeline edge
    edges.push({ a: n1.id, b: closestS2.id, type: "cross" });
  });

  return { nodes, edges };
}

export function DualEngineGraphic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [data] = useState(() => generateData());
  const [yaw, setYaw] = useState(0.5);
  const [pitch, setPitch] = useState(0.3);

  // Interactive state
  const [mousePos, setMousePos] = useState<{ x: number, y: number } | null>(null);

  const targetRef = useRef({ yaw: 0.5, pitch: 0.3 });
  const dragRef = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const animTimeRef = useRef(0);

  // Auto-rotation & Easing Loop
  useEffect(() => {
    let raf: number;
    const tick = () => {
      animTimeRef.current += 0.01;

      // Auto rotate slowly if not dragging
      if (!dragRef.current) {
        targetRef.current.yaw += 0.002;
      }

      setYaw((prev) => prev + (targetRef.current.yaw - prev) * 0.15);
      setPitch((prev) => prev + (targetRef.current.pitch - prev) * 0.15);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Drag Interactions
  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      yaw: targetRef.current.yaw,
      pitch: targetRef.current.pitch,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    targetRef.current.yaw = d.yaw + dx * 0.005;
    targetRef.current.pitch = Math.max(-1.2, Math.min(1.2, d.pitch + dy * 0.005));
  };

  const onPointerUp = () => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  // Hover Interactions
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    pt = pt.matrixTransform(ctm.inverse());
    setMousePos({ x: pt.x, y: pt.y });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  // Rendering setup
  const W = 800;
  const H = 900;
  const scale = 360;
  const cx = W / 2;
  const cy = 340;
  const rotMat = M3.rot(yaw, pitch);

  // Project nodes
  const projectedNodes = useMemo(() => {
    const map = new Map();
    data.nodes.forEach((n) => {
      const p3 = M3.apply(rotMat, n.pos);
      const proj = M3.project(p3, scale, cx, cy);
      map.set(n.id, { ...n, ...proj });
    });
    return map;
  }, [data.nodes, rotMat, scale, cx, cy]);

  // Determine active node based on distance to mouse
  let activeNodeId: string | null = null;
  if (mousePos) {
    let minDist = 40; // Detection radius in pixels
    projectedNodes.forEach((proj, id) => {
      const dx = proj.x - mousePos.x;
      const dy = proj.y - mousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Front-facing nodes get priority if they overlap
      if (dist < minDist && proj.z > -0.5) {
        minDist = dist;
        activeNodeId = id;
      }
    });
  }


  // Prepare elements
  const elements: { depth: number; render: () => React.ReactNode }[] = [];

  // Edge rendering logic
  data.edges.forEach((edge, i) => {
    const pA = projectedNodes.get(edge.a);
    const pB = projectedNodes.get(edge.b);
    if (!pA || !pB) return;

    const avgZ = (pA.z + pB.z) / 2;
    let pathD = `M ${pA.x} ${pA.y} L ${pB.x} ${pB.y}`;

    // S1 (Core) uses straight paths, matching the rigid structure
    if (edge.type === "s1") {
      pathD = `M ${pA.x} ${pA.y} L ${pB.x} ${pB.y}`;
    }

    // Highlighting Logic
    let isHighlight = false;
    let isConnectedToActive = false;

    if (activeNodeId) {
      if (edge.a === activeNodeId || edge.b === activeNodeId) {
        isHighlight = true;
      } else {
        // If it's a cross edge and one of its nodes is connected to active?
        // Let's keep it simple: highlight only direct edges.
      }
    }

    const isActiveMode = activeNodeId !== null;

    let strokeOp = 0.3; // default base opacity
    let strokeW = 1.2;
    let isDashed = edge.type === "cross";

    if (isActiveMode) {
      strokeOp = isHighlight ? 0.95 : 0.08;
      strokeW = isHighlight ? 2.0 : 0.8;
    } else {
      // Idle state
      if (edge.type === "s1") strokeOp = 0.15; // Lower opacity due to extremely high density
      if (edge.type === "s2") strokeOp = 0.35;
      if (edge.type === "cross") strokeOp = 0.2;
    }

    // Backface culling / Depth fading
    const depthFade = (avgZ + 1.2) / 2.4; // 0 (back) to 1 (front)
    strokeOp *= 0.5 + 0.5 * depthFade;

    elements.push({
      depth: avgZ,
      render: () => (
        <path
          key={`edge-${i}`}
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeOpacity={strokeOp}
          strokeWidth={strokeW}
          strokeDasharray={isDashed ? "2 3" : "none"}
          style={{ transition: "stroke-opacity 0.4s ease, stroke-width 0.4s ease" }}
        />
      ),
    });
  });

  // Node rendering logic
  projectedNodes.forEach((node) => {
    const isHighlight = node.id === activeNodeId;
    const isActiveMode = activeNodeId !== null;

    // Check if connected to active node
    let isConnected = false;
    if (activeNodeId && !isHighlight) {
      isConnected = data.edges.some(
        (e) => (e.a === activeNodeId && e.b === node.id) || (e.b === activeNodeId && e.a === node.id)
      );
    }

    let r = node.layer === 2 ? 3.5 : 2;
    if (isHighlight) r += 2.5;
    else if (isConnected) r += 1.5;

    let fillOp = 0;
    if (isActiveMode) {
      fillOp = isHighlight ? 1 : isConnected ? 0.8 : 0.15;
    } else {
      fillOp = node.layer === 2 ? 0.6 : 0.85; // Core nodes brighter
    }

    // Depth fading
    const depthFade = (node.z + 1.2) / 2.4;
    fillOp *= 0.6 + 0.4 * depthFade;

    elements.push({
      depth: node.z + 1,
      render: () => (
        <g key={`node-${node.id}`}>
          {node.layer === 2 ? (
            <g>
              <rect
                x={node.x - r} y={node.y - r} width={r * 2} height={r * 2}
                fill="currentColor"
                opacity={fillOp}
                style={{ transition: "all 0.3s ease" }}
              />
              {/* HUD Data Labels */}
              <text
                x={node.x + 16}
                y={node.y + 4}
                fontSize="20"
                fill="currentColor"
                opacity={fillOp * 0.8}
                className="font-mono tracking-tighter select-none"
                style={{ transition: "opacity 0.4s ease" }}
              >
                [{node.label}]
              </text>
              <text
                x={node.x + 16}
                y={node.y + 26}
                fontSize="16"
                fill="currentColor"
                opacity={fillOp * 0.5}
                className="font-mono tracking-tighter select-none"
                style={{ transition: "opacity 0.4s ease" }}
              >
                θ: {node.dataVal}°
              </text>
            </g>
          ) : (
            <circle
              cx={node.x} cy={node.y} r={r}
              fill="currentColor"
              opacity={fillOp}
              style={{ transition: "all 0.3s ease" }}
            />
          )}
          {isHighlight && (
            <circle
              cx={node.x} cy={node.y} r={r + 6}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              opacity={0.6}
            />
          )}
        </g>
      ),
    });
  });

  // Sort back to front
  elements.sort((a, b) => a.depth - b.depth);

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full cursor-grab active:cursor-grabbing text-neutral-900 dark:text-neutral-100 overflow-hidden select-none"
    >
      <svg
        ref={svgRef}
        viewBox={`0 -50 ${W} ${H + 50}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute top-0 left-0 w-full h-[calc(100%-50px)] pointer-events-none"
      >
        <g className="pointer-events-auto">
          {elements.map((el) => el.render())}
        </g>
      </svg>
      {/* Legend / Overlay */}
      <div className="absolute bottom-0 left-0 flex flex-col gap-2 pointer-events-none text-[10px] sm:text-xs font-mono opacity-60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 border border-current"></div>
          System 2: Structured Cage (Logic)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-current opacity-70"></div>
          System 1: Chaotic Core (Intuition)
        </div>
        <div className="mt-2 text-[8px] sm:text-[10px] opacity-70 border-t border-current/30 pt-1 inline-block">DRAG TO ROTATE &bull; HOVER TO FOCUS NODE</div>
      </div>
    </div>
  );
}
