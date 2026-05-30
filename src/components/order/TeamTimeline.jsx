import { TeamMemberCard } from "./TeamMemberCard";
import { TeamMemberCardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

/**
 * TeamTimeline
 *
 * Renders the full vertical timeline of team members.
 * Handles loading skeletons and error states internally.
 */
export function TeamTimeline({ status, team, error, onRetry }) {
  if (status === "loading") {
    return (
      <div className="space-y-4 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <TeamMemberCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">No Order ID</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Please add <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">?orderId=YOUR_ID</code> to the URL.
        </p>
      </div>
    );
  }

  if (status === "success" && team.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-sm text-gray-500">No team data available for this order.</p>
      </div>
    );
  }

  return (
    <div className="pt-2">
      {team.map((member, index) => (
        <TeamMemberCard
          key={member.id}
          member={member}
          index={index}
          isLast={index === team.length - 1}
        />
      ))}
    </div>
  );
}
