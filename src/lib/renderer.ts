import { calculateField, containsPoint } from "./physics";
import type { Charge, MagnetState, SimulationMode, TestParticleState, WaveState } from "../types/simulation";

interface DrawSceneArgs {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  mode: SimulationMode;
  charges: Charge[];
  selectedChargeId: string | null;
  fieldDensity: number;
  animSpeed: number;
  showVectors: boolean;
  magnet: MagnetState;
  wave: WaveState;
}

export function drawScene(args: DrawSceneArgs): void {
  const { ctx, width, height, mode } = args;
  ctx.clearRect(0, 0, width, height);

  if (mode === "electric" || mode === "combined") {
    drawFieldLines(ctx, width, height, args.charges, args.fieldDensity);
    if (args.showVectors) {
      drawVectorField(ctx, width, height, args.charges, args.time, args.animSpeed);
    }
    for (const charge of args.charges) {
      drawCharge(ctx, charge, charge.id === args.selectedChargeId, args.time, args.animSpeed);
    }
  }

  if (mode === "magnetic" || mode === "combined") {
    drawMagneticField(ctx, width, height, args.time, args.animSpeed, args.magnet);
  }

  if (mode === "em-wave") {
    drawEMWave(ctx, width, height, args.time, args.animSpeed, args.wave);
  }
}

