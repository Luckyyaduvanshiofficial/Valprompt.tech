import React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  text?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = React.memo(({
  isLoading,
  text = "Generate Prompt",
  className,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "relative overflow-hidden rounded font-semibold transition-all duration-300 outline-none",
        "bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-[var(--color-ui-bg)] shadow-none border border-[var(--color-brand-primary)] ring-0",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-brand-primary)]",
        isLoading && "opacity-90 cursor-wait",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-ui-bg)]" />
        ) : null}
        <span className="tracking-widest uppercase">{isLoading ? "Engineering..." : text}</span>
      </div>
    </Button>
  );
});

GenerateButton.displayName = "GenerateButton";
