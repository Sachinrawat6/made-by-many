/**
 * Header — sticky top bar, red & black theme.
 */
export function Header({ orderId }) {
  return (
    <header className="sticky top-0 z-30 bg-black shadow-lg">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* Red Q logo */}
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white text-sm font-black tracking-tight">Q</span>
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-tight tracking-tight">
              Made by Many
            </h1>
            {orderId && (
              <p className="text-[11px] text-red-400 leading-none mt-0.5 font-semibold">
                Order #{orderId}
              </p>
            )}
          </div>
        </div>

        {/* Right: decorative red accent bar */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-5 rounded-full bg-red-600" />
          <div className="w-1.5 h-3 rounded-full bg-red-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-900" />
        </div>
      </div>

      {/* Red bottom accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-red-700 via-red-500 to-red-700" />
    </header>
  );
}
