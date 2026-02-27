import { useMemo, useState } from "react";
import {
  calculateField,
  calculatePotential,
  formatFieldStrength,
  formatPotential,
  netChargeMicroCoulombs
} from "../lib/physics";
import type { Charge, MagnetState, QuizQuestion, SimulationMode, VisualConfig, WaveState } from "../types/simulation";

const defaultConfig: VisualConfig = {
  mainTitle: "Electromagnetic Field Explorer",
  infoText:
    "University-focused explorer for electric fields, magnetic fields, and EM waves. Use it to connect field maps with core laws like Coulomb and Faraday.",
  primaryColor: "#3b82f6",
  secondaryColor: "#ef4444",
  fontFamily: "Exo 2",
  fontSize: 14
};

const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    topic: "coulomb",
    prompt: "If charge magnitudes double and distance stays constant, electric force changes by:",
    options: ["2x", "4x", "8x", "No change"],
    correctIndex: 1,
    explanation: "From Coulomb's law F = k(q1q2)/r^2, doubling both charges multiplies force by 4."
  },
  {
    id: "q2",
    topic: "faraday",
    prompt: "Faraday's law states induced EMF is proportional to:",
    options: [
      "Magnetic field strength only",
      "Rate of change of magnetic flux",
      "Total electric charge in circuit",
      "Resistance times current"
    ],
    correctIndex: 1,
    explanation: "Faraday's law: EMF = -dPhi_B/dt."
  },
  {
    id: "q3",
    topic: "induction",
    prompt: "A conducting loop moved faster through a nonuniform magnetic field will generally induce:",
    options: ["Lower EMF", "Higher EMF", "Zero EMF", "Constant current regardless of resistance"],
    correctIndex: 1,
    explanation: "Faster motion raises flux change rate, increasing induced EMF."
  },
  {
    id: "q4",
    topic: "waves",
    prompt: "In an EM wave in vacuum, E and B fields are:",
    options: [
      "Parallel to each other and propagation",
      "Perpendicular to each other and to propagation",
      "Perpendicular to each other but parallel to propagation",
      "Randomly oriented"
    ],
    correctIndex: 1,
    explanation: "EM waves are transverse: E ⟂ B ⟂ propagation direction."
  }
];

export function useSimulationState() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [mode, setMode] = useState<SimulationMode>("electric");
  const [fieldDensity, setFieldDensity] = useState(12);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [showVectors, setShowVectors] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);
  const [addPolarity, setAddPolarity] = useState<1 | -1>(1);
  const [showEducation, setShowEducation] = useState(false);
  const [testParticleEnabled, setTestParticleEnabled] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizLocked, setQuizLocked] = useState(false);
  const [magnet, setMagnet] = useState<MagnetState>({
    x: 480,
    y: 320,
    strength: 4,
    angleDeg: 0
  });
  const [wave, setWave] = useState<WaveState>({
    amplitude: 80,
    wavelength: 200
  });
  const [config] = useState(defaultConfig);

  const selectedCharge = useMemo(
    () => charges.find((c) => c.id === selectedChargeId) ?? null,
    [charges, selectedChargeId]
  );

  const physicsSummary = useMemo(() => {
    const netMicro = netChargeMicroCoulombs(charges);
    return { totalCharges: charges.length, netCharge: `${netMicro.toFixed(2)} uC` };
  }, [charges]);

  const centerFieldText = (width: number, height: number) => {
    const field = calculateField(charges, width / 2, height / 2);
    return formatFieldStrength(field.magnitude);
  };

  const centerPotentialText = (width: number, height: number) => {
    const potential = calculatePotential(charges, width / 2, height / 2);
    return formatPotential(potential);
  };

  const addCharge = (x: number, y: number) => {
    setCharges((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        x,
        y,
        polarity: addPolarity,
        magnitude: 1e-6,
        radius: 25,
        pulsePhase: Math.random() * Math.PI * 2
      }
    ]);
  };

  const createDipole = (x: number, y: number) => {
    const spacing = 42;
    setCharges((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        x: x - spacing / 2,
        y,
        polarity: 1,
        magnitude: 1e-6,
        radius: 25,
        pulsePhase: Math.random() * Math.PI * 2
      },
      {
        id: crypto.randomUUID(),
        x: x + spacing / 2,
        y,
        polarity: -1,
        magnitude: 1e-6,
        radius: 25,
        pulsePhase: Math.random() * Math.PI * 2
      }
    ]);
  };

  const updateChargePosition = (id: string, x: number, y: number) => {
    setCharges((prev) => prev.map((c) => (c.id === id ? { ...c, x, y } : c)));
  };

  const updateChargeMagnitudeMicro = (id: string, microCoulombs: number) => {
    const clamped = Math.min(5, Math.max(0.2, microCoulombs));
    setCharges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              magnitude: clamped * 1e-6
            }
          : c
      )
    );
  };

  const deleteCharge = (id: string) => {
    setCharges((prev) => prev.filter((c) => c.id !== id));
    setSelectedChargeId((prev) => (prev === id ? null : prev));
  };

  const clearCharges = () => {
    setCharges([]);
    setSelectedChargeId(null);
  };

  const currentQuestion = quizQuestions[quizIndex];

  const startQuiz = () => {
    setQuizMode(true);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFeedback(null);
    setQuizLocked(false);
  };

  const submitQuizAnswer = (index: number) => {
    if (quizLocked) return;
    const correct = index === currentQuestion.correctIndex;
    setQuizFeedback(
      `${correct ? "Correct." : "Not quite."} ${currentQuestion.explanation}`
    );
    if (correct) {
      setQuizScore((s) => s + 1);
    }
    setQuizLocked(true);
  };

  const nextQuizQuestion = () => {
    if (quizIndex >= quizQuestions.length - 1) {
      setQuizMode(false);
      return;
    }
    setQuizIndex((i) => i + 1);
    setQuizFeedback(null);
    setQuizLocked(false);
  };

  return {
    charges,
    selectedCharge,
    mode,
    setMode,
    fieldDensity,
    setFieldDensity,
    animSpeed,
    setAnimSpeed,
    showVectors,
    setShowVectors,
    showGrid,
    setShowGrid,
    selectedChargeId,
    setSelectedChargeId,
    addPolarity,
    setAddPolarity,
    showEducation,
    setShowEducation,
    testParticleEnabled,
    setTestParticleEnabled,
    magnet,
    setMagnet,
    wave,
    setWave,
    quizMode,
    setQuizMode,
    config,
    physicsSummary,
    centerFieldText,
    centerPotentialText,
    addCharge,
    createDipole,
    updateChargePosition,
    updateChargeMagnitudeMicro,
    deleteCharge,
    clearCharges,
    currentQuestion,
    quizIndex,
    quizTotal: quizQuestions.length,
    quizScore,
    quizFeedback,
    quizLocked,
    startQuiz,
    submitQuizAnswer,
    nextQuizQuestion
  };
}
