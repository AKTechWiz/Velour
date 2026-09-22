import { createClient, createAdminClient } from "@insforge/sdk";

const baseUrl =
  process.env.NEXT_PUBLIC_INSFORGE_URL ||
  "https://cawv4e2d.us-east.insforge.app";

const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "";

const apiKey = process.env.INSFORGE_API_KEY || "";

// Standard client for client-side and user-scoped SSR operations
export const insforge = createClient({
  baseUrl,
  anonKey,
});

// Admin client for server-only backend operations (e.g. API route handlers)
export const insforgeAdmin = createAdminClient({
  baseUrl,
  apiKey,
});
