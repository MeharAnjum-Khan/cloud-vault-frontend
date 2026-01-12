"use client";

/**
 * =========================================================
 * PURPOSE OF THIS FILE
 * =========================================================
 * This file renders the Login page UI for CloudVault.
 *
 * Responsibilities:
 * - Show login form (email + password)
 * - Call backend login API using api.js
 * - Store JWT token on successful login
 * - Redirect user after login
 *
 * This page is part of the (auth) route group.
 * =========================================================
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/utils/api";

export default function LoginPage() {
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

  /**
   * Handle login form submission
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page refresh
    setError("");
    setLoading(true);

    try {
      // Call backend login API
      const data = await loginUser({ email, password });

      // Save JWT token in browser storage
      localStorage.setItem("cloudvault_token", data.token);

      // Redirect user (dashboard will be created later)
      router.push("/dashboard");
    } catch (err) {
      // Show backend error message
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
          Sign in to your secure cloud storage
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="••••••••"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
