import { getInitials } from "@/utils/helpers";
import clsx from "clsx";

const SIZE_MAP = {
  sm:  "w-10 h-10 text-sm",
  md:  "w-12 h-12 text-base",
  lg:  "w-16 h-16 text-xl",
  xl:  "w-20 h-20 text-2xl",
};

/**
 * Avatar component — shows initials with a gradient background.
 *
 * Props:
 *   name     {string}
 *   gradient {string}  — tailwind gradient classes e.g. "from-amber-400 to-orange-400"
 *   size     {sm|md|lg|xl}
 *   className {string}
 */
export function Avatar({ name = "", gradient = "from-gray-400 to-gray-500", size = "lg", className }) {
  const initials = getInitials(name);

  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center font-bold text-white",
        "bg-gradient-to-br shadow-md select-none flex-shrink-0",
        SIZE_MAP[size] || SIZE_MAP.lg,
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
