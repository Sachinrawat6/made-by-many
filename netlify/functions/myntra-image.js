const https = require("https");

exports.handler = async (event) => {
  const styleId = event.queryStringParameters?.style_id;

  if (!styleId) {
    return respond(400, { imageUrl: null, error: "style_id required" });
  }

  try {
    const data = await fetchJson(
      `https://www.myntra.com/gateway/v2/product/${styleId}`
    );

    // Extract first valid imageURL from default album
    const albums = data?.style?.media?.albums ?? [];
    let imageUrl = null;

    for (const album of albums) {
      if (album.name !== "default") continue;
      for (const img of album?.images ?? []) {
        // imageURL = plain CDN path (no template vars)
        const url = img?.imageURL || img?.secureSrc;
        if (url && url.includes("myntassets")) {
          imageUrl = url.replace("http://", "https://");
          break;
        }
      }
      if (imageUrl) break;
    }

    return respond(200, { imageUrl });
  } catch (err) {
    console.error("myntra-image error:", err.message);
    return respond(200, { imageUrl: null, debug: err.message });
  }
};

function respond(status, body) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-IN,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": "https://www.myntra.com/",
        "Origin": "https://www.myntra.com",
        "x-location-code": "560001",
        "x-requested-with": "browser",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
    };

    const req = https.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        try {
          const raw = Buffer.concat(chunks).toString("utf8");
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(new Error("JSON parse failed"));
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}
