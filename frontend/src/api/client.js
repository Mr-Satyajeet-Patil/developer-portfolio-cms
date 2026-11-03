/** Base path for API requests. Defaults to the Vite dev proxy. */
const configured = import.meta.env.VITE_API_URL?.trim();
export const API_BASE = (configured || "/api").replace(/\/+$/, "");

/** Origin that serves the API (and uploaded media files). */
export const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
})();

export const ADMIN_URL = `${API_ORIGIN}/admin/`;

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/** Resolve a possibly relative file path returned by Django's FileField. */
export function mediaUrl(value) {
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;
  return `${API_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;
}

async function request(path, { method = "GET", body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      "Could not reach the API. Is the Django server running?",
      0,
    );
  }

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    const firstError = (() => {
      if (!payload || typeof payload !== "object") return null;
      for (const value of Object.values(payload)) {
        if (typeof value === "string" && value) return value;
        if (Array.isArray(value) && typeof value[0] === "string") {
          return value[0];
        }
      }
      return null;
    })();

    const message =
      (payload && !Array.isArray(payload) && payload.detail) ||
      (payload && !Array.isArray(payload) && payload.message) ||
      firstError ||
      `Request failed (${response.status}).`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

export const api = {
  get: (path, signal) => request(path, { signal }),
  post: (path, body, signal) => request(path, { method: "POST", body, signal }),
};
