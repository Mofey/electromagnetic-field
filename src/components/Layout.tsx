import type { MouseEvent, PointerEvent, RefObject } from "react";
import type { Charge, QuizQuestion, SimulationMode } from "../types/simulation";

interface HeaderProps {
  title: string;
  onLearn: () => void;
  onToggleControls: () => void;
  controlsVisible: boolean;
}

export function Header({ title, onLearn, onToggleControls, controlsVisible }: HeaderProps) {
  return (
    <header className="panel-glass px-4 py-3 md:px-6 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <h1 className="orbitron text-sm md:text-xl font-bold glow-text text-blue-400 truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onToggleControls} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-xs exo">
          {controlsVisible ? "Hide Controls" : "Show Controls"}
        </button>
        <button onClick={onLearn} className="btn-cyber px-3 md:px-4 py-2 rounded-lg exo font-semibold text-xs md:text-sm">
          Learn
        </button>
      </div>
    </header>
  );
}

interface ControlPanelProps {
  className?: string;
  mode: SimulationMode;
  onModeChange: (mode: SimulationMode) => void;
  addPolarity: 1 | -1;
  onAddPolarity: (polarity: 1 | -1) => void;
  onCreateDipole: () => void;
  onClearCharges: () => void;
  fieldDensity: number;
  onFieldDensity: (value: number) => void;
  animSpeed: number;
  onAnimSpeed: (value: number) => void;
  showVectors: boolean;
  onToggleVectors: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  testParticleEnabled: boolean;
  onToggleTestParticle: () => void;
  totalCharges: number;
  netCharge: string;
  fieldStrength: string;
  centerPotential: string;
  selectedCharge: Charge | null;
  onSelectedChargeMagnitude: (micro: number) => void;
  quizMode: boolean;
  onToggleQuizMode: () => void;
  magnetStrength: number;
  onMagnetStrength: (value: number) => void;
  magnetAngleDeg: number;
  onMagnetAngle: (value: number) => void;
  waveAmplitude: number;
  onWaveAmplitude: (value: number) => void;
  waveWavelength: number;
  onWaveWavelength: (value: number) => void;
}

const modes: Array<{ id: SimulationMode; label: string }> = [
  { id: "electric", label: "Electric" },
  { id: "magnetic", label: "Magnetic" },
  { id: "em-wave", label: "EM Wave" },
  { id: "combined", label: "Combined" }
];

