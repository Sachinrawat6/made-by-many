import { Link } from "react-router-dom";

/**
 * NotFoundPage — 404 fallback.
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center font-sans">
      <div className="text-6xl mb-6">🧵</div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-xs text-sm">
        This thread has gone astray. The page you&rsquo;re looking for doesn&rsquo;t exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
