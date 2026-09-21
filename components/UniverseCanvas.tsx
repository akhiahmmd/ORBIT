'use client';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import NodeInsight, { type NodeData } from './NodeInsight';

// ─── DEMO DATA ──────────────────────────────────────────────────────
const CLUSTERS = [
  { name: 'Study', color: '#818cf8', x: 0.3, y: 0.28 },
  { name: 'Productivity', color: '#34d399', x: 0.72, y: 0.25 },
  { name: 'Goals', color: '#f59e0b', x: 0.65, y: 0.7 },
  { name: 'Reflection', color: '#38bdf8', x: 0.25, y: 0.72 },
  { name: 'Stress', color: '#f87171', x: 0.5, y: 0.5 },
  { name: 'Social', color: '#c084fc', x: 0.8, y: 0.5 },
];

const NODE_DATA: NodeData[] = [
  { id: 'n1', date: 'AUG 15, 2026', topic: 'Python / Learning', cluster: 'Study', mood: 'Happy', productivity: '8/10', journal: 'Finally understood functions today. Spent three focused hours and everything clicked.' },
  { id: 'n2', date: 'AUG 12, 2026', topic: 'React Components', cluster: 'Study', mood: 'Focused', productivity: '9/10', journal: 'Built my first custom hook. The mental model is starting to solidify.' },
  { id: 'n3', date: 'AUG 18, 2026', topic: 'Project Deadline', cluster: 'Productivity', mood: 'Determined', productivity: '9/10', journal: 'Hit all my milestones for the sprint. Three PRs merged before lunch.' },
  { id: 'n4', date: 'AUG 20, 2026', topic: 'Morning Routine', cluster: 'Productivity', mood: 'Calm', productivity: '7/10', journal: 'Started journaling before code. The clarity carries through the whole day.' },
  { id: 'n5', date: 'AUG 10, 2026', topic: 'Career Planning', cluster: 'Goals', mood: 'Hopeful', productivity: '6/10', journal: 'Mapped out my next six months. Need to balance learning with shipping.' },
  { id: 'n6', date: 'AUG 22, 2026', topic: 'Portfolio Update', cluster: 'Goals', mood: 'Motivated', productivity: '7/10', journal: 'Redesigned my portfolio. Feels more authentic now.' },
  { id: 'n7', date: 'AUG 14, 2026', topic: 'Evening Walk', cluster: 'Reflection', mood: 'Peaceful', productivity: 'N/A', journal: 'Walked for an hour without music. Sometimes silence is the best debugger.' },
  { id: 'n8', date: 'AUG 16, 2026', topic: 'Gratitude Log', cluster: 'Reflection', mood: 'Content', productivity: 'N/A', journal: 'Three things: good coffee, a solved bug, and the sunset from my window.' },
  { id: 'n9', date: 'AUG 11, 2026', topic: 'Exam Prep', cluster: 'Stress', mood: 'Anxious', productivity: '5/10', journal: 'Two exams next week. Need to prioritize data structures over new projects.' },
  { id: 'n10', date: 'AUG 19, 2026', topic: 'Sleep Deficit', cluster: 'Stress', mood: 'Tired', productivity: '4/10', journal: 'Only got five hours. Everything took twice as long today.' },
  { id: 'n11', date: 'AUG 17, 2026', topic: 'Dinner with Friends', cluster: 'Social', mood: 'Joyful', productivity: 'N/A', journal: 'Great conversation about the future of AI. Inspiration struck.' },
  { id: 'n12', date: 'AUG 21, 2026', topic: 'Study Group', cluster: 'Social', mood: 'Energized', productivity: '7/10', journal: 'Teaching others is the fastest way to learn. Explained closures three times.' },
];

// ─── TYPES ──────────────────────────────────────────────────────────
interface Star {
  x: number; y: number; z: number; // z = depth 0..1
  size: number;
  brightness: number;
  speed: number;
}

interface UniverseNode {
  id: string;
  // base position relative to center (normalized -0.5..0.5)
  bx: number; by: number;
  // current rendered position (px)
  rx: number; ry: number;
  size: number;
  cluster: string;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  data: NodeData;
}

interface Connection {
  from: number;
  to: number;
}

