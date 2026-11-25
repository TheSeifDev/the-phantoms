"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "@/lib/lenis";
import { PageTransition } from "@/components/layout/PageTransition";
import { Preloader } from "@/components/layout/Preloader";
import { Navbar } from "@/components/layout/Navbar";
import { Cursor } from "@/components/ui/Brand";
import { Fx } from "@/components/ui/Fx";
import { Grain } from "@/components/ui/Grain";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

export function Providers({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <SmoothScroll>
        <PageTransition>
          <Preloader />
          <Navbar />
          <main id="main">{children}</main>
          {footer}
          <ScrollProgress />
          <Fx />
          <Grain />
          <Cursor />
        </PageTransition>
      </SmoothScroll>
    </ThemeProvider>
  );
}
