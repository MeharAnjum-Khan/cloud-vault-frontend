"use client";

/**
 * =========================================================
 * PURPOSE OF THIS FILE
 * =========================================================
 * This file renders the Signup page UI for CloudVault.
 *
 * Responsibilities:
 * - Show signup form (email + password)
 * - Call backend signup API using api.js
 * - Redirect user to login after successful signup
 *
 * This page is part of the (auth) route group.
 * =========================================================
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "@/utils/api";

export default function SignupPage() {
  const router = useRouter();

  // -------------------------------
  // Form state
  // -------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // -------------------------------
  // UI state
  // -------------------------------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Handle signup form submission
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Call backend signup API
      await signupUser({ email, password });

      // Show success message
      setSuccess("Account created successfully. Please login.");

      // Redirect to login after short delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl backdrop-blur">
        {/* App title */}
        <h1 className="mb-2 text-center text-2xl font-semibold text-white">
          CloudVault
        </h1>
        <p className="mb-6 text-center text-slate-400">
          Create your CloudVault account
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
            {success}
          </div>
        )}

        {/* Signup form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm text-slate-400">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm text-slate-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Create a strong password"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
