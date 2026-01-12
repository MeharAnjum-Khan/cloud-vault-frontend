/**
 * =========================================================
 * PURPOSE OF THIS FILE
 * =========================================================
 * This file acts as a SINGLE ENTRY POINT for all frontend →
 * backend communication related to authentication.
 *
 * Instead of writing fetch() logic again and again in
 * login, signup, or Google OAuth pages, we centralize it here.
 *
 * Benefits:
 * - Cleaner frontend code
 * - Easier maintenance
 * - Professional project structure
 * - Backend URL managed in one place
 *
 * This file is used ONLY in the frontend.
 * =========================================================
 */

/* ---------------------------------------------------------
   BACKEND BASE URL
   ---------------------------------------------------------
   This is your backend server URL.
   If your backend runs on a different port or domain later,
   you ONLY change it here.
---------------------------------------------------------- */
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ---------------------------------------------------------
   HELPER FUNCTION: Handle API responses
   ---------------------------------------------------------
   This function:
   - Converts response to JSON
   - Handles backend errors gracefully
---------------------------------------------------------- */
const handleResponse = async (response) => {
  const data = await response.json();

  // If backend sends error (status not 2xx)
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

/* ---------------------------------------------------------
   SIGNUP API
   ---------------------------------------------------------
   Called when user registers using email & password
---------------------------------------------------------- */
export const signupUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

/* ---------------------------------------------------------
   LOGIN API
   ---------------------------------------------------------
   Called when user logs in using email & password
---------------------------------------------------------- */
export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
};

/* ---------------------------------------------------------
   GOOGLE LOGIN API
   ---------------------------------------------------------
   Called after Google OAuth authentication is completed
   on the frontend and we send the Google token to backend
---------------------------------------------------------- */
export const googleLogin = async (googleToken) => {
  const response = await fetch(`${BASE_URL}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: googleToken }),
  });

  return handleResponse(response);
};
