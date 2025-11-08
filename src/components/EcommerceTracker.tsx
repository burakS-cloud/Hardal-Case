"use client";

import { useHardal } from "hardal/react";
import { useState } from "react";

// Helper to generate random subscription data
const generateRandomSubscriptionData = (email: string, phone: string) => {
  const randomId = Math.floor(Math.random() * 10000);
  return {
    customer: {
      email,
      phone,
      userId: `user_${randomId}`,
      customerType: "business",
    },
    subscription: {
      id: `sub_${randomId}`,
      planName: "Enterprise Pro",
      annualValue: Math.floor(Math.random() * 20000) / 100,
      features: [
        {
          id: `feat_${Math.floor(Math.random() * 1000)}`,
          name: "Advanced Analytics",
          tier: "enterprise",
          seats: Math.floor(Math.random() * 10) + 5,
        },
        {
          id: `feat_${Math.floor(Math.random() * 1000)}`,
          name: "Premium Support",
          tier: "enterprise",
          supportLevel: "24/7",
        },
      ],
    },
    metadata: {
      source: "pricing_page",
      platform: "web",
      session: {
        id: `sess_${randomId}`,
        referrer: "linkedin.com",
        device: "desktop",
      },
    },
  };
};

export function EcommerceTracker() {
  const hardal = useHardal();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For debugging
  console.log("Hardal context:", hardal);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const email = (formData.get("email") as string) || "";
      const phone = (formData.get("phone") as string) || "";

      console.log("Starting user identification...");
      // First identify the user
      await hardal.distinct({ email, phone, source: "subscription_form" });
      console.log("User identified successfully");

      await hardal.track("testing_sdk_event", { test_property: "test_value" });
      console.log("Custom event tracked successfully");
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