// ─── HELPERS ────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// ─── COMPONENT ──────────────────────────────────────────────────────
export default function UniverseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const timeRef = useRef(0);

  const [hoveredNode, setHoveredNode] = useState<UniverseNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<UniverseNode | null>(null);
  const [insightPos, setInsightPos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 800 });

  // ─── GENERATE SCENE DATA ──────────────────────────────────
  const stars = useMemo<Star[]>(() => {
    const s: Star[] = [];
    for (let i = 0; i < 400; i++) {
      s.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        size: rand(0.3, 1.5),
        brightness: rand(0.15, 0.6),
        speed: rand(0.0001, 0.0004),
      });
    }
    return s;
  }, []);

  const nodes = useMemo<UniverseNode[]>(() => {
    return NODE_DATA.map((data, i) => {
      const cluster = CLUSTERS.find(c => c.name === data.cluster)!;
      const angle = rand(0, Math.PI * 2);
      const dist = rand(0.03, 0.12);
      return {
        id: data.id,
        bx: cluster.x - 0.5 + Math.cos(angle) * dist,
        by: cluster.y - 0.5 + Math.sin(angle) * dist,
        rx: 0, ry: 0,
        size: rand(3, 7),
        cluster: data.cluster,
        color: cluster.color,
        orbitRadius: rand(2, 8),
        orbitSpeed: rand(0.002, 0.008) * (Math.random() > 0.5 ? 1 : -1),
        orbitAngle: rand(0, Math.PI * 2),
        data,
      };
    });
  }, []);

  const connections = useMemo<Connection[]>(() => {
    const conns: Connection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].cluster === nodes[j].cluster) {
          conns.push({ from: i, to: j });
        }
      }
    }
    // Add some cross-cluster connections
    conns.push({ from: 0, to: 2 });
    conns.push({ from: 4, to: 8 });
    conns.push({ from: 7, to: 11 });
    return conns;
  }, [nodes]);

  // ─── DRAWING ──────────────────────────────────────────────
  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const dpr = window.devicePixelRatio || 1;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const parallaxX = (mx - 0.5) * 30;
    const parallaxY = (my - 0.5) * 30;

    ctx.clearRect(0, 0, w * dpr, h * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    // ─── BACKGROUND GLOW ──────────────────────────────────
    const cx = w * 0.48 + parallaxX * 0.3;
    const cy = h * 0.48 + parallaxY * 0.3;

    // Atmospheric radial glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.5);
    grad.addColorStop(0, 'rgba(99, 102, 241, 0.06)');
    grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.03)');
    grad.addColorStop(0.6, 'rgba(99, 102, 241, 0.01)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // ─── STAR FIELD ─────────────────────────────────────────
    for (const star of stars) {
      const sx = (star.x * w) + parallaxX * (star.z * 0.8);
      const sy = (star.y * h) + parallaxY * (star.z * 0.8);
      const twinkle = 0.6 + Math.sin(t * 2 + star.x * 100) * 0.4;
      const alpha = star.brightness * twinkle;

      ctx.beginPath();
      ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
      ctx.fill();
    }

    // ─── ORBITAL RINGS ──────────────────────────────────────
    const ringCx = cx;
    const ringCy = cy;
    const ringRadii = [w * 0.12, w * 0.22, w * 0.33, w * 0.42];

    ctx.save();
    ctx.translate(ringCx, ringCy);

    for (let i = 0; i < ringRadii.length; i++) {
      const r = ringRadii[i];
      const rotOff = t * 0.1 * (i % 2 === 0 ? 1 : -1);
      const tiltFactor = 0.3 + i * 0.05;

      ctx.save();
      ctx.rotate(rotOff + i * 0.4);
      ctx.scale(1, tiltFactor);

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(130, 140, 255, ${0.04 + i * 0.01})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }
    ctx.restore();

    // ─── CENTRAL CORE ───────────────────────────────────────
    const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
    coreGlow.addColorStop(0, 'rgba(129, 140, 248, 0.35)');
    coreGlow.addColorStop(0.4, 'rgba(56, 189, 248, 0.12)');
    coreGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.fill();

    // Core bright center
    const coreInner = ctx.createRadialGradient(cx, cy, 0, cx, cy, 6);
    coreInner.addColorStop(0, 'rgba(200, 210, 255, 0.7)');
    coreInner.addColorStop(1, 'rgba(129, 140, 248, 0.1)');
    ctx.fillStyle = coreInner;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // ─── UPDATE NODE POSITIONS ──────────────────────────────
    for (const node of nodes) {
      node.orbitAngle += node.orbitSpeed;
      const baseX = (node.bx + 0.5) * w + parallaxX * 0.6;
      const baseY = (node.by + 0.5) * h + parallaxY * 0.6;
      node.rx = baseX + Math.cos(node.orbitAngle) * node.orbitRadius;
      node.ry = baseY + Math.sin(node.orbitAngle) * node.orbitRadius;
    }

    // ─── CONNECTION LINES ───────────────────────────────────
    for (const conn of connections) {
      const a = nodes[conn.from];
      const b = nodes[conn.to];
      const sameCl = a.cluster === b.cluster;
      const alpha = sameCl ? 0.06 : 0.025;

      ctx.beginPath();
      ctx.moveTo(a.rx, a.ry);
      ctx.lineTo(b.rx, b.ry);
      ctx.strokeStyle = `rgba(130, 140, 255, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // ─── CLUSTER LABELS ─────────────────────────────────────
    ctx.font = '9px ui-monospace, monospace';
    ctx.textAlign = 'center';
    for (const cl of CLUSTERS) {
      const lx = cl.x * w + parallaxX * 0.6;
      const ly = cl.y * h + parallaxY * 0.6 - 18;
      const [r, g, b] = hexToRgb(cl.color);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
      ctx.fillText(cl.name.toUpperCase(), lx, ly);
    }

    // ─── NODES ──────────────────────────────────────────────
    // Distance from mouse for highlighting
    const mouseAbsX = mx * w;
    const mouseAbsY = my * h;

    for (const node of nodes) {
      const dx = node.rx - mouseAbsX;
      const dy = node.ry - mouseAbsY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode?.id === node.id;
      const nearMouse = dist < 80;
      const brighten = nearMouse ? 1 + (80 - dist) / 80 * 0.5 : 1;

      const [r, g, b] = hexToRgb(node.color);
      const baseAlpha = 0.6 * brighten;
      const drawSize = node.size * (isHovered || isSelected ? 1.6 : 1) * brighten;

      // Outer glow
      if (isHovered || isSelected || nearMouse) {
        const glowR = drawSize * 4;
        const glow = ctx.createRadialGradient(node.rx, node.ry, 0, node.rx, node.ry, glowR);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${(isHovered || isSelected) ? 0.2 : 0.08})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.rx, node.ry, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node body
      ctx.beginPath();
      ctx.arc(node.rx, node.ry, drawSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${baseAlpha})`;
      ctx.fill();

      // Bright center
      ctx.beginPath();
      ctx.arc(node.rx, node.ry, drawSize * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${baseAlpha * 0.5})`;
      ctx.fill();
    }

    // ─── SUBTLE DATA COORDINATES ────────────────────────────
    ctx.font = '8px ui-monospace, monospace';
    ctx.textAlign = 'left';
    // Only show a few coordinate markers for atmosphere
    const coordNodes = [nodes[0], nodes[3], nodes[7], nodes[10]];
    for (const cn of coordNodes) {
      if (!cn) continue;
      ctx.fillStyle = 'rgba(130, 140, 255, 0.12)';
      ctx.fillText(
        `${cn.rx.toFixed(0)}.${cn.ry.toFixed(0)}`,
        cn.rx + cn.size + 6,
        cn.ry + 3
      );
    }

    ctx.restore();
  }, [stars, nodes, connections, hoveredNode, selectedNode]);

  // ─── ANIMATION LOOP ───────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      setCanvasSize({ w: rect.width, h: rect.height });
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      timeRef.current += 0.016;
      const rect = container.getBoundingClientRect();
      (draw as any)(ctx, rect.width, rect.height, timeRef.current);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  // ─── MOUSE HANDLING ───────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseRef.current = { x, y, active: true };

    // Hit test nodes
    const absX = x * rect.width;
    const absY = y * rect.height;
    let found: UniverseNode | null = null;

    for (const node of nodes) {
      const dx = node.rx - absX;
      const dy = node.ry - absY;
      if (Math.sqrt(dx * dx + dy * dy) < node.size + 12) {
        found = node;
        break;
      }
    }

    if (found && !selectedNode) {
      setHoveredNode(found);
      setInsightPos({ x: found.rx, y: found.ry });
      if (containerRef.current) containerRef.current.style.cursor = 'pointer';
    } else if (!found && !selectedNode) {
      setHoveredNode(null);
      if (containerRef.current) containerRef.current.style.cursor = 'default';
    }
  }, [nodes, selectedNode]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * rect.width;
    const y = ((e.clientY - rect.top) / rect.height) * rect.height;

    let found: UniverseNode | null = null;
    for (const node of nodes) {
      const dx = node.rx - x;
      const dy = node.ry - y;
      if (Math.sqrt(dx * dx + dy * dy) < node.size + 14) {
        found = node;
        break;
      }
    }

    if (found) {
      setSelectedNode(found);
      setHoveredNode(null);
      setInsightPos({ x: found.rx, y: found.ry });
    } else {
      setSelectedNode(null);
    }
  }, [nodes]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0.5, y: 0.5, active: false };
    if (!selectedNode) setHoveredNode(null);
  }, [selectedNode]);

  const activeNode = selectedNode || hoveredNode;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Node insight panel */}
      {activeNode && (
        <NodeInsight
          node={activeNode.data}
          position={insightPos}
          expanded={!!selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
