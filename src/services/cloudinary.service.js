import { Cloudinary } from '@cloudinary/url-gen';

export const CLOUD_NAME = 'dvhiz5ph3';
const API_KEY    = '897493957957822';
const API_SECRET = 'WB__P_uMtWJ5qzU4sMjqfT7b12s';

export const cld = new Cloudinary({ cloud: { cloudName: CLOUD_NAME } });

const UPLOAD_BASE = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;
const AUTH_HEADER = { Authorization: 'Basic ' + btoa(`${API_KEY}:${API_SECRET}`) };

const IS_DEV = import.meta.env.DEV;

/**
 * Build Admin API URL:
 * - Dev  → Vite proxy   /cld-api/v1_1/{cloud}/...
 * - Prod → Netlify fn   /.netlify/functions/cloudinary-proxy?path=/v1_1/{cloud}/...&<rest>
 */
function adminUrl(path, queryParams = new URLSearchParams()) {
  if (IS_DEV) {
    const qs = queryParams.toString();
    return `/cld-api/v1_1/${CLOUD_NAME}${path}${qs ? '?' + qs : ''}`;
  }
  // Prod: pass everything to the Netlify function
  const params = new URLSearchParams(queryParams);
  params.set('path', `/v1_1/${CLOUD_NAME}${path}`);
  return `/.netlify/functions/cloudinary-proxy?${params}`;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * @param {File} file
 * @param {string} uploadPreset
 * @param {function} onProgress  (0-100)
 * @param {string} [publicId]    optional – use to overwrite/replace existing
 */
export async function uploadToCloudinary(file, uploadPreset, onProgress, publicId) {
  const resourceType = file.type.startsWith('video') ? 'video' : 'image';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (publicId) {
    formData.append('public_id', publicId);
    formData.append('overwrite', 'true');
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener('load', () => {
      const res = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) resolve(res);
      else reject(new Error(res?.error?.message || `Upload failed (${xhr.status})`));
    });
    xhr.addEventListener('error', () => reject(new Error('Network error')));
    xhr.open('POST', `${UPLOAD_BASE}/${resourceType}/upload`);
    xhr.send(formData);
  });
}

// ─── Admin API ────────────────────────────────────────────────────────────────

/**
 * List resources from Cloudinary.
 */
export async function listResources(resourceType = 'image', nextCursor, maxResults = 50) {
  const params = new URLSearchParams({ max_results: maxResults });
  if (nextCursor) params.set('next_cursor', nextCursor);

  const url = adminUrl(`/resources/${resourceType}`, params);
  const res = await fetch(url, IS_DEV ? { headers: AUTH_HEADER } : {});

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `Failed to list resources (${res.status})`);
  }
  return res.json();
}

/**
 * Delete one or more resources by public_id.
 */
export async function deleteResources(publicIds, resourceType = 'image') {
  const params = new URLSearchParams();
  publicIds.forEach((id) => params.append('public_ids[]', id));

  const url = adminUrl(`/resources/${resourceType}/upload`, params);
  const res = await fetch(url, {
    method: 'DELETE',
    ...(IS_DEV ? { headers: AUTH_HEADER } : {}),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `Delete failed (${res.status})`);
  }
  return res.json();
}

/**
 * Rename a resource (change public_id).
 */
export async function renameResource(fromPublicId, toPublicId, resourceType = 'image') {
  const formData = new FormData();
  formData.append('from_public_id', fromPublicId);
  formData.append('to_public_id', toPublicId);

  const url = adminUrl(`/${resourceType}/rename`);
  const res = await fetch(url, {
    method: 'POST',
    ...(IS_DEV ? { headers: AUTH_HEADER } : {}),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `Rename failed (${res.status})`);
  }
  return res.json();
}

export default cld;
