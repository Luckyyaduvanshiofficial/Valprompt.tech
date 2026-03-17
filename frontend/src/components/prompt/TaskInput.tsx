import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TaskInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TaskInput = React.forwardRef<HTMLTextAreaElement, TaskInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    // Combine refs
    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [ref]
    );

    // Auto-resize logic
    useEffect(() => {
      const textarea = internalRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const scrollHeight = textarea.scrollHeight;
        
        if (scrollHeight > 350) {
          textarea.style.height = '350px';
          textarea.style.overflowY = 'auto'; // Internal scroll only when max reached
        } else {
          textarea.style.height = `${scrollHeight}px`;
          textarea.style.overflowY = 'hidden'; // Hide internal scroll, let page scroll
        }
      }
    }, [value]);

    return (
      <textarea
        ref={setRefs}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full resize-none overflow-y-hidden bg-transparent tracking-normal focus:ring-0",
          "text-[1.125rem] md:text-[1.25rem] font-normal leading-relaxed text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)]",
          "transition-colors duration-300 focus:outline-none",
          "p-4 min-h-[60px] max-h-[350px]",
          className
        )}
        rows={1}
        {...props}
      />
    );
  }
);

TaskInput.displayName = "TaskInput";
