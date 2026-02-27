import { useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import { calculateField, containsPoint, formatFieldStrength } from "../lib/physics";
import { drawScene, updateAndDrawTestParticle } from "../lib/renderer";
import type {
  Charge,
  MagnetState,
  ProbeData,
  SimulationMode,
  TestParticleState,
  WaveState
} from "../types/simulation";

interface UseCanvasEngineArgs {
  mode: SimulationMode;
  charges: Charge[];
  fieldDensity: number;
  animSpeed: number;
  showVectors: boolean;
  selectedChargeId: string | null;
  testParticleEnabled: boolean;
  magnet: MagnetState;
  wave: WaveState;
  onAddCharge: (x: number, y: number) => void;
  onSelectCharge: (id: string | null) => void;
  onDeleteCharge: (id: string) => void;
  onMoveCharge: (id: string, x: number, y: number) => void;
  onMoveMagnet: (x: number, y: number) => void;
}

const initialProbe: ProbeData = {
  x: 0,
  y: 0,
  fieldMagnitude: 0,
  directionDeg: 0,
  visible: false,
  screenX: 0,
  screenY: 0
};

export function useCanvasEngine(args: UseCanvasEngineArgs) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [probe, setProbe] = useState<ProbeData>(initialProbe);
  const dragRef = useRef<{ active: boolean; chargeId: string | null; magnet: boolean }>({
    active: false,
    chargeId: null,
    magnet: false
  });
  const testParticleRef = useRef<TestParticleState>({
    x: 100,
    y: 100,
    vx: 0,
    vy: 0,
    trail: []
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setCanvasSize({ width: rect.width, height: rect.height });
    };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let prevTime = 0;
    const animate = (time: number) => {
      const dt = Math.max(0.4, Math.min(1.8, prevTime === 0 ? 1 : (time - prevTime) / 16.67));
      prevTime = time;
      drawScene({
        ctx,
        width: canvas.width,
        height: canvas.height,
        time,
        mode: args.mode,
        charges: args.charges,
        selectedChargeId: args.selectedChargeId,
        fieldDensity: args.fieldDensity,
        animSpeed: args.animSpeed,
        showVectors: args.showVectors,
        magnet: args.magnet,
        wave: args.wave
      });

      if (
        args.testParticleEnabled &&
        args.charges.length > 0 &&
        (args.mode === "electric" || args.mode === "combined")
      ) {
        const state = testParticleRef.current;
        if (state.trail.length === 0) {
          testParticleRef.current = {
            ...state,
            x: canvas.width * 0.5 + 80,
            y: canvas.height * 0.5 - 40
          };
        }
        testParticleRef.current = updateAndDrawTestParticle(
          ctx,
          canvas.width,
          canvas.height,
          args.charges,
          testParticleRef.current,
          dt
        );
      } else if (testParticleRef.current.trail.length > 0) {
        testParticleRef.current = {
          x: canvas.width * 0.5,
          y: canvas.height * 0.5,
          vx: 0,
          vy: 0,
          trail: []
        };
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [
    args.mode,
    args.charges,
    args.selectedChargeId,
    args.testParticleEnabled,
    args.magnet,
    args.wave,
    args.fieldDensity,
    args.animSpeed,
    args.showVectors
  ]);

  const getPos = (event: PointerEvent<HTMLCanvasElement> | MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top, rect };
  };

  const handleCanvasTap = (event: PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current.active) return;
    if (args.mode !== "electric" && args.mode !== "combined") return;

    const { x, y } = getPos(event);
    const hit = args.charges.find((c) => containsPoint(c, x, y));
    if (hit) {
      args.onSelectCharge(args.selectedChargeId === hit.id ? null : hit.id);
      return;
    }
    args.onAddCharge(x, y);
  };

  const handleContextMenu = (event: MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const { x, y } = getPos(event);
    for (let i = args.charges.length - 1; i >= 0; i -= 1) {
      if (containsPoint(args.charges[i], x, y)) {
        args.onDeleteCharge(args.charges[i].id);
        break;
      }
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getPos(event);
    event.currentTarget.setPointerCapture(event.pointerId);

    if (args.mode === "magnetic" || args.mode === "combined") {
      const dx = x - args.magnet.x;
      const dy = y - args.magnet.y;
      if (dx * dx + dy * dy <= 70 * 70) {
        dragRef.current = { active: true, chargeId: null, magnet: true };
        args.onMoveMagnet(x, y);
        return;
      }
    }

    const hit = args.charges.find((c) => containsPoint(c, x, y));
    if (!hit) return;
    dragRef.current = { active: true, chargeId: hit.id, magnet: false };
    args.onSelectCharge(hit.id);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const { x, y, rect } = getPos(event);
    if (dragRef.current.active && dragRef.current.magnet) {
      args.onMoveMagnet(x, y);
    } else if (dragRef.current.active && dragRef.current.chargeId) {
      args.onMoveCharge(dragRef.current.chargeId, x, y);
    }

    if (args.charges.length > 0 && (args.mode === "electric" || args.mode === "combined")) {
      const field = calculateField(args.charges, x, y);
      setProbe({
        x,
        y,
        fieldMagnitude: field.magnitude,
        directionDeg: (Math.atan2(field.Ey, field.Ex) * 180) / Math.PI,
        visible: true,
        screenX: event.clientX - rect.left + 20,
        screenY: event.clientY - rect.top + 20
      });
    }
  };

  const release = () => {
    dragRef.current = { active: false, chargeId: null, magnet: false };
    setProbe((prev) => ({ ...prev, visible: false }));
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) {
      handleCanvasTap(event);
    }
    release();
  };

  return {
    canvasRef,
    canvasSize,
    probe,
    probeFieldText: formatFieldStrength(probe.fieldMagnitude),
    handleCanvasTap,
    handleContextMenu,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave: release
  };
}


