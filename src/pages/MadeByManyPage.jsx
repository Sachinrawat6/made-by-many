import { useUrlParams }    from "@/hooks/useUrlParams";
import { useOrderData }    from "@/hooks/useOrderData";
import { Header }          from "@/components/layout/Header";
import { TeamTimeline }    from "@/components/order/TeamTimeline";
import { OrderHero }       from "@/components/order/OrderHero";

/**
 * MadeByManyPage — main page component.
 *
 * Reads orderId from URL → fetches order → renders hero + team timeline.
 */
export default function MadeByManyPage() {
  const { orderId } = useUrlParams();
  const { status, team, productInfo, error, refetch } = useOrderData(orderId);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header orderId={orderId} />

      {/* Page body */}
      <main className="max-w-lg mx-auto pb-16">

        {/* Hero: product + order info */}
        <OrderHero productInfo={productInfo} orderId={orderId} />

        {/* Team timeline */}
        <div className="px-4">
          <TeamTimeline
            status={status}
            team={team}
            error={error}
            onRetry={refetch}
          />
        </div>

        {/* Footer */}
        {status === "success" && (
          <div className="mt-10 flex flex-col items-center gap-3 animate-fade-in px-4">
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-400 to-pink-400" />
            <p className="text-xs text-gray-400 text-center">
              Made with love & craft by the Qurvii team
            </p>
            <div className="flex -space-x-2">
              {team.map((m) => (
                <div
                  key={m.id}
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-sm`}
                  title={m.name}
                >
                  {m.name[0]}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