function drawCharge(
  ctx: CanvasRenderingContext2D,
  charge: Charge,
  selected: boolean,
  time: number,
  animSpeed: number
) {
  const pulse = Math.sin(time * 0.003 * animSpeed + charge.pulsePhase) * 0.2 + 1;
  const glow = ctx.createRadialGradient(charge.x, charge.y, 0, charge.x, charge.y, charge.radius * 3 * pulse);
  if (charge.polarity > 0) {
    glow.addColorStop(0, "rgba(239, 68, 68, 0.8)");
    glow.addColorStop(0.5, "rgba(239, 68, 68, 0.3)");
    glow.addColorStop(1, "rgba(239, 68, 68, 0)");
  } else {
    glow.addColorStop(0, "rgba(59, 130, 246, 0.8)");
    glow.addColorStop(0.5, "rgba(59, 130, 246, 0.3)");
    glow.addColorStop(1, "rgba(59, 130, 246, 0)");
  }
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(charge.x, charge.y, charge.radius * 3 * pulse, 0, Math.PI * 2);
  ctx.fill();

  const core = ctx.createRadialGradient(charge.x - 5, charge.y - 5, 0, charge.x, charge.y, charge.radius);
  if (charge.polarity > 0) {
    core.addColorStop(0, "#fca5a5");
    core.addColorStop(0.5, "#ef4444");
    core.addColorStop(1, "#b91c1c");
  } else {
    core.addColorStop(0, "#93c5fd");
    core.addColorStop(0.5, "#3b82f6");
    core.addColorStop(1, "#1d4ed8");
  }
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(charge.x, charge.y, charge.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "bold 24px Orbitron";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(charge.polarity > 0 ? "+" : "-", charge.x, charge.y);

  if (!selected) return;
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 3;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(charge.x, charge.y, charge.radius + 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawFieldLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  charges: Charge[],
  density: number
) {
  if (charges.length === 0) return;
  ctx.strokeStyle = "rgba(147, 197, 253, 0.6)";
  ctx.lineWidth = 1.5;

  for (const c of charges) {
    if (c.polarity <= 0) continue;
    for (let i = 0; i < density; i += 1) {
      const a = (i / density) * Math.PI * 2;
      traceLine(ctx, width, height, charges, c.x + Math.cos(a) * 30, c.y + Math.sin(a) * 30, 1);
    }
  }

  if (charges.some((c) => c.polarity > 0)) return;
  for (const c of charges) {
    for (let i = 0; i < density; i += 1) {
      const a = (i / density) * Math.PI * 2;
      traceLine(ctx, width, height, charges, c.x + Math.cos(a) * 200, c.y + Math.sin(a) * 200, -1);
    }
  }
}

function traceLine(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  charges: Charge[],
  startX: number,
  startY: number,
  direction: 1 | -1
) {
  const step = 5;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  let x = startX;
  let y = startY;
  for (let i = 0; i < 500; i += 1) {
    const f = calculateField(charges, x, y);
    if (f.magnitude < 1e-10) break;
    x += (f.Ex / f.magnitude) * step * direction;
    y += (f.Ey / f.magnitude) * step * direction;
    if (x < 0 || x > width || y < 0 || y > height) break;
    if (charges.some((c) => containsPoint(c, x, y))) break;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawVectorField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  charges: Charge[],
  time: number,
  speed: number
) {
  const spacing = 60;
  const flow = (time * 0.001 * speed) % 1;
  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      const f = calculateField(charges, x, y);
      if (f.magnitude < 1e-10) continue;
      const s = Math.min(15, Math.log10(f.magnitude + 1) * 3);
      const dx = (f.Ex / f.magnitude) * s;
      const dy = (f.Ey / f.magnitude) * s;
      const i = Math.min(255, f.magnitude / 1e8 + flow * 20);
      ctx.strokeStyle = `rgba(${100 + i}, ${150 + i * 0.5}, 255, 0.6)`;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - dx * 0.5, y - dy * 0.5);
      ctx.lineTo(x + dx * 0.5, y + dy * 0.5);
      ctx.stroke();
      const a = Math.atan2(dy, dx);
      ctx.beginPath();
      ctx.moveTo(x + dx * 0.5, y + dy * 0.5);
      ctx.lineTo(x + dx * 0.5 - 5 * Math.cos(a - Math.PI / 6), y + dy * 0.5 - 5 * Math.sin(a - Math.PI / 6));
      ctx.lineTo(x + dx * 0.5 - 5 * Math.cos(a + Math.PI / 6), y + dy * 0.5 - 5 * Math.sin(a + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }
  }
}

function drawMagneticField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  speed: number,
  magnet: MagnetState
) {
  const cx = magnet.x;
  const cy = magnet.y;
  ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
  ctx.lineWidth = Math.max(1.4, magnet.strength * 0.9);
  for (let r = 50; r < Math.max(width, height); r += Math.max(35, 80 - magnet.strength * 10)) {
    ctx.beginPath();
    const off = (time * 0.001 * speed) % (Math.PI * 2) + (magnet.angleDeg * Math.PI) / 180;
    for (let a = 0; a < Math.PI * 2; a += 0.1) {
      const x = cx + Math.cos(a + off) * r;
      const y = cy + Math.sin(a + off) * r;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.fillStyle = "#a855f7";
  ctx.font = "bold 20px Orbitron";
  ctx.textAlign = "center";
  const angle = (magnet.angleDeg * Math.PI) / 180;
  const nx = Math.cos(angle);
  const ny = Math.sin(angle);
  ctx.fillText("N", cx + nx * 52, cy + ny * 52);
  ctx.fillText("S", cx - nx * 52, cy - ny * 52);
  const g = ctx.createLinearGradient(cx - nx * 40, cy - ny * 20, cx + nx * 40, cy + ny * 20);
  g.addColorStop(0, "#ef4444");
  g.addColorStop(0.5, "#6b7280");
  g.addColorStop(1, "#3b82f6");
  ctx.fillStyle = g;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillRect(-40, -15, 80, 30);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(-40, -15, 80, 30);
  ctx.restore();
}

function drawEMWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  speed: number,
  wave: WaveState
) {
  const cy = height / 2;
  const amp = wave.amplitude;
  const wl = wave.wavelength;
  const off = time * 0.002 * speed;
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x < width; x += 2) {
    const y = cy + Math.sin((x / wl) * Math.PI * 2 + off) * amp;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 5]);
  ctx.beginPath();
  for (let x = 0; x < width; x += 2) {
    const y = cy + Math.cos((x / wl) * Math.PI * 2 + off) * amp * 0.3;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = "16px Exo 2";
  ctx.fillStyle = "#ef4444";
  ctx.fillText("E (Electric)", 20, cy - amp - 20);
  ctx.fillStyle = "#3b82f6";
  ctx.fillText("B (Magnetic)", 20, cy + amp + 30);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 16px Orbitron";
  ctx.fillText("Propagation", width - 170, cy - 18);
  ctx.beginPath();
  ctx.moveTo(width - 165, cy);
  ctx.lineTo(width - 85, cy);
  ctx.lineTo(width - 95, cy - 7);
  ctx.moveTo(width - 85, cy);
  ctx.lineTo(width - 95, cy + 7);
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function updateAndDrawTestParticle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  charges: Charge[],
  state: TestParticleState,
  dt: number
): TestParticleState {
  const field = calculateField(charges, state.x, state.y);
  const ax = field.Ex * 8e-10;
  const ay = field.Ey * 8e-10;
  const damping = 0.994;
  const vx = (state.vx + ax * dt) * damping;
  const vy = (state.vy + ay * dt) * damping;
  let x = state.x + vx * dt;
  let y = state.y + vy * dt;

  if (x < 10 || x > width - 10 || y < 10 || y > height - 10) {
    x = width * 0.5;
    y = height * 0.5;
  }

  const trail = [...state.trail, { x, y }].slice(-120);
  ctx.strokeStyle = "rgba(251, 191, 36, 0.65)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < trail.length; i += 1) {
    if (i === 0) {
      ctx.moveTo(trail[i].x, trail[i].y);
    } else {
      ctx.lineTo(trail[i].x, trail[i].y);
    }
  }
  ctx.stroke();

  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();

  return { x, y, vx, vy, trail };
}
