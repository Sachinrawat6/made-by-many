import { useState } from 'react';

/**
 * OrderHero
 *
 * productInfo: { style_id, style_code, style_name, color, mrp } | null
 * orderMeta:   { order_id, style_number } | null
 * orderId:     string | null
 *
 * Shows product section only when productInfo is available.
 * Embeds Myntra product page in an iframe using style_id.
 */
export function OrderHero({ productInfo, orderMeta, orderId }) {
  const [iframeBlocked, setIframeBlocked] = useState(false);

  // Only show product block when API returned data
  const hasProduct = !!productInfo;
  const myntraUrl = productInfo?.style_id ? `https://www.myntra.com/${productInfo.style_id}` : null;

  const displayOrderId = orderId ? `#${orderId}` : null;

  return (
    <div className="text-center px-4 pt-8 pb-6 animate-fade-in">
      {/* Heading */}
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-5">Made by Many</h1>

      {/* Product block — only when productInfo exists */}
      {hasProduct && (
        <>
          {/* Order ID */}
          {displayOrderId && (
            <p className="text-sm font-semibold text-gray-400 tracking-wider mb-2">
              {displayOrderId}
            </p>
          )}

          {/* Product name */}
          <p className="text-base font-black text-gray-900 leading-snug max-w-xs mx-auto mb-1">
            {productInfo.style_name}
          </p>

          {/* Myntra iframe — navbar & breadcrumbs clipped via translateY */}
          {myntraUrl && !iframeBlocked && (
            <div
              className="relative mx-auto w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-2"
              style={{ height: '440px' }}
            >
              <iframe
                src={myntraUrl}
                title={productInfo.style_name}
                className="w-full border-0"
                style={{
                  height: '640px',
                  transform: 'translateY(-138px)', // hides navbar (~60px) + breadcrumb (~48px)
                  pointerEvents: 'none', // prevent accidental clicks / scrolling
                }}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                onError={() => setIframeBlocked(true)}
              />
            </div>
          )}

          {/* Fallback if iframe is blocked */}
          {myntraUrl && iframeBlocked && (
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center mb-2">
              <p className="text-sm text-gray-500 mb-3">Preview blocked by Myntra</p>
              <a
                href={myntraUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
              >
                View on Myntra ↗
              </a>
            </div>
          )}
        </>
      )}

      {/* Divider */}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
          The Team Behind It
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    </div>
  );
}
