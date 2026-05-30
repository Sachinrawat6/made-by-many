const DUMMY_IMAGE =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80";
const DUMMY_NAME = "Georgette Printed V Neck Dress";
const DUMMY_DESC =
  "White Georgette Fit & Flare Dress with Straight Hemline and With Lining";

/**
 * OrderHero
 * orderMeta: { order_id, style_number } — null when order not found
 */
export function OrderHero({ orderMeta, orderId }) {
  const hasData = !!orderMeta;
  const productName = orderMeta?.style_number
    ? `Style #${orderMeta.style_number}`
    : DUMMY_NAME;
  const displayOrderId = orderId ? `#${orderId}` : null;

  return (
    <div className="text-center px-4 pt-8 pb-6 animate-fade-in">
      {/* Heading */}
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-5">
        Made by Many
      </h1>

      {/* Product image + info — only when API returned data */}
      {hasData && (
        <>
          <div className="relative mx-auto w-44 h-52 sm:w-52 sm:h-60 rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-2 ring-gray-100 mb-4">
            <img
              src={DUMMY_IMAGE}
              alt={productName}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = DUMMY_IMAGE; }}
            />
          </div>

          {displayOrderId && (
            <p className="text-sm font-semibold text-gray-400 tracking-wider mb-1">
              {displayOrderId}
            </p>
          )}

          <p className="text-base font-black text-gray-900 leading-snug max-w-xs mx-auto">
            {productName}
          </p>

          <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-xs mx-auto">
            {DUMMY_DESC}
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
