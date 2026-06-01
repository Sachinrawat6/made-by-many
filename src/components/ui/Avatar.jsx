import { useState } from 'react';
import { getInitials } from '@/utils/helpers';
import clsx from 'clsx';

const SIZE_MAP = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-28 h-28 text-3xl',
  xl: 'w-32 h-32 text-4xl',
};

/**
 * Avatar component.
 *
 * - `avatarsReady` false  → pulse skeleton (Cloudinary still loading)
 * - `image` URL present   → photo (falls back to initials on img error)
 * - no image              → gradient initials
 *
 * Props:
 *   name          {string}
 *   image         {string|null}
 *   avatarsReady  {boolean}      — pass false while Cloudinary map is loading
 *   gradient      {string}
 *   size          {sm|md|lg|xl}
 *   className     {string}
 */
export function Avatar({
  name = '',
  image = null,
  avatarsReady = true,
  gradient = 'from-gray-400 to-gray-500',
  size = 'lg',
  className,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);
  const initials   = getInitials(name);
  const sizeClass  = SIZE_MAP[size] || SIZE_MAP.lg;

  // Show skeleton pulse while Cloudinary map is still being fetched
  if (!avatarsReady) {
    return (
      <div
        className={clsx(
          'rounded-full bg-gray-200 animate-pulse flex-shrink-0',
          sizeClass,
          className
        )}
        aria-label={name}
      />
    );
  }

  if (image && !imgError) {
    return (
      <div
        className={clsx(
          'rounded-full overflow-hidden shadow-md flex-shrink-0 select-none relative',
          sizeClass,
          className
        )}
        aria-label={name}
        title={name}
      >
        {/* Skeleton shown while image itself is loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
        )}
        <img
          src={image}
          alt={name}
          className={clsx(
            'w-full h-full object-cover transition-opacity duration-300',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Gradient initials fallback
  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-bold text-white',
        'bg-gradient-to-br shadow-md select-none flex-shrink-0',
        sizeClass,
        gradient,
        className
      )}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
}
