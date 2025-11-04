"use client";

import { useHardal } from "hardal/react";
import { useState } from "react";

// Helper to generate random e-commerce data
const generateRandomEcommerceData = (email: string, phone: string) => {
  const randomId = Math.floor(Math.random() * 10000);
  return {
    customer: {
      email,
      phone,
      userId: `user_${randomId}`,
    },
    order: {
      id: `order_${randomId}`,
      total: Math.floor(Math.random() * 10000) / 100,
      items: [
        {
          id: `prod_${Math.floor(Math.random() * 1000)}`,
          name: "Premium Widget",
          price: 29.99,
          quantity: Math.floor(Math.random() * 5) + 1,
          category: "Electronics",
          variant: "Pro",
        },
        {
          id: `prod_${Math.floor(Math.random() * 1000)}`,
          name: "Deluxe Package",
          price: 49.99,
          quantity: Math.floor(Math.random() * 3) + 1,
          category: "Services",
          variant: "Annual",
        },
      ],
    },
    metadata: {
      source: "product_page",
      platform: "web",
      session: {
        id: `sess_${randomId}`,
        referrer: "google.com",
        device: "desktop",
      },
    },
  };
};

export function EcommerceTracker() {
  const { track, distinct } = useHardal();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handles form submission: tracks form_submitted, identifies user, and tracks e-commerce event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;

      // 1. Track the form submission event (ContactForm logic)
      await track("form_submitted", {
        formType: "contact",
        source: "landing_page",
      });

      // 2. Identify the user (ContactForm logic)
      await distinct({
        email,
        phone,
        source: "contact_form",
      });

      // 3. Track a detailed e-commerce event (EcommerceTracker logic)
      const eventData = generateRandomEcommerceData(email, phone);
      await track("purchase_completed", {
        ...eventData,
        timestamp: new Date().toISOString(),
      });

      setSuccess(true);
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
