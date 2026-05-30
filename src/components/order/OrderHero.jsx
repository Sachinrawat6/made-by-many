// Static placeholder image — replace with real image later
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80";

/**
 * OrderHero
 * productInfo: { style_name, ... } | null
 * orderId: string | null
 */
export function OrderHero({ productInfo, orderId }) {
  const hasProduct = !!productInfo;
  const displayId  = orderId ? `#${orderId}` : null;

  return (
    <div className="text-center px-4 pt-8 pb-6 animate-fade-in">
      {/* Heading */}
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-5">
        Made by Many
      </h1>

      {hasProduct && (
        <>
          {/* Order ID */}
          {displayId && (
            <p className="text-sm font-semibold text-gray-400 tracking-wider mb-2">
              {displayId}
            </p>
          )}

          {/* Static placeholder image */}
          <div className="relative mx-auto w-48 rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-4">
            <img
              src={PLACEHOLDER_IMAGE}
              alt={productInfo.style_name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Product name */}
          <p className="text-base font-black text-gray-900 leading-snug max-w-xs mx-auto">
            {productInfo.style_name}
          </p>
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
