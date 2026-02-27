import { CanvasArea, ControlPanel, EducationPanel, Header, QuizPanel } from "./components/Layout";
import { useCanvasEngine } from "./hooks/useCanvasEngine";
import { useSimulationState } from "./hooks/useSimulationState";
import { useState } from "react";

function App() {
  const [controlsOpen, setControlsOpen] = useState(true);
  const currentYear = new Date().getFullYear();
  const state = useSimulationState();
  const engine = useCanvasEngine({
    mode: state.mode,
    charges: state.charges,
    fieldDensity: state.fieldDensity,
    animSpeed: state.animSpeed,
    showVectors: state.showVectors,
    selectedChargeId: state.selectedChargeId,
    testParticleEnabled: state.testParticleEnabled,
    magnet: state.magnet,
    wave: state.wave,
    onAddCharge: state.addCharge,
    onSelectCharge: state.setSelectedChargeId,
    onDeleteCharge: state.deleteCharge,
    onMoveCharge: state.updateChargePosition,
    onMoveMagnet: (x, y) =>
      state.setMagnet((prev) => ({
        ...prev,
        x,
        y
      }))
  });

  const fieldStrength = state.centerFieldText(engine.canvasSize.width, engine.canvasSize.height);
  const centerPotential = state.centerPotentialText(engine.canvasSize.width, engine.canvasSize.height);

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ fontFamily: `${state.config.fontFamily}, sans-serif`, fontSize: `${state.config.fontSize}px` }}
    >
      <Header
        title={state.config.mainTitle}
        onLearn={() => state.setShowEducation(true)}
        onToggleControls={() => setControlsOpen((v) => !v)}
        controlsVisible={controlsOpen}
      />
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <ControlPanel
          className={`${
            controlsOpen
              ? "absolute inset-y-0 left-0 max-w-[88vw] z-30 h-full lg:relative lg:inset-auto lg:max-w-none lg:h-auto"
              : "hidden"
          }`}
          mode={state.mode}
          onModeChange={(nextMode) => {
            state.setMode(nextMode);
            setControlsOpen(false);
          }}
          addPolarity={state.addPolarity}
          onAddPolarity={state.setAddPolarity}
          onCreateDipole={() =>
            state.createDipole(
              Math.max(120, engine.canvasSize.width * 0.5),
              Math.max(120, engine.canvasSize.height * 0.5)
            )
          }
          onClearCharges={state.clearCharges}
          fieldDensity={state.fieldDensity}
          onFieldDensity={state.setFieldDensity}
          animSpeed={state.animSpeed}
          onAnimSpeed={state.setAnimSpeed}
          showVectors={state.showVectors}
          onToggleVectors={() => state.setShowVectors((v) => !v)}
          showGrid={state.showGrid}
          onToggleGrid={() => state.setShowGrid((v) => !v)}
          testParticleEnabled={state.testParticleEnabled}
          onToggleTestParticle={() => state.setTestParticleEnabled((v) => !v)}
          totalCharges={state.physicsSummary.totalCharges}
          netCharge={state.physicsSummary.netCharge}
          fieldStrength={fieldStrength}
          centerPotential={centerPotential}
          selectedCharge={state.selectedCharge}
          onSelectedChargeMagnitude={(micro) => {
            if (!state.selectedChargeId) return;
            state.updateChargeMagnitudeMicro(state.selectedChargeId, micro);
          }}
          quizMode={state.quizMode}
          onToggleQuizMode={() => {
            if (!state.quizMode) {
              state.startQuiz();
            } else {
              state.setQuizMode(false);
            }
          }}
          magnetStrength={state.magnet.strength}
          onMagnetStrength={(value) =>
            state.setMagnet((prev) => ({
              ...prev,
              strength: value
            }))
          }
          magnetAngleDeg={state.magnet.angleDeg}
          onMagnetAngle={(value) =>
            state.setMagnet((prev) => ({
              ...prev,
              angleDeg: value
            }))
          }
          waveAmplitude={state.wave.amplitude}
          onWaveAmplitude={(value) =>
            state.setWave((prev) => ({
              ...prev,
              amplitude: value
            }))
          }
          waveWavelength={state.wave.wavelength}
          onWaveWavelength={(value) =>
            state.setWave((prev) => ({
              ...prev,
              wavelength: value
            }))
          }
        />

        <CanvasArea
          canvasRef={engine.canvasRef}
          showGrid={state.showGrid}
          probe={engine.probe}
          probeFieldText={engine.probeFieldText}
          handlers={{
            onContextMenu: engine.handleContextMenu,
            onPointerDown: engine.handlePointerDown,
            onPointerMove: engine.handlePointerMove,
            onPointerUp: engine.handlePointerUp,
            onPointerLeave: engine.handlePointerLeave
          }}
        />

        <EducationPanel
          open={state.showEducation}
          infoText={state.config.infoText}
          onClose={() => state.setShowEducation(false)}
        />
        <QuizPanel
          open={state.quizMode}
          question={state.currentQuestion}
          index={state.quizIndex}
          total={state.quizTotal}
          score={state.quizScore}
          feedback={state.quizFeedback}
          locked={state.quizLocked}
          onStart={state.startQuiz}
          onAnswer={state.submitQuizAnswer}
          onNext={state.nextQuizQuestion}
        />
      </main>
      <footer className="shrink-0 border-t border-slate-800/80 bg-slate-950/90 px-4 py-2 text-center exo text-xs text-slate-300">
        © {currentYear} Made with ❤️ by Mofetoluwa
      </footer>
    </div>
  );
}

export default App;
