"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { Plus, MessageSquare, Trash2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api";
import { PromptHistory } from "@/types/api";
import { useSidebar } from "./SidebarContext";
import { ThemeToggle } from "./ThemeToggle";

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

export function Sidebar() {
  const pathname = usePathname();
  
  const { data, error, isLoading, mutate } = useSWR<{ results: PromptHistory[] }>(
    "history/",
    fetcher
  );

  const { isOpen, toggleSidebar } = useSidebar();

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`history/${id}/`);
      mutate();
    } catch (err) {
      console.error("Failed to delete history item", err);
    }
  };

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
            <span className="font-medium text-[14px]">New Prompt</span>
          </Button>
        </Link>
      </div>

      <div className="hidden lg:flex flex-1 overflow-y-auto flex-col w-full">
        <div className="px-6 pb-2 pt-4">
          <h3 className="text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Recent Prompts
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-4 w-4 animate-spin text-[var(--color-text-primary)]" />
          </div>
        ) : error ? (
          <div className="px-6 py-2 text-[13px] text-red-500/80">Failed to load history</div>
        ) : data?.results?.length === 0 ? (
          <div className="px-6 py-8 text-[13px] text-[var(--color-text-secondary)] text-center bg-transparent mx-4 rounded-lg">No recent prompts</div>
        ) : (
          <ul className="space-y-[2px] px-4 w-full pb-4">
            {data?.results?.map((item) => (
               <li key={item.id} className="group relative w-full">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal h-auto py-2.5 px-3 rounded-md hover:bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all"
                >
                  <MessageSquare className="mr-3 h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="truncate text-[14px] leading-relaxed font-medium">{item.task}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded border border-[var(--color-ui-border)] opacity-0 group-hover:opacity-100 hover:bg-[var(--color-text-primary)] hover:text-[var(--color-ui-bg)] hover:border-[var(--color-text-primary)] text-[var(--color-text-primary)] transition-all bg-[var(--color-ui-bg)] shadow-none"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  aria-label="Delete prompt"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer / Theme Toggle */}
      <div className="p-4 lg:p-6 pt-2 border-t border-[var(--color-ui-border)]">
        <ThemeToggle />
      </div>
      
      </aside>
    </>
  );
}
