"use client";

import Link from "next/link";
import { Plus, MessageSquare, Trash2, Loader2, Code2, FileText, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./SidebarContext";
import { ThemeToggle } from "./ThemeToggle";

/** Icon per task type. */
function TaskTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "blog": return <FileText className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />;
    case "coding": return <Code2 className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />;
    case "agent": return <Bot className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />;
    default: return <MessageSquare className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />;
  }
}

export function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] flex-shrink-0 border-r border-[var(--color-ui-border)] bg-[var(--color-ui-bg)] flex flex-col h-[100dvh] transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:z-40 ${
          isOpen ? "translate-x-0 lg:ml-0" : "-translate-x-full lg:translate-x-0 lg:-ml-[260px]"
        }`}>
      
      {/* Top Branding Section */}
      <div className="p-4 lg:p-6 pb-4">
        <Link href="/" className="flex items-center gap-2.5 group mb-6">
          <div className="w-8 h-8 rounded border border-[var(--color-text-primary)] bg-[var(--color-ui-card)] text-[var(--color-text-primary)] flex items-center justify-center transition-transform duration-300 shrink-0 group-hover:scale-105 shadow-none">
            <span className="font-bold text-[14px]">V</span>
          </div>
          <span className="font-semibold text-lg tracking-tight text-[var(--color-text-primary)] transition-colors duration-300">Velprompt</span>
        </Link>

        {/* New Prompt Button */}
        <Link href="/" className="w-full block">
          <Button className="w-full rounded-md bg-[var(--color-ui-card)] border border-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-ui-bg)] text-[var(--color-text-primary)] transition-all duration-200 shadow-none h-10 px-4 flex items-center justify-start gap-2 group" variant="outline">
            <Plus className="h-4 w-4 transition-colors" />
            <span className="font-medium text-[14px]">New Workspace</span>
          </Button>
        </Link>
      </div>

      <div className="hidden lg:flex flex-1 overflow-y-auto flex-col w-full justify-center items-center opacity-40">
        <Bot className="w-12 h-12 mb-4" />
        <p className="text-[12px] text-center px-8 font-medium leading-relaxed">
          AI generation telemetry is securely logged to internal databases strictly to refine engine behavior via Private Loop.
        </p>
      </div>

      {/* Footer / Theme Toggle */}
      <div className="p-4 lg:p-6 pt-2 border-t border-[var(--color-ui-border)]">
        <ThemeToggle />
      </div>
      
      </aside>
    </>
  );
}
