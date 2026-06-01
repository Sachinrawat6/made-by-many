import { useState, useEffect } from 'react';
import { listResources, CLOUD_NAME } from '@/services/cloudinary.service';

// Fixed at 300px — sharp enough for any avatar size we'll ever use,
// won't change even if CSS size increases, so cached URL stays valid.
const AVATAR_TRANSFORM = 'w_300,h_300,c_fill,g_face,q_auto,f_auto';

function optimiseUrl(url) {
  return url.replace('/upload/', `/upload/${AVATAR_TRANSFORM}/`);
}

/**
 * Fetches all images from Cloudinary and builds a lowercase-name → optimised URL map.
 *
 * Returns:
 *   ready   {boolean}   true once fetch is done (success or fail)
 *   getUrl  {function}  (name) => url | null
 */
export function useCloudinaryAvatars() {
  const [avatarMap, setAvatarMap] = useState(new Map());
  const [ready, setReady]         = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      const map = new Map();
      let cursor = undefined;

      try {
        do {
          const data = await listResources('image', cursor, 100);
          for (const r of data.resources) {
            const key = r.public_id.toLowerCase().trim();
            map.set(key, optimiseUrl(r.secure_url));
          }
          cursor = data.next_cursor;
        } while (cursor);
      } catch {
        // Silently fail — initials shown as fallback
      }

      if (!cancelled) {
        setAvatarMap(map);
        setReady(true);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  function getUrl(name) {
    if (!name) return null;
    const key = name.toLowerCase().trim();
    if (avatarMap.has(key)) return avatarMap.get(key);

    for (const [k, url] of avatarMap.entries()) {
      if (k.includes(key) || key.includes(k)) return url;
    }

    return null;
  }

  return { ready, getUrl };
}
