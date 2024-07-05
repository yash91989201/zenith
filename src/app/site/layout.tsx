// TYPES
import { Navigation } from "@/components/site/navigation";
import type React from "react";
// CUSTOM COMPONENTS
// import Navigation from "@/components/site/navigation";

export default function SiteLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    // <ClerkProvider appearance={{ baseTheme: dark }}>
    <main className="h-full">
      <Navigation />
      {children}
    </main>
    // </ClerkProvider>
  );
}
