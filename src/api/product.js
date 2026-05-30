import axios from "axios";

const PRODUCT_API = "https://inventorybackend-m1z8.onrender.com/api/product";

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
