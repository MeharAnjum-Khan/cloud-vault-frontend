/**
 * PURPOSE:
 * This layout is used ONLY for authentication pages
 * like Login and Signup.
 *
 * It provides a clean, centered layout without
 * dashboard sidebars or navigation.
 */

export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {children}
    </main>
  );
}
