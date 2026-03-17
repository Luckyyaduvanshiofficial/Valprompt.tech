import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VariableInputProps {
  variables: string[];
  onChange: (variables: string[]) => void;
  disabled?: boolean;
}

export const VariableInput: React.FC<VariableInputProps> = React.memo(({
  variables,
  onChange,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !variables.includes(trimmed)) {
      onChange([...variables, trimmed]);
    }
    setInputValue("");
  };

  const handleRemove = (variableToRemove: string) => {
    onChange(variables.filter((v) => v !== variableToRemove));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {variables.map((variable) => (
          <div
            key={variable}
            className="flex items-center gap-1.5 rounded-md bg-[var(--color-ui-card)] border border-[var(--color-text-primary)] px-3 py-1 text-[13px] font-medium text-[var(--color-text-primary)] transition-colors"
          >
            <span>{variable}</span>
            <button
              type="button"
              onClick={() => handleRemove(variable)}
              disabled={disabled}
              className="ml-0.5 rounded-sm opacity-60 hover:opacity-100 hover:bg-[var(--color-text-primary)] hover:text-[var(--color-ui-bg)] transition-all focus:outline-none disabled:opacity-30 p-0.5"
              aria-label={`Remove variable ${variable}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <form 
        onSubmit={handleAdd} 
        className="flex items-center gap-2"
      >
        <div className="relative flex-1 max-w-[280px]">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={disabled}
            placeholder="Add variable (e.g. tone)"
            className="w-full rounded-md bg-[var(--color-ui-card)] border border-[var(--color-ui-border)] focus:bg-[var(--color-ui-card)] px-3 py-2 text-[14px] outline-none transition-all duration-200 focus:border-[var(--color-text-primary)] disabled:opacity-50 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdd(e);
              }
            }}
          />
        </div>
        <Button
          type="submit"
          disabled={!inputValue.trim() || disabled}
          size="sm"
          variant="outline"
          className="h-[38px] w-[38px] rounded-md p-0 border-[var(--color-ui-border)] hover:border-[var(--color-text-primary)] bg-[var(--color-ui-card)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-ui-bg)] text-[var(--color-text-primary)] disabled:opacity-50 transition-colors shadow-none"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
});

VariableInput.displayName = "VariableInput";
