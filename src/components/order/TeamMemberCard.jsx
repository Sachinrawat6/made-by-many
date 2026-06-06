import { Avatar } from '@/components/ui/Avatar';
import clsx from 'clsx';

export function TeamMemberCard({ member, index, isLast, avatarsReady }) {
  const { role, name, icon, image, description, gradient, bgLight, textColor, borderColor } =
    member;
  const isEven = index % 2 === 0; // even → avatar left, odd → avatar right

  return (
    <div className="relative animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
      <div
        className={clsx(
          'relative z-10 mb-6 rounded-2xl border p-4 shadow-sm transition-all duration-200',
          'hover:shadow-md hover:-translate-y-0.5',
          bgLight,
          borderColor
        )}
      >
        {/* Top row: Avatar + Name/Role — alternating sides */}
        <div className={clsx('flex items-center gap-3 mb-3', !isEven && 'flex-row-reverse')}>
          {/* Avatar with icon badge */}
          <div className="relative flex-shrink-0">
            <Avatar
              name={name}
              image={image}
              avatarsReady={avatarsReady}
              gradient={gradient}
              size="lg"
            />
          </div>

          {/* Name + Role */}
          <div className={clsx('flex-1 min-w-0', !isEven && 'text-right')}>
            <p className="text-xl font-black text-gray-900 leading-tight truncate">{name}</p>
            <p
              className={clsx('text-[11px] font-bold uppercase tracking-widest mt-0.5', textColor)}
            >
              {role}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed border-t border-white/60 pt-3">
          {description}
        </p>
      </div>
    </div>
  );
}
