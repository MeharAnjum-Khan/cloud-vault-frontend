/**
 * =========================================================
 * LANDING PAGE – CLOUDVAULT
 * File: src/app/page.js
 * =========================================================
 * This is the MAIN homepage of the application (/).
 *
 * Purpose:
 * - Introduce CloudVault
 * - Explain what the product does
 * - Guide users to Login or Signup
 *
 * This page does NOT handle authentication.
 * It only redirects users to /login or /signup.
 *
 * Next.js App Router rule:
 * - page.js inside /app becomes a route automatically
 * =========================================================
 */

import { Cloud } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* =====================================================
          NAVBAR
          ===================================================== */}
      <header className="flex items-center justify-between px-8 py-5">
        {/* App Logo / Name */}
       <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Cloud className="w-7 h-7 text-blue-600" />
              Cloud Vault
       </h1>


        {/* Auth Navigation */}
        <nav className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* =====================================================
          HERO SECTION
          ===================================================== */}
      <section className="flex flex-col items-center text-center px-6 mt-20">
        <h2 className="text-4xl font-bold max-w-3xl">
          Secure cloud storage for your files, folders, and teams
        </h2>

        <p className="mt-4 text-lg text-slate-600 max-w-2xl">
          Cloud Vault helps you store, organize, and share files securely —
          with simple access control and a clean, reliable experience.
        </p>

        {/* Call to Action */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Get Started Free
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* =====================================================
          FEATURES SECTION
          ===================================================== */}
      <section className="mt-28 px-8 max-w-6xl mx-auto">
        <h3 className="text-3xl font-semibold text-center">
          Why choose Cloud Vault?
        </h3>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h4 className="text-lg font-semibold mb-2">
              Secure Authentication
            </h4>
            <p className="text-slate-600 text-sm">
              JWT-based authentication with encrypted passwords and
              Google OAuth support.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h4 className="text-lg font-semibold mb-2">
              Organized File Storage
            </h4>
            <p className="text-slate-600 text-sm">
              Upload, manage, and organize files into folders
              with reliable cloud storage.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h4 className="text-lg font-semibold mb-2">
              Controlled Sharing
            </h4>
            <p className="text-slate-600 text-sm">
              Share files securely with granular access control
              built for individuals and teams.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CALL TO ACTION
          ===================================================== */}
      <section className="mt-32 bg-blue-50 py-20 text-center">
        <h3 className="text-3xl font-bold">
          Start organizing your files today
        </h3>

        <p className="mt-3 text-slate-600">
          Simple. Secure. Reliable cloud storage.
        </p>

        <Link
          href="/signup"
          className="inline-block mt-6 px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          Create Your Account
        </Link>
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}
      <footer className="py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Cloud Vault. All rights reserved.
      </footer>
    </main>
  );
}
