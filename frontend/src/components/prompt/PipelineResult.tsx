"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Copy, Play, CheckCircle2, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PipelineResponse, ScoreDetails } from "@/types/api";
import apiClient from "@/lib/api";
import { toast } from "sonner";

/** Score badge color by value. */
function getScoreColor(score: number): string {
  if (score >= 9) return "text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950";
  if (score >= 7) return "text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950";
  return "text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950";
}

/** Task type label badge. */
function getTaskTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    blog: "Blog / Content",
    coding: "Coding / Dev",
    agent: "Agent / Automation",
    general: "General",
  };
  return labels[type] || type;
}

interface PipelineResultProps {
  result: PipelineResponse;
  onTestClick: () => void;
}

type PromptTab = "final" | "improved" | "draft";

/**
 * Displays the full pipeline result with tabbed prompt views,
 * quality score, analysis details, and user feedback.
 */
export const PipelineResult: React.FC<PipelineResultProps> = React.memo(({
  result,
  onTestClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<PromptTab>("final");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const currentPrompt = useMemo(() => {
    switch (activeTab) {
      case "draft": return result.draft;
      case "improved": return result.improved;
      case "final": return result.final_prompt;
      default: return result.final_prompt;
    }
  }, [activeTab, result]);

  /** Highlight {$VARIABLE} patterns in prompt text. */
  const renderHighlightedPrompt = useMemo(() => {
    if (!currentPrompt) return null;
    if (!result.variables.length) {
      return <span className="whitespace-pre-wrap font-mono text-[14px] leading-relaxed text-[var(--color-text-primary)]">{currentPrompt}</span>;
    }

    const parts = currentPrompt.split(/(\{\$[A-Z][A-Z0-9_ ]*\})/g);

    return parts.map((part, index) => {
      const isVariable = /^\{\$[A-Z][A-Z0-9_ ]*\}$/.test(part);
      if (isVariable) {
        return (
          <span
            key={index}
            className="inline-flex items-center rounded-sm bg-[var(--color-text-primary)] px-1.5 py-0.5 text-[0.9em] font-medium text-[var(--color-ui-bg)] mx-0.5 font-mono"
            title={`Variable: ${part}`}
          >
            {part}
          </span>
        );
      }
      return <span key={index} className="font-mono text-[14px] leading-relaxed text-[var(--color-text-primary)]">{part}</span>;
    });
  }, [currentPrompt, result.variables]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentPrompt]);

  const handleRating = useCallback(async (rating: number) => {
    setUserRating(rating);
    try {
      await apiClient.post(`history/${result.id}/feedback/`, {
        rating,
        feedback: "",
      });
      setFeedbackSubmitted(true);
      toast.success("Thanks for your feedback!");
    } catch {
      toast.error("Failed to submit feedback.");
    }
  }, [result.id]);

  if (!result) return null;

  const tabs: { key: PromptTab; label: string }[] = [
    { key: "final", label: "Final" },
    { key: "improved", label: "Improved" },
    { key: "draft", label: "Draft" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Pipeline Metadata Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Task Type Badges */}
        {result.task_type?.map((type, i) => (
          <span key={i} className="inline-flex items-center rounded-md border border-[var(--color-ui-border)] bg-[var(--color-ui-bg)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
            {getTaskTypeLabel(type)}
          </span>
        ))}

        {/* Score Badge */}
        <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-bold tracking-wide ${getScoreColor(result.score)}`}>
          Score: {result.score.toFixed(1)}/10
        </span>

        {/* Version Badge */}
        <span className="inline-flex items-center rounded-md border border-[var(--color-ui-border)] bg-[var(--color-ui-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-text-secondary)]">
          v{result.version}
        </span>

        {/* Metrics Badge */}
        {(result.tokens || result.latency_ms) ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ui-border)] bg-[var(--color-ui-bg)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
            {result.tokens && <span>{result.tokens} tokens</span>}
            {(result.tokens && result.latency_ms) ? <span className="text-[var(--color-ui-border)]">|</span> : null}
            {result.latency_ms && <span>{(result.latency_ms / 1000).toFixed(2)}s</span>}
          </span>
        ) : null}

        {/* Analysis Toggle */}
        <button
          onClick={() => setShowAnalysis(prev => !prev)}
          className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ui-border)] bg-[var(--color-ui-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] transition-colors uppercase tracking-widest"
          aria-label="Toggle analysis details"
        >
          Analysis
          {showAnalysis ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Analysis Collapsible */}
      {showAnalysis && result.analysis && (
        <div className="rounded-[8px] border border-[var(--color-ui-border)] bg-[var(--color-ui-bg)] p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-3">
            Task Analysis
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
            <div>
              <span className="font-semibold text-[var(--color-text-primary)]">Goal: </span>
              <span className="text-[var(--color-text-secondary)]">{result.analysis.goal}</span>
            </div>
            <div>
              <span className="font-semibold text-[var(--color-text-primary)]">Audience: </span>
              <span className="text-[var(--color-text-secondary)]">{result.analysis.audience}</span>
            </div>
            <div>
              <span className="font-semibold text-[var(--color-text-primary)]">Tone: </span>
              <span className="text-[var(--color-text-secondary)]">{result.analysis.tone}</span>
            </div>
            <div>
              <span className="font-semibold text-[var(--color-text-primary)]">Format: </span>
              <span className="text-[var(--color-text-secondary)]">{result.analysis.format}</span>
            </div>
            {result.analysis.constraints.length > 0 && (
              <div className="sm:col-span-2">
                <span className="font-semibold text-[var(--color-text-primary)]">Constraints: </span>
                <span className="text-[var(--color-text-secondary)]">{result.analysis.constraints.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Score Criteria Breakdown */}
          {result.score_details?.criteria && (
            <div className="mt-4 pt-3 border-t border-[var(--color-ui-border)]">
              <h5 className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-2">Score Breakdown</h5>
              <div className="flex flex-wrap gap-3">
                {Object.entries(result.score_details.criteria).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-1.5 text-[12px]">
                    <span className="font-medium text-[var(--color-text-primary)] capitalize">{key}:</span>
                    <span className="text-[var(--color-text-secondary)]">{String(value)}/10</span>
                  </div>
                ))}
              </div>
              {result.score_details.feedback && (
                <p className="mt-2 text-[12px] text-[var(--color-text-secondary)] italic">
                  {result.score_details.feedback}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Prompt Card */}
      <div className="rounded-[8px] bg-[var(--color-ui-card)] border border-[var(--color-ui-border)] shadow-none overflow-hidden">

        {/* Header Row: Tabs + Actions */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 md:px-8 pt-6 pb-4 border-b border-[var(--color-ui-border)] gap-4">

          {/* Tabs */}
          <div className="flex items-center gap-0 border border-[var(--color-ui-border)] rounded-md overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  activeTab === tab.key
                    ? "bg-[var(--color-text-primary)] text-[var(--color-ui-bg)]"
                    : "bg-[var(--color-ui-bg)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
                aria-label={`View ${tab.label} prompt`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTestClick}
              className="h-8 rounded border-[var(--color-ui-border)] bg-[var(--color-ui-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-ui-bg)] transition-colors shadow-none uppercase tracking-widest text-[11px] font-semibold"
              aria-label="Test prompt"
            >
              <Play className="mr-2 h-3.5 w-3.5 fill-current" />
              Test Run
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 rounded border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--color-ui-bg)] hover:bg-[var(--color-brand-primary-hover)] transition-colors shadow-none uppercase tracking-widest text-[11px] font-semibold"
              aria-label={copied ? "Copied to clipboard" : "Copy prompt"}
            >
              {copied ? (
                <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
              ) : (
                <Copy className="mr-2 h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Prompt Content */}
        <div className="p-6 md:p-8">
          <div className="bg-[var(--color-ui-bg)] border border-[var(--color-ui-border)] rounded p-5 md:p-6">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap m-0">
                {renderHighlightedPrompt}
              </p>
            </div>
          </div>
        </div>

        {/* User Rating Bar */}
        <div className="px-6 md:px-8 pb-6 flex items-center justify-between border-t border-[var(--color-ui-border)] pt-4">
          <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">
            Rate this prompt
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                disabled={feedbackSubmitted}
                className="p-0.5 transition-colors disabled:cursor-default"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`h-4 w-4 transition-colors ${
                    star <= (hoveredStar || userRating)
                      ? "fill-[var(--color-text-primary)] text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-placeholder)]"
                  }`}
                />
              </button>
            ))}
            {feedbackSubmitted && (
              <span className="ml-2 text-[11px] text-[var(--color-text-secondary)]">
                <CheckCircle2 className="inline h-3 w-3 mr-0.5" /> Recorded
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

PipelineResult.displayName = "PipelineResult";
