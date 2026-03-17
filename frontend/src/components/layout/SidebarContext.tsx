"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize state on mount
  useEffect(() => {
    setIsMounted(true);
    // On mobile (<1024px), sidebar should ALWAYS be hidden by default
    // On desktop, we respect localStorage
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    } else {
      const stored = localStorage.getItem("sidebarHidden");
      if (stored === "true") {
        setIsOpen(false);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const next = !prev;
      localStorage.setItem("sidebarHidden", String(!next));
      return next;
    });
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      <div className={!isMounted ? "invisible" : ""}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarToggle({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={`h-10 w-10 shrink-0 text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-text-primary)] shadow-none rounded-md ${className || ""}`}
      aria-label="Toggle Sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
