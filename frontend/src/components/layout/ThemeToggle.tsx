"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-full h-10 ${className || ""}`} />;
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      className={`w-full justify-start text-left font-normal h-auto py-2.5 px-3 rounded-md hover:bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all ${className || ""}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <>
          <Sun className="mr-3 h-4 w-4 shrink-0 transition-opacity" />
          <span className="truncate text-[14px] leading-relaxed font-medium">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="mr-3 h-4 w-4 shrink-0 transition-opacity" />
          <span className="truncate text-[14px] leading-relaxed font-medium">Dark Mode</span>
        </>
      )}
    </Button>
  );
}
