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
   BACKEND BASE URL:
---------------------------------------------------------- */
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8080";

/* ---------------------------------------------------------
   HELPER FUNCTION: Handle API responses
---------------------------------------------------------- */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong");
  }

  return data;
};

/* =========================================================
   ✅ GENERIC API HELPER (DEFAULT EXPORT)
========================================================= */
const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem("token");

    /* ✅ FIX ADDED:
       Only attach Authorization header if token exists.
       Prevents sending `Bearer null` which caused "Invalid token".
    */
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      headers,
    });

    return handleResponse(response);
  },

  /* ✅ ADDED: Generic POST Helper */
  post: async (endpoint, body) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  /* ✅ ADDED: Generic Upload Helper */
  upload: async (endpoint, formData) => {
    const token = localStorage.getItem("token"); //get the ID token from local storage

    // Only attach Authorization header if token exists
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    // Note: Content-Type is NOT set here because fetch automatically
    // sets it to multipart/form-data with boundary when body is FormData

    //send the file to the backend with the headers
    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    return handleResponse(response);
  },

  /* ✅ ADDED: Generic PUT Helper */
  put: async (endpoint, body) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  /* ✅ ADDED: Generic DELETE Helper */
  del: async (endpoint) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      method: "DELETE",
      headers,
    });

    return handleResponse(response);
  },
};

export default api;

/* ---------------------------------------------------------
   SIGNUP API
---------------------------------------------------------- */
export const signupUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
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