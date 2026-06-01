/**
 * Netlify Function — Cloudinary Admin API Proxy
 *
 * Proxies requests to https://api.cloudinary.com server-side,
 * adding Basic Auth so the browser never hits Cloudinary directly (no CORS).
 *
 * Expected query params:
 *   path          — Cloudinary API path, e.g. /v1_1/dvhiz5ph3/resources/image
 *   ...rest       — forwarded as query params to Cloudinary (max_results, next_cursor, public_ids[], etc.)
 *
 * Method + body are forwarded as-is.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dvhiz5ph3';
const API_KEY    = process.env.CLOUDINARY_API_KEY    || '897493957957822';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'WB__P_uMtWJ5qzU4sMjqfT7b12s';

const AUTH = 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

export const handler = async (event) => {
  const { path: apiPath, ...rest } = event.queryStringParameters || {};

  if (!apiPath) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing path param' }) };
  }

  // Build Cloudinary URL with remaining query params
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(rest)) {
    // URLSearchParams doesn't handle array keys like public_ids[] — add as-is
    params.append(k, v);
  }

  // Also handle multi-value params (Netlify puts them as arrays)
  const multiParams = event.multiValueQueryStringParameters || {};
  for (const [k, vals] of Object.entries(multiParams)) {
    if (k === 'path') continue;
    // Already added single values above; re-add as array if multiple
    if (vals.length > 1) {
      params.delete(k);
      vals.forEach((v) => params.append(k, v));
    }
  }

  const qs = params.toString();
  const url = `https://api.cloudinary.com${apiPath}${qs ? '?' + qs : ''}`;

  const fetchOptions = {
    method: event.httpMethod,
    headers: { Authorization: AUTH },
  };

  if (event.body && ['POST', 'PUT', 'PATCH'].includes(event.httpMethod)) {
    fetchOptions.headers['Content-Type'] = event.headers['content-type'] || 'application/x-www-form-urlencoded';
    fetchOptions.body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : event.body;
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
