import { Avatar } from "@/components/ui/Avatar";
import clsx from "clsx";

/**
 * TeamMemberCard
 *
 * Renders one team member in the timeline with:
 * - Animated entrance (staggered by index)
 * - Avatar with gradient
 * - Role label, name, description
 * - Step number indicator
 * - Connector line to next card
 */
export function TeamMemberCard({ member, index, isLast }) {
  const { role, name, icon, description, gradient, bgLight, textColor, borderColor } = member;

  return (
    <div
      className="relative animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Vertical connector line */}
      {!isLast && (
        <div className="absolute left-8 top-[88px] bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-gray-50 z-0" />
      )}

      <div className={clsx(
        "relative z-10 mb-6 rounded-2xl border p-4 shadow-sm transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        bgLight,
        borderColor,
      )}>
        {/* Top row: Avatar + Name/Role */}
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar with icon badge */}
          <div className="relative flex-shrink-0">
            <Avatar name={name} gradient={gradient} size="lg" />
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-sm border border-gray-100"
              aria-hidden="true"
            >
              {icon}
            </span>
          </div>

          {/* Name + Role */}
          <div className="flex-1 min-w-0">
            <p className="text-xl font-black text-gray-900 leading-tight truncate">{name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className={clsx("text-[11px] font-bold uppercase tracking-widest", textColor)}>
                {role}
              </p>
            </div>
          </div>

          {/* Step number */}
          <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-[10px] font-black text-gray-400">{index + 1}</span>
          </div>
        </div>

        {/* Description — full width below */}
        <p className="text-sm text-gray-600 leading-relaxed border-t border-white/60 pt-3">
          {description}
        </p>
      </div>
    </div>
  );
}
