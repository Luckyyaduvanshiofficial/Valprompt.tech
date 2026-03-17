import React, { useState } from "react";
import { Loader2, Play, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/api";

interface TestPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  variables: string[];
}

export const TestPromptModal: React.FC<TestPromptModalProps> = ({
  isOpen,
  onClose,
  prompt,
  variables,
}) => {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setVariableValues({});
      setResult(null);
      setError(null);
    }
  }, [isOpen]);

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiClient.post("test/", {
        prompt,
        variable_values: variableValues,
      });
      setResult(response.data.output);
    } catch (err: any) {
      setError(err.message || "Failed to test prompt. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = variables.every((v) => variableValues[v]?.trim().length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden shadow-none rounded-[8px] border-[var(--color-ui-border)] bg-[var(--color-ui-card)]">
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold text-[var(--color-text-primary)]">
              Test Prompt
            </DialogTitle>
            <DialogDescription className="text-[var(--color-text-secondary)] mt-2">
              Provide values for your variables to see how the AI responds.
            </DialogDescription>
          </DialogHeader>

          {variables.length > 0 && (
            <div className="space-y-5 mb-8">
              {variables.map((variable) => (
                <div key={variable} className="flex flex-col gap-2">
                  <Label htmlFor={`var-${variable}`} className="text-sm font-medium text-[var(--color-text-primary)]">
                    {variable}
                  </Label>
                  <Input
                    id={`var-${variable}`}
                    placeholder={`Enter value...`}
                    value={variableValues[variable] || ""}
                    onChange={(e) =>
                      setVariableValues((prev) => ({
                        ...prev,
                        [variable]: e.target.value,
                      }))
                    }
                    className="border-[var(--color-ui-border)] focus-visible:ring-1 focus-visible:ring-[var(--color-text-primary)] focus-visible:border-[var(--color-text-primary)] transition-all text-[var(--color-text-primary)] bg-[var(--color-ui-card)] shadow-none h-10 rounded-md"
                  />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex gap-3 text-red-600">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="mb-2">
              <div className="rounded-[12px] bg-[var(--color-ui-bg)] border border-[var(--color-ui-border)] p-5">
                <h4 className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                  AI Response
                </h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap m-0 font-medium leading-relaxed">{result}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-[var(--color-ui-bg)] px-6 md:px-8 py-4 border-t border-[var(--color-ui-border)] flex sm:justify-between items-center sm:space-x-4">
          <Button variant="ghost" onClick={onClose} className="text-[var(--color-text-secondary)] hover:bg-[var(--color-ui-border)]/50 hover:text-[var(--color-text-primary)]">
            Cancel
          </Button>
          <Button
            onClick={handleTest}
            disabled={(!isFormValid && variables.length > 0) || isLoading}
            className="rounded bg-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary-hover)] text-[var(--color-ui-bg)] min-w-[120px] shadow-none transition-all uppercase tracking-widest text-[11px] font-semibold"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4 fill-current" />
            )}
            Run Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

TestPromptModal.displayName = "TestPromptModal";
