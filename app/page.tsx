import Link from "next/link";
import { MOCK_SIGNALS } from "@/lib/signals";

const strong = MOCK_SIGNALS.filter((s) => s.strength === "strong").length;
const emerging = MOCK_SIGNALS.filter((s) => s.strength === "emerging").length;
const weak = MOCK_SIGNALS.filter((s) => s.strength === "weak").length;

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          Good morning.
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-lg">
          Your signal intelligence platform for emerging technology across fashion, beauty, lifestyle, and culture.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-3xl font-bold text-gray-900 mb-1">{MOCK_SIGNALS.length}</div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total signals</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-3xl font-bold text-green-600 mb-1">{strong}</div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Strong trends</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-3xl font-bold text-amber-500 mb-1">{emerging}</div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Emerging</div>
        </div>
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-1 gap-4 mb-10">
        <Link href="/feed" className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">📡</span>
              <h2 className="font-bold text-gray-900 text-base">Signal Feed</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Browse all {MOCK_SIGNALS.length} tracked signals. Search by keyword, filter by category or signal strength.
            </p>
          </div>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-xl ml-6">→</span>
        </Link>

        <Link href="/canvas" className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">⬡</span>
              <h2 className="font-bold text-gray-900 text-base">Signal Canvas</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Visual node map. Drag, connect, and edit signals. Add your own manual signals. Generate reports directly from the canvas.
            </p>
          </div>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-xl ml-6">→</span>
        </Link>

        <Link href="/reports" className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">▤</span>
              <h2 className="font-bold text-gray-900 text-base">Report Builder</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Select signals, write a brief, and generate a structured strategic report for brand consulting. Export as markdown.
            </p>
          </div>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-xl ml-6">→</span>
        </Link>
      </div>

      {/* Latest signals preview */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Latest signals</h2>
        <div className="space-y-2">
          {MOCK_SIGNALS.slice(0, 5).map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                s.strength === "strong" ? "bg-green-50 text-green-700" :
                s.strength === "emerging" ? "bg-amber-50 text-amber-700" :
                "bg-gray-100 text-gray-500"
              }`}>
                {s.strength}
              </span>
              <span className="text-sm text-gray-700 font-medium">{s.title}</span>
              <span className="text-xs text-gray-400 ml-auto">{s.category.replace("-", " ")}</span>
            </div>
          ))}
        </div>
        <Link href="/feed" className="mt-4 inline-block text-xs text-indigo-600 font-medium hover:text-indigo-800">
          View all signals →
        </Link>
      </div>
    </div>
  );
}
