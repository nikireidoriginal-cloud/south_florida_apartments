// Cloudflare Worker — Apartment Finder Backend
// Deploy with: npx wrangler deploy worker.js --name apartment-finder
//
// Required KV namespace binding: APARTMENT_DATA
// Create with: npx wrangler kv namespace create APARTMENT_DATA
//
// Then add to wrangler.toml:
// [[kv_namespaces]]
// binding = "APARTMENT_DATA"
// id = "<your-namespace-id>"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

const KV_KEY = "properties";

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /api/properties — return all properties
      if (path === "/api/properties" && request.method === "GET") {
        const data = await env.APARTMENT_DATA.get(KV_KEY);
        if (!data) {
          return new Response("[]", { headers: CORS_HEADERS });
        }
        return new Response(data, { headers: CORS_HEADERS });
      }

      // PUT /api/properties — replace all properties
      if (path === "/api/properties" && request.method === "PUT") {
        const body = await request.json();
        if (!Array.isArray(body)) {
          return new Response(JSON.stringify({ error: "Expected array" }), {
            status: 400,
            headers: CORS_HEADERS
          });
        }
        await env.APARTMENT_DATA.put(KV_KEY, JSON.stringify(body));
        return new Response(JSON.stringify({ ok: true, count: body.length }), {
          headers: CORS_HEADERS
        });
      }

      // Health check
      if (path === "/api/health") {
        return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
          headers: CORS_HEADERS
        });
      }

      // Serve the frontend for any other path
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: CORS_HEADERS
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: CORS_HEADERS
      });
    }
  }
};
