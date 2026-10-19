import React, { useState, useEffect } from 'react';
import { RoutinePreset } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { Play, Pause, SkipForward, CheckCircle2, X, RefreshCw, Check } from 'lucide-react';

interface GuidedRoutineModalProps {
  routine: RoutinePreset;
  onClose: () => void;
  onFinishRoutine: (completedStepIds: string[]) => void;
}

export const GuidedRoutineModal: React.FC<GuidedRoutineModalProps> = ({
  routine,
  onClose,
  onFinishRoutine,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(
    (routine.steps[0]?.durationMinutes || 5) * 60
  );
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isDone, setIsDone] = useState<boolean>(false);

  const currentStep = routine.steps[currentStepIndex];
  const nextStep = routine.steps[currentStepIndex + 1];
  const totalSteps = routine.steps.length;

  // Sync timer when step changes
  useEffect(() => {
    if (currentStep) {
      setTimeLeft(currentStep.durationMinutes * 60);
      setIsActive(true);
    }
  }, [currentStepIndex, currentStep]);

  // Countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0 && !isDone) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            audioEngine.playChime(660);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && !isDone) {
      // Step automatically completed
      handleStepComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isDone]);

  const handleStepComplete = () => {
    audioEngine.playChime(528);
    const updated = Array.from(new Set([...completedStepIds, currentStep.id]));
    setCompletedStepIds(updated);

    if (currentStepIndex + 1 < totalSteps) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsDone(true);
      audioEngine.playCompleteCelebration();
      onFinishRoutine(updated);
    }
  };

  const handleSkip = () => {
    if (currentStepIndex + 1 < totalSteps) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsDone(true);
      onFinishRoutine(completedStepIds);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = currentStep
    ? ((currentStep.durationMinutes * 60 - timeLeft) / (currentStep.durationMinutes * 60)) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-xl">
      <div className="relative w-full max-w-xl p-8 rounded-3xl bg-stone-900/90 border border-white/15 shadow-2xl overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Exit Routine"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDone ? (
          <div className="space-y-6">
            {/* Header step counter & progress */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="text-amber-300 font-medium">{routine.name}</span>
                <span className="font-mono tabular-nums">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
              </div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-300 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Step Details */}
            <div className="space-y-2 text-center pt-2">
              <span className="text-xs uppercase tracking-widest text-amber-300/80 font-medium">
                {currentStep.category} · {currentStep.timeOfDay}
              </span>
              <h2 className="text-2xl font-bold text-white font-display tracking-tight">
                {currentStep.title}
              </h2>
              <p className="text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                {currentStep.description}
              </p>
            </div>

            {/* Big Countdown Timer */}
            <div className="relative flex flex-col items-center justify-center py-6">
              <div className="text-6xl font-extralight tracking-tight text-white font-mono tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              {/* Radial or linear step progress indicator */}
              <div className="w-48 bg-stone-800 h-1 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-amber-300 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setTimeLeft(currentStep.durationMinutes * 60)}
                className="p-3 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                title="Reset Step Timer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsActive(!isActive)}
                className="p-4 rounded-full bg-stone-800 hover:bg-stone-700 text-white transition-colors cursor-pointer"
                title={isActive ? 'Pause' : 'Resume'}
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <button
                onClick={handleStepComplete}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber-300 hover:bg-amber-200 text-stone-950 font-semibold text-sm transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                <Check className="w-4 h-4" />
                Complete Step
              </button>

              <button
                onClick={handleSkip}
                className="p-3 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                title="Skip to next step"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Up Next Preview */}
            {nextStep && (
              <div className="pt-4 border-t border-white/10 text-center">
                <span className="text-xs text-stone-400">Up Next:</span>{' '}
                <span className="text-xs text-stone-200 font-medium">
                  {nextStep.title} ({nextStep.durationMinutes} min)
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Finished State */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display">Routine Fulfilled</h2>
              <p className="text-sm text-stone-300 mt-2 max-w-sm mx-auto">
                You took dedicated time for your mind and body. Your consistency builds lasting sanctuary.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-stone-950/50 border border-white/10 text-xs text-stone-300 space-y-1">
              <div>
                Routine:{' '}
                <span className="font-semibold text-white">{routine.name}</span>
              </div>
              <div>
                Completed:{' '}
                <span className="font-mono tabular-nums text-amber-300">
                  {completedStepIds.length} of {totalSteps} steps
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-stone-950 font-semibold text-xs transition-colors cursor-pointer"
            >
              Return to Sanctuary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
