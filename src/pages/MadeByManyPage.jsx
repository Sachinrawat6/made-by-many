import { useUrlParams }           from "@/hooks/useUrlParams";
import { useOrderData }           from "@/hooks/useOrderData";
import { useCloudinaryAvatars }   from "@/hooks/useCloudinaryAvatars";
import { Header }                 from "@/components/layout/Header";
import { TeamTimeline }           from "@/components/order/TeamTimeline";
import { OrderHero }              from "@/components/order/OrderHero";

export default function MadeByManyPage() {
  const { orderId } = useUrlParams();
  const { status, team, productInfo, error, refetch } = useOrderData(orderId);
  const { ready: avatarsReady, getUrl } = useCloudinaryAvatars();

  // Inject matched Cloudinary photo into each team member
  const teamWithAvatars = team.map((member) => ({
    ...member,
    image: member.image ?? getUrl(member.name),
  }));

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header orderId={orderId} />

      <main className="max-w-lg mx-auto pb-16">
        <OrderHero productInfo={productInfo} orderId={orderId} />

        <div className="px-4">
          <TeamTimeline
            status={status}
            team={teamWithAvatars}
            error={error}
            onRetry={refetch}
            avatarsReady={avatarsReady}
          />
        </div>

        {status === "success" && (
          <div className="mt-10 flex flex-col items-center gap-3 animate-fade-in px-4">
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-400 to-pink-400" />
            <p className="text-xs text-gray-400 text-center">
              Made with love & craft by the Qurvii team
            </p>
            <div className="flex -space-x-2">
              {teamWithAvatars.map((m) => (
                m.image
                  ? <img
                      key={m.id}
                      src={m.image}
                      alt={m.name}
                      title={m.name}
                      className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  : <div
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
