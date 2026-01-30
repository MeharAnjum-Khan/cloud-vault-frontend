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
import { loginUser } from "@/lib/api";

/* =====================================================
   ✅ ADDED: Standard eye icons for show / hide password
   ===================================================== */
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // -------------------------------
  // Form state
  // -------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* =====================================================
     ✅ ADDED: UI state to toggle password visibility
     ===================================================== */
  const [showPassword, setShowPassword] = useState(false);

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

      /* =====================================================
         ✅ FIXED: Store token using the SAME key
         that api.js expects ("token")
         ===================================================== */
      localStorage.setItem("token", data.token);

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-xl">
        {/* App title */}
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
          CloudVault
        </h1>
        <p className="mb-8 text-center text-slate-500">
          Sign in to your secure cloud storage
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-100"></div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or continue with</span>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>

        {/* Google Sign-in */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Don’t have an account?{" "}
          <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}
