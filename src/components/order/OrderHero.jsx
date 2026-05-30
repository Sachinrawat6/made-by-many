/**
 * OrderHero
 * productInfo: { style_id, style_name, imageUrl? } | null
 * orderId: string | null
 *
 * Image loads in background after team is already visible.
 * Shows skeleton → image (or nothing if fetch fails).
 */
export function OrderHero({ productInfo, imageLoading, orderId }) {
  const hasProduct = !!productInfo;
  const displayId = orderId ? `#${orderId}` : null;
  const imageUrl = productInfo?.imageUrl ?? null;

  console.log('OrderHero render:', { productInfo, imageLoading, orderId, imageUrl });

  return (
    <div className="text-center px-4 pt-8 pb-6 animate-fade-in">
      {/* Heading */}
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-5">Made by Many</h1>

      {hasProduct && (
        <>
          {/* Order ID */}
          {displayId && (
            <p className="text-sm font-semibold text-gray-400 tracking-wider mb-2">{displayId}</p>
          )}

          {/* Product name */}
          <p className="text-base font-black text-gray-900 leading-snug max-w-xs mx-auto mb-4">
            {productInfo.style_name}
          </p>

          {/* Product image */}
          {imageLoading && (
            <div className="mx-auto w-48 h-64 rounded-2xl bg-gray-100 animate-pulse mb-4" />
          )}

          {imageUrl && (
            <div className="relative mx-auto w-48 rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-4 animate-fade-in">
              <img
                src={imageUrl}
                alt={productInfo.style_name}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
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
