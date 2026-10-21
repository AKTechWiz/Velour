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
// Lazy-initialized via Proxy so that importing this file in browser client bundles
// does NOT throw "Missing apiKey" when INSFORGE_API_KEY is not exposed to the browser.
let _adminClient: ReturnType<typeof createAdminClient> | null = null;

function getAdminClient(): ReturnType<typeof createAdminClient> {
  if (typeof window !== "undefined") {
    throw new Error("insforgeAdmin can only be used on the server.");
  }
  if (!_adminClient) {
    const key = process.env.INSFORGE_API_KEY || "";
    if (!key) {
      throw new Error("Missing INSFORGE_API_KEY in environment variables.");
    }
    _adminClient = createAdminClient({
      baseUrl,
      apiKey: key,
    });
  }
  return _adminClient;
}

export const insforgeAdmin = new Proxy({} as ReturnType<typeof createAdminClient>, {
  get(_target, prop) {
    const client = getAdminClient();
    const val = (client as any)[prop];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});

