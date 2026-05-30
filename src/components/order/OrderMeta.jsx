/**
 * OrderMeta — shows a subtle summary strip at the top of the page.
 * Displays order details from the raw API record.
 */
export function OrderMeta({ record }) {
  if (!record) return null;

  // Show relevant order metadata if fields exist
  const fields = [
    { label: "Order", value: record["Title"] || record["Order ID"] || record["order_id"] },
    { label: "Style", value: record["Style"] || record["style"] },
    { label: "Qty", value: record["Quantity"] || record["quantity"] || record["Qty"] },
    { label: "Status", value: record["Status"] || record["status"] },
  ].filter((f) => f.value);

  if (fields.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-5 animate-fade-in">
      {fields.map((f) => (
        <div
          key={f.label}
          className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm"
        >
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{f.label}</span>
          <span className="text-xs font-bold text-gray-700">{f.value}</span>
        </div>
      ))}
    </div>
  );
}
