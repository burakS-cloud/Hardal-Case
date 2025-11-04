"use client";
import { HardalProvider } from "hardal/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HardalProvider
      config={{
        website: "cmhkztndw000bnfwrmx0po2mk",
        hostUrl: "https://app.usehardal.com/projects/cmh4luj0v0002i90xsk4b723m",
      }}
      autoPageTracking={true} // ✅ Tracks all route changes
    >
      {children}
    </HardalProvider>
  );
}
