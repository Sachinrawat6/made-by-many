/**
 * Netlify Serverless Function: /api/myntra-image?style_id=33800318
 *
 * Proxies Myntra's gateway API server-side (no CORS/auth restriction).
 * Returns: { imageUrl: "https://assets.myntassets.com/..." } or { imageUrl: null }
 */

const https = require("https");

exports.handler = async (event) => {
  const styleId = event.queryStringParameters?.style_id;

  if (!styleId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ imageUrl: null, error: "style_id required" }),
    };
  }

  try {
    const data = await fetchJson(
      `https://www.myntra.com/gateway/v2/product/${styleId}`
    );

    const albums = data?.style?.media?.albums ?? [];
    let imageUrl = null;

    for (const album of albums) {
      for (const img of album?.images ?? []) {
        const url = img?.imageURL || img?.secureSrc || img?.src;
        if (url) {
          imageUrl = url.replace("http://", "https://");
          break;
        }
      }
      if (imageUrl) break;
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ imageUrl }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ imageUrl: null }),
    };
  }
};

/** Simple HTTPS GET returning parsed JSON */
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
          Referer: "https://www.myntra.com/",
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error("Invalid JSON"));
          }
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}
