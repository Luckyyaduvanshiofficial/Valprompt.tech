"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

/** Pipeline stages with estimated durations. */
const PIPELINE_STAGES = [
  { label: "Analyzing task", duration: 3000 },
  { label: "Classifying task type", duration: 2000 },
  { label: "Enhancing context", duration: 1000 },
  { label: "Selecting strategy", duration: 500 },
  { label: "Generating draft prompt", duration: 8000 },
  { label: "Improving prompt", duration: 8000 },
  { label: "Scoring quality", duration: 4000 },
  { label: "Finalizing", duration: 2000 },
];

interface PipelineProgressProps {
  isActive: boolean;
}

/**
 * Animated pipeline progress indicator shown during prompt generation.
 * Cycles through stages with estimated timing to show pipeline activity.
 */
export const PipelineProgress: React.FC<PipelineProgressProps> = React.memo(({ isActive }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentStage(0);
      return;
    }

    let timeout: NodeJS.Timeout;
    let stage = 0;

    const advanceStage = () => {
      if (stage < PIPELINE_STAGES.length - 1) {
        stage += 1;
        setCurrentStage(stage);
        timeout = setTimeout(advanceStage, PIPELINE_STAGES[stage].duration);
      }
    };

    timeout = setTimeout(advanceStage, PIPELINE_STAGES[0].duration);
    return () => clearTimeout(timeout);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="rounded-[8px] border border-[var(--color-ui-border)] bg-[var(--color-ui-bg)] p-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Loader2 className="h-4 w-4 animate-spin text-[var(--color-text-primary)]" />
        <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--color-text-primary)]">
          Pipeline Running
        </span>
      </div>

      <div className="space-y-2">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isComplete = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <div
              key={stage.label}
              className={`flex items-center gap-2.5 text-[13px] transition-all duration-300 ${
                isComplete
                  ? "text-[var(--color-text-secondary)]"
                  : isCurrent
                    ? "text-[var(--color-text-primary)] font-medium"
                    : "text-[var(--color-text-placeholder)]"
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-secondary)]" />
              ) : isCurrent ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-[var(--color-text-placeholder)]" />
              )}
              <span>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

PipelineProgress.displayName = "PipelineProgress";