export function ControlPanel(props: ControlPanelProps) {
  const {
    className,
    mode,
    onModeChange,
    addPolarity,
    onAddPolarity,
    onCreateDipole,
    onClearCharges,
    fieldDensity,
    onFieldDensity,
    animSpeed,
    onAnimSpeed,
    showVectors,
    onToggleVectors,
    showGrid,
    onToggleGrid,
    testParticleEnabled,
    onToggleTestParticle,
    totalCharges,
    netCharge,
    fieldStrength,
    centerPotential,
    selectedCharge,
    onSelectedChargeMagnitude,
    quizMode,
    onToggleQuizMode,
    magnetStrength,
    onMagnetStrength,
    magnetAngleDeg,
    onMagnetAngle,
    waveAmplitude,
    onWaveAmplitude,
    waveWavelength,
    onWaveWavelength
  } = props;

  return (
    <aside className={`panel-glass p-4 overflow-y-auto z-20 shrink-0 w-full lg:w-80 ${className ?? ""}`}>
      <div className="space-y-5">
        <section>
          <h3 className="orbitron text-sm font-bold text-blue-300 mb-3">Simulation Mode</h3>
          <div className="grid grid-cols-2 gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className={
                  mode === m.id
                    ? "btn-cyber px-3 py-2 rounded-lg text-xs exo font-semibold"
                    : "px-3 py-2 rounded-lg text-xs exo font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-600"
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        </section>

        {(mode === "electric" || mode === "combined") && (
          <section>
            <h3 className="orbitron text-sm font-bold text-blue-300 mb-3">Electric Charges</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onAddPolarity(1)}
                className={`flex-1 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 exo font-bold text-sm ${
                  addPolarity === 1 ? "ring-2 ring-yellow-400" : ""
                }`}
              >
                + Positive
              </button>
              <button
                onClick={() => onAddPolarity(-1)}
                className={`flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 exo font-bold text-sm ${
                  addPolarity === -1 ? "ring-2 ring-yellow-400" : ""
                }`}
              >
                - Negative
              </button>
            </div>
            <button onClick={onCreateDipole} className="w-full mt-2 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 exo text-sm border border-indigo-300/30">
              Create Dipole Pair
            </button>
            <button onClick={onClearCharges} className="w-full mt-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 exo text-sm border border-slate-500">
              Clear All
            </button>
            <p className="exo text-xs text-slate-300 mt-2">Click canvas to place; drag to move; right-click to remove.</p>
          </section>
        )}

        {(mode === "magnetic" || mode === "combined") && (
          <section className="panel-glass rounded-lg p-3 border border-fuchsia-500/30">
            <h3 className="orbitron text-sm font-bold text-fuchsia-300 mb-2">Magnet Controls</h3>
            <label className="exo text-xs text-slate-300 flex justify-between mb-1">
              <span>Strength</span>
              <span className="text-fuchsia-300">{magnetStrength.toFixed(1)}</span>
            </label>
            <input type="range" min={1} max={8} step={0.2} value={magnetStrength} onChange={(e) => onMagnetStrength(Number(e.target.value))} className="w-full" />
            <label className="exo text-xs text-slate-300 flex justify-between mb-1 mt-3">
              <span>Angle</span>
              <span className="text-fuchsia-300">{Math.round(magnetAngleDeg)} deg</span>
            </label>
            <input type="range" min={-180} max={180} step={1} value={magnetAngleDeg} onChange={(e) => onMagnetAngle(Number(e.target.value))} className="w-full" />
            <p className="exo text-xs text-slate-300 mt-2">Drag the magnet in canvas to reposition field source.</p>
          </section>
        )}

        {mode === "em-wave" && (
          <section className="panel-glass rounded-lg p-3 border border-cyan-500/30">
            <h3 className="orbitron text-sm font-bold text-cyan-300 mb-2">Wave Controls</h3>
            <label className="exo text-xs text-slate-300 flex justify-between mb-1">
              <span>Amplitude</span>
              <span className="text-cyan-300">{Math.round(waveAmplitude)} px</span>
            </label>
            <input type="range" min={20} max={160} step={2} value={waveAmplitude} onChange={(e) => onWaveAmplitude(Number(e.target.value))} className="w-full" />
            <label className="exo text-xs text-slate-300 flex justify-between mb-1 mt-3">
              <span>Wavelength</span>
              <span className="text-cyan-300">{Math.round(waveWavelength)} px</span>
            </label>
            <input type="range" min={80} max={420} step={4} value={waveWavelength} onChange={(e) => onWaveWavelength(Number(e.target.value))} className="w-full" />
          </section>
        )}

        {selectedCharge && (
          <section className="panel-glass rounded-lg p-3 border border-blue-500/30">
            <h3 className="orbitron text-sm font-bold text-blue-300 mb-2">Selected Charge</h3>
            <p className="exo text-xs text-slate-300 mb-2">Polarity: {selectedCharge.polarity > 0 ? "Positive" : "Negative"}</p>
            <label className="exo text-xs text-slate-300 flex justify-between mb-1">
              <span>Magnitude</span>
              <span className="text-blue-400">{(selectedCharge.magnitude * 1e6).toFixed(2)} uC</span>
            </label>
            <input type="range" min={0.2} max={5} step={0.1} value={Number((selectedCharge.magnitude * 1e6).toFixed(1))} onChange={(e) => onSelectedChargeMagnitude(Number(e.target.value))} className="w-full" />
          </section>
        )}

        <section>
          <h3 className="orbitron text-sm font-bold text-blue-300 mb-3">Field Visualization</h3>
          <div className="space-y-4">
            <div>
              <label className="exo text-xs text-slate-300 flex justify-between mb-1">
                <span>Field Line Density</span>
                <span className="text-blue-400">{fieldDensity}</span>
              </label>
              <input type="range" min={4} max={24} value={fieldDensity} onChange={(e) => onFieldDensity(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="exo text-xs text-slate-300 flex justify-between mb-1">
                <span>Animation Speed</span>
                <span className="text-blue-400">{animSpeed.toFixed(1)}x</span>
              </label>
              <input type="range" min={0.1} max={3} step={0.1} value={animSpeed} onChange={(e) => onAnimSpeed(Number(e.target.value))} className="w-full" />
            </div>
            <ToggleRow label="Show Vectors" enabled={showVectors} onToggle={onToggleVectors} />
            <ToggleRow label="Show Grid" enabled={showGrid} onToggle={onToggleGrid} />
            <ToggleRow label="Test Particle" enabled={testParticleEnabled} onToggle={onToggleTestParticle} />
            <ToggleRow label="Quiz Mode" enabled={quizMode} onToggle={onToggleQuizMode} />
          </div>
        </section>

        <section className="panel-glass rounded-lg p-3 border border-blue-500/30">
          <h3 className="orbitron text-sm font-bold text-blue-300 mb-2">Physics Data</h3>
          <div className="space-y-1 exo text-xs">
            <MetricRow label="Total Charges" value={String(totalCharges)} />
            <MetricRow label="Net Charge" value={netCharge} />
            <MetricRow label="Field (Center)" value={fieldStrength} />
            <MetricRow label="Potential (Center)" value={centerPotential} />
          </div>
        </section>
      </div>
    </aside>
  );
}

function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="exo text-xs text-slate-300">{label}</span>
      <button onClick={onToggle} className={`w-12 h-6 rounded-full relative transition-all ${enabled ? "bg-blue-600" : "bg-slate-600"}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? "right-1" : "left-1"}`} />
      </button>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-400">{label}:</span>
      <span className="text-blue-300 text-right">{value}</span>
    </div>
  );
}

