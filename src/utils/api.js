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
 * This file is used ONLY in the frontend.
 * =========================================================
 */

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const signupUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
};

export const googleLogin = async (googleToken) => {
  const response = await fetch(`${BASE_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: googleToken }),
  });

  return handleResponse(response);
};
