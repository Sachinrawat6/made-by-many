const axios = require("axios");

exports.handler = async (event) => {
  const styleId = event.queryStringParameters?.style_id;

  if (!styleId) {
    return respond(400, { imageUrl: null, error: "style_id required" });
  }

  try {
    const { data } = await axios.get(
      `https://www.myntra.com/gateway/v2/product/${styleId}`,
      {
        timeout: 10000,
        decompress: true, // axios handles gzip automatically
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36",
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-IN,en;q=0.9",
          Referer: "https://www.myntra.com/",
          Origin: "https://www.myntra.com",
          "x-location-code": "560001",
        },
      }
    );

    const albums = data?.style?.media?.albums ?? [];
    let imageUrl = null;

    for (const album of albums) {
      if (album.name !== "default") continue;
      for (const img of album?.images ?? []) {
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
