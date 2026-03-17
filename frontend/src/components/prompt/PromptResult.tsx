import React, { useMemo } from "react";
import { Copy, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptResultProps {
  prompt: string;
  variables: string[];
  onTestClick: () => void;
}

export const PromptResult: React.FC<PromptResultProps> = React.memo(({
  prompt,
  variables,
  onTestClick
}) => {
  const [copied, setCopied] = React.useState(false);

  // Function to highlight variables in the prompt text
  const renderHighlightedPrompt = useMemo(() => {
    if (!prompt) return null;
    if (variables.length === 0) return <span className="whitespace-pre-wrap font-mono text-[14px] leading-relaxed text-[var(--color-text-primary)]">{prompt}</span>;

    const parts = prompt.split(/(\{\{[^}]+\}\})/g);

    return parts.map((part, index) => {
      const isVariable = part.startsWith("{{") && part.endsWith("}}");
      const varName = isVariable ? part.slice(2, -2).trim() : null;
      const isKnownVar = varName && variables.includes(varName);

      if (isKnownVar) {
        return (
          <span 
            key={index} 
            className="inline-flex items-center rounded-sm bg-[var(--color-text-primary)] px-1.5 py-0.5 text-[0.9em] font-medium text-[var(--color-ui-bg)] mx-0.5 font-mono"
            title={`Variable: ${varName}`}
          >
            {part}
          </span>
        );
      }
      
      return <span key={index} className="font-mono text-[14px] leading-relaxed text-[var(--color-text-primary)]">{part}</span>;
    });
  }, [prompt, variables]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!prompt) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[8px] bg-[var(--color-ui-card)] border border-[var(--color-ui-border)] shadow-none p-6 md:p-8 relative overflow-hidden">
        
        <div className="relative z-10 flex items-center justify-between mb-6 border-b border-[var(--color-ui-border)] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-text-primary)]" />
            <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">
              Generated Template
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
             <Button 
              variant="outline" 
              size="sm" 
              onClick={onTestClick}
              className="h-8 rounded border-[var(--color-ui-border)] bg-[var(--color-ui-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-ui-bg)] transition-colors shadow-none uppercase tracking-widest text-[11px] font-semibold"
            >
              <Play className="mr-2 h-3.5 w-3.5 fill-current" />
              Test Run
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="h-8 rounded border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--color-ui-bg)] hover:bg-[var(--color-brand-primary-hover)] transition-colors shadow-none uppercase tracking-widest text-[11px] font-semibold"
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
        
        <div className="relative z-10 bg-[var(--color-ui-bg)] border border-[var(--color-ui-border)] rounded p-5 md:p-6">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap m-0">
              {renderHighlightedPrompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

PromptResult.displayName = "PromptResult";
