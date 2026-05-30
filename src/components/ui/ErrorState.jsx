/**
 * ErrorState — full-width error display with optional retry.
 */
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-3xl">
        😕
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">Something went wrong</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-700 active:scale-95 transition-all"
        >
          <span>↺</span> Try Again
        </button>
      )}
    </div>
  );
}
