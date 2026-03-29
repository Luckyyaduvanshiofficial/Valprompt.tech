"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { useSWRConfig } from "swr";

import { TaskInput } from "@/components/prompt/TaskInput";
import { VariableInput } from "@/components/prompt/VariableInput";
import { GenerateButton } from "@/components/prompt/GenerateButton";
import { PipelineResult } from "@/components/prompt/PipelineResult";
import { PipelineProgress } from "@/components/prompt/PipelineProgress";
import { TestPromptModal } from "@/components/prompt/TestPromptModal";
import { SidebarToggle } from "@/components/layout/SidebarContext";
import apiClient from "@/lib/api";
import type { PipelineResponse } from "@/types/api";

const PLACEHOLDERS = [
  "Draft a persuasive email to a cold prospect regarding our enterprise security tool...",
  "Write an engaging blog post about the future of React Server Components...",
  "Analyze this Q3 financial report and summarize key growth drivers...",
  "Explain quantum computing principles to a highly technical high schooler..."
];

export default function Home() {
  const [task, setTask] = useState("");
  const [variables, setVariables] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PipelineResponse | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(70);

  // Typewriter effect for placeholder
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleType = () => {
      const currentFullText = PLACEHOLDERS[loopNum % PLACEHOLDERS.length];
      
      if (isDeleting) {
        setPlaceholderText(currentFullText.substring(0, placeholderText.length - 1));
        setTypingSpeed(20);
      } else {
        setPlaceholderText(currentFullText.substring(0, placeholderText.length + 1));
        setTypingSpeed(40 + Math.random() * 40);
      }

      if (!isDeleting && placeholderText === currentFullText) {
        setTypingSpeed(3000);
        setIsDeleting(true);
      } 
      else if (isDeleting && placeholderText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, loopNum, typingSpeed]);

  const { mutate } = useSWRConfig();

  const handleGenerate = async () => {
    if (!task.trim()) {
      toast.error("Task description is required to generate a prompt.");
      return;
    }
    if (task.length > 5000) {
      toast.error("Task description cannot exceed 5000 characters.");
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await apiClient.post<PipelineResponse>("generate/", {
        task,
        variables,
      });
      
      setResult(response.data);

      const scoreText = response.data.score >= 8 ? "High quality" : "Good quality";
      toast.success(`Prompt engineered! ${scoreText} (${response.data.score.toFixed(1)}/10)`);
      mutate("history/");

      // Scroll to output
      setTimeout(() => {
        document.getElementById("output-area")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to generate prompt. Please try again.";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-[100vh] w-full bg-[var(--color-ui-bg)] text-[var(--color-text-primary)] font-sans flex flex-col items-center">
      
      {/* Mobile Sticky Header */}
      <div className="lg:hidden sticky top-0 z-30 w-full flex items-center px-4 py-3 bg-[var(--color-ui-bg)]/90 backdrop-blur-sm border-b border-[var(--color-ui-border)]">
        <SidebarToggle />
        <span className="font-semibold text-[15px] ml-3 tracking-tight">Velprompt</span>
      </div>

      {/* Desktop Floating Toggle */}
      <div className="hidden lg:flex absolute top-6 left-6 z-30 items-center justify-center">
        <SidebarToggle className="border border-[var(--color-ui-border)] bg-[var(--color-ui-bg)] hover:bg-[var(--color-ui-card)] shadow-none" />
      </div>

      <main className="relative z-10 w-full max-w-[900px] mx-auto px-4 sm:px-8 py-8 md:py-16 min-h-full flex flex-col items-center">
        
        {/* Top Header / Hero Copy */}
        <div className="w-full mb-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex w-max items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-ui-bg)] border border-[var(--color-text-primary)] shadow-none mb-6">
            <span className="text-[11px] font-medium tracking-widest text-[var(--color-text-primary)] uppercase">Prompt Engineering Engine</span>
          </div>
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[var(--color-text-primary)] leading-[1.05] mb-6 max-w-2xl mx-auto">
            Engineer Precise<br/>Prompts
          </h1>
          <p className="text-[16px] md:text-[18px] text-[var(--color-text-primary)] leading-relaxed max-w-2xl mx-auto font-normal">
            Stop guessing. Start automating your prompts with structured, precision engineering. Build templates that guarantee exceptional output.
          </p>
        </div>

        {/* Main Generator Card */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150">
          <div className="bg-[var(--color-ui-bg)] rounded-[12px] shadow-none border border-[var(--color-text-secondary)] overflow-hidden transition-all duration-300">
            
            {/* Input Area */}
            <div className="p-1">
              <TaskInput
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder={`${placeholderText}${!isDeleting && placeholderText === PLACEHOLDERS[loopNum % PLACEHOLDERS.length] ? "" : "|"}`}
                disabled={isGenerating}
                className="min-h-[60px] text-[16px] md:text-[18px] font-normal border-none p-8 md:p-10 rounded-none bg-transparent transition-colors focus:bg-[var(--color-ui-bg)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] placeholder:opacity-70 resize-none"
              />
            </div>
            
            {/* Variables & Actions */}
            <div className="px-8 md:px-10 pb-8 pt-4 bg-[var(--color-ui-bg)] flex flex-col gap-6">
              
              <div className="flex flex-col gap-3 border-t border-[var(--color-text-secondary)] pt-6">
                <label className="text-[12px] font-semibold uppercase tracking-widest text-[var(--color-text-primary)] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[var(--color-text-primary)]" />
                  Variables
                </label>
                <VariableInput
                  variables={variables}
                  onChange={setVariables}
                  disabled={isGenerating}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 border-t border-transparent">
                <GenerateButton
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                  disabled={!task.trim()}
                  className="w-full sm:w-auto rounded px-8 py-6 h-auto text-[15px] uppercase tracking-wider font-semibold"
                  text="Generate Prompt"
                />
              </div>
            </div>

          </div>

          {/* Pipeline Progress */}
          {isGenerating && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <PipelineProgress isActive={isGenerating} />
            </div>
          )}

          {/* Pipeline Result Area */}
          {result && !isGenerating && (
            <div id="output-area" className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <PipelineResult
                result={result}
                onTestClick={() => setIsTestModalOpen(true)}
              />
            </div>
          )}
        </div>
        
      </main>

      {result && (
        <TestPromptModal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          prompt={result.final_prompt}
          variables={result.variables}
        />
      )}
    </div>
  );
}
