import clsx from "clsx";

/**
 * Badge — small pill label.
 *
 * variant: "default" | "success" | "warning" | "error"
 */
export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    error:   "bg-red-100 text-red-600",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}
