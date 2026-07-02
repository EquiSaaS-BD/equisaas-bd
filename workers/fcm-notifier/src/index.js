export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${env.FCM_SECRET_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const { tokens, title, body, data } = await request.json();
      
      if (!tokens || tokens.length === 0) {
        return new Response("No tokens provided", { status: 400 });
      }

      // Note: This requires a valid OAuth2 token. In a full implementation,
      // you must mint a JWT using env.FIREBASE_SERVICE_ACCOUNT JSON via Web Crypto API,
      // exchange it for an OAuth2 token from Google, and then call FCM v1 API.
      // For brevity and zero dependencies, this acts as the entry point.
      // 
      // Replace ACCESS_TOKEN with the dynamically generated token.
      
      const payload = {
        message: {
          token: tokens[0], // Loop or use multi-cast
          notification: { title, body },
          data
        }
      };

      // To fully implement JWT signing in Cloudflare Workers, you can use packages like 'jose' or '@tsndr/cloudflare-worker-jwt'.
      
      return new Response(JSON.stringify({ success: true, message: "Worker received request. JWT implementation pending." }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (e) {
      return new Response(e.message, { status: 500 });
    }
  }
};
