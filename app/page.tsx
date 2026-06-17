import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-4xl mb-4">
          ⚡ Trend Radar
        </div>
        <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Emerging signal intelligence for brand consulting across tech, fashion, beauty, and culture.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/feed"
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 text-left"
          >
            <div className="text-2xl mb-3">📡</div>
            <h2 className="font-bold text-gray-900 mb-1">Signal Feed</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Browse and search all tracked signals by category and strength.
            </p>
          </Link>

          <Link
            href="/canvas"
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 text-left"
          >
            <div className="text-2xl mb-3">🗺️</div>
            <h2 className="font-bold text-gray-900 mb-1">Signal Canvas</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Visual node map — arrange, connect, and edit signals, add your own.
            </p>
          </Link>

          <Link
            href="/reports"
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 text-left"
          >
            <div className="text-2xl mb-3">📋</div>
            <h2 className="font-bold text-gray-900 mb-1">Report Builder</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Generate strategic brand briefs from selected signals. Export as markdown.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