interface CanvasAreaProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  showGrid: boolean;
  probe: { visible: boolean; screenX: number; screenY: number; x: number; y: number; directionDeg: number };
  probeFieldText: string;
  handlers: {
    onContextMenu: (event: MouseEvent<HTMLCanvasElement>) => void;
    onPointerDown: (event: PointerEvent<HTMLCanvasElement>) => void;
    onPointerMove: (event: PointerEvent<HTMLCanvasElement>) => void;
    onPointerUp: (event: PointerEvent<HTMLCanvasElement>) => void;
    onPointerLeave: () => void;
  };
}

export function CanvasArea({ canvasRef, showGrid, probe, probeFieldText, handlers }: CanvasAreaProps) {
  return (
    <div className="flex-1 canvas-container relative overflow-hidden min-h-[45vh] lg:min-h-0">
      <div className={`absolute inset-0 grid-overlay pointer-events-none transition-opacity ${showGrid ? "opacity-100" : "opacity-0"}`} />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
        onPointerUp={handlers.onPointerUp}
        onContextMenu={handlers.onContextMenu}
        onPointerDown={handlers.onPointerDown}
        onPointerMove={handlers.onPointerMove}
        onPointerCancel={handlers.onPointerLeave}
        onPointerLeave={handlers.onPointerLeave}
      />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 panel-glass rounded-xl px-4 py-2 max-w-[94%]">
        <p className="exo text-xs md:text-sm text-center text-slate-200">
          Electric: tap/click to add, drag to move, right-click to remove. Magnetic: drag magnet to move field.
        </p>
      </div>
      {probe.visible && (
        <div className="absolute panel-glass rounded-lg p-3 pointer-events-none z-30 min-w-44" style={{ left: probe.screenX, top: probe.screenY }}>
          <div className="orbitron text-xs text-blue-300 mb-2">Field Probe</div>
          <div className="space-y-1 exo text-xs">
            <MetricRow label="Position" value={`(${Math.round(probe.x)}, ${Math.round(probe.y)})`} />
            <MetricRow label="E-Field" value={probeFieldText} />
            <MetricRow label="Direction" value={`${probe.directionDeg.toFixed(1)} deg`} />
          </div>
        </div>
      )}
    </div>
  );
}

