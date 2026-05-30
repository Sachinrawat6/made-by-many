import axios from "axios";

const PRODUCT_API    = "https://inventorybackend-m1z8.onrender.com/api/product";
// Netlify serverless function — proxies Myntra server-side, no CORS issue
const MYNTRA_PROXY   = "/.netlify/functions/myntra-image";

/**
 * Fetch product info by style_code from inventory backend.
 * Returns: { style_id, style_code, style_name, color, mrp } or null
 */
export async function fetchProductByStyleCode(styleCode) {
  if (!styleCode) return null;
  try {
    const { data } = await axios.get(PRODUCT_API, {
      params: { style_code: styleCode },
      timeout: 8_000,
    });
    const list = Array.isArray(data) ? data : [];
    return list.length > 0 ? list[0] : null;
  } catch {
    return null;
  }
}

/**
 * Fetch product image directly from Myntra's gateway API.
 * No proxy — browser calls it directly.
 *
 * Response shape: style.media.albums[0].images[0].imageURL
 * imageURL = plain CDN URL (no template vars, unlike src/secureSrc).
 * e.g. http://assets.myntassets.com/assets/images/2025/APRIL/27/xxx.jpg
 *
 * Returns: HTTPS CDN URL or null
 */
/**
 * Fetch Myntra product image via Netlify serverless proxy.
 * The function calls Myntra server-side — no CORS/auth issues.
 * Endpoint: /.netlify/functions/myntra-image?style_id=33800318
 */
export async function fetchMyntraImage(styleId) {
  if (!styleId) return null;
  try {
    const { data } = await axios.get(MYNTRA_PROXY, {
      params: { style_id: styleId },
      timeout: 12_000,
    });
    return data?.imageUrl || null;
  } catch {
    return null;
  }
}
