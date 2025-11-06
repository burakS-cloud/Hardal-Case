"use client";
import { HardalProvider } from "hardal/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HardalProvider
      config={{
        website: "cmh4lut1e0008i90xj6hivu5r",
        hostUrl: "https://cmh4lut1e0008i90xj6hivu5r-signal.usehardal.com",
      }}
      autoPageTracking={true} // ✅ Tracks all route changes
    >
      {children}
    </HardalProvider>
  );
}
