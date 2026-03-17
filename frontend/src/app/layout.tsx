import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Velprompt | Engineering Precision",
  description: "Stop guessing. Start automating your prompts with structured, precision engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[var(--color-ui-bg)] text-[var(--color-text-primary)] min-h-screen selection:bg-[var(--color-brand-primary)] selection:text-white`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <Sidebar />
              <div className="flex-1 w-full min-w-0 relative transition-all duration-300 bg-[var(--color-ui-bg)]">
                {children}
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
        <Toaster theme="light" />
      </body>
    </html>
  );
}

