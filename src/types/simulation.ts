export type SimulationMode = "electric" | "magnetic" | "em-wave" | "combined";

export interface Charge {
  id: string;
  x: number;
  y: number;
  polarity: 1 | -1;
  magnitude: number;
  radius: number;
  pulsePhase: number;
}

export interface FieldResult {
  Ex: number;
  Ey: number;
  magnitude: number;
}

export interface ProbeData {
  x: number;
  y: number;
  fieldMagnitude: number;
  directionDeg: number;
  visible: boolean;
  screenX: number;
  screenY: number;
}

export interface VisualConfig {
  mainTitle: string;
  infoText: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
}

export interface QuizQuestion {
  id: string;
  topic: "coulomb" | "faraday" | "induction" | "waves";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TestParticleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: Array<{ x: number; y: number }>;
}

export interface MagnetState {
  x: number;
  y: number;
  strength: number;
  angleDeg: number;
}

export interface WaveState {
  amplitude: number;
  wavelength: number;
}