interface EducationPanelProps {
  open: boolean;
  infoText: string;
  onClose: () => void;
}

export function EducationPanel({ open, infoText, onClose }: EducationPanelProps) {
  if (!open) return null;
  return (
    <div className="absolute inset-y-0 right-0 w-full sm:w-[30rem] panel-glass p-5 sm:p-6 overflow-y-auto z-40">
      <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center">X</button>
      <div className="pr-8">
        <h2 className="orbitron text-lg sm:text-xl font-bold text-blue-400 glow-text mb-4">University EM Guide</h2>
        <div className="space-y-6 exo text-sm text-slate-200">
          <section>
            <h3 className="text-blue-300 font-semibold mb-2">Core Focus</h3>
            <p className="leading-relaxed">{infoText}</p>
          </section>
          <section className="panel-glass rounded-lg p-4 border border-yellow-500/30">
            <h3 className="text-yellow-400 font-semibold mb-2">Coulomb&apos;s Law</h3>
            <div className="bg-slate-900 rounded p-3 font-mono text-center text-lg text-white">F = k * (q1 * q2) / r^2</div>
          </section>
          <section className="panel-glass rounded-lg p-4 border border-green-500/30">
            <h3 className="text-green-300 font-semibold mb-2">Faraday&apos;s Law</h3>
            <div className="bg-slate-900 rounded p-3 font-mono text-center text-lg text-white">EMF = - dPhi_B / dt</div>
          </section>
        </div>
      </div>
    </div>
  );
}

interface QuizPanelProps {
  open: boolean;
  question: QuizQuestion;
  index: number;
  total: number;
  score: number;
  feedback: string | null;
  locked: boolean;
  onStart: () => void;
  onAnswer: (index: number) => void;
  onNext: () => void;
}

export function QuizPanel({ open, question, index, total, score, feedback, locked, onStart, onAnswer, onNext }: QuizPanelProps) {
  if (!open) return null;
  return (
    <div className="absolute right-2 left-2 sm:left-auto sm:right-4 bottom-3 w-auto sm:w-[26rem] panel-glass p-4 z-30 border border-amber-400/30">
      <div className="flex items-center justify-between mb-2">
        <h3 className="orbitron text-sm text-amber-300 font-bold">Quiz Mode</h3>
        <span className="exo text-xs text-slate-300">{index + 1}/{total} | Score: {score}</span>
      </div>
      <p className="exo text-sm text-slate-100 mb-3">{question.prompt}</p>
      <div className="space-y-2">
        {question.options.map((option, i) => (
          <button key={option} disabled={locked} onClick={() => onAnswer(i)} className="w-full text-left exo text-xs rounded-md border border-slate-500 bg-slate-900/60 px-3 py-2 hover:bg-slate-800 disabled:opacity-60">{option}</button>
        ))}
      </div>
      {feedback && <p className="exo text-xs mt-3 text-blue-200">{feedback}</p>}
      <div className="flex gap-2 mt-3">
        <button onClick={onStart} className="px-3 py-2 rounded bg-slate-700 exo text-xs border border-slate-500">Restart</button>
        <button onClick={onNext} disabled={!locked} className="px-3 py-2 rounded btn-cyber exo text-xs disabled:opacity-60">Next</button>
      </div>
    </div>
  );
}
