"use client";

import { useHardal } from "hardal/react";
import { useState } from "react";
import { generateRandomEcommerceData } from "../utils/generateDummyData";

// Helper to generate random e-commerce data

export function EventTrackingForm() {
  const { distinct } = useHardal();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SIGNAL_HOST = "https://cmh4lut1e0008i90xj6hivu5r-signal.usehardal.com";
  const SIGNAL_WEBSITE = "cmh4lut1e0008i90xj6hivu5r";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const email = (formData.get("email") as string) || "";
      const phone = (formData.get("phone") as string) || "";

      // Keep identifying the user with the SDK (non-blocking)
      distinct({ email, phone, source: "contact_form" }).catch(() => {});

      const eventData = generateRandomEcommerceData(email, phone);
      const payload = {
        type: "event",
        payload: {
          website: SIGNAL_WEBSITE,
          name: "purchase_completed",
          url: window.location.href,
          title: document.title,
          device_type: "desktop",
          language: navigator.language || "en-US",
          platform: "web",
          data: { ...eventData, timestamp: new Date().toISOString() },
        },
      };

      const url = `${SIGNAL_HOST}/push/hardal/`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let parsed: unknown = text;
      try {
        parsed = JSON.parse(text);
      } catch {
        // keep raw text if non-json
      }

      console.log({ status: res.status, body: parsed });

      if (!res.ok) {
        setError(`Server returned ${res.status}`);
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      function isErrorWithMessage(
        error: unknown
      ): error is { message: string } {
        return (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
        );
      }
      setError(isErrorWithMessage(err) ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Contact & E-commerce Tracker
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          className="border rounded px-2 py-1"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your phone (optional)"
          className="border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit & Track Purchase"}
        </button>
      </form>
      {success && (
        <p className="mt-2 text-green-600">Event tracked successfully!</p>
      )}
      {error && <p className="mt-2 text-red-600">Error: {error}</p>}
      <p className="mt-2 text-sm text-gray-600">
        Submitting will track a contact form event, identify the user, and send
        a random e-commerce event.
      </p>
    </div>
  );
}
