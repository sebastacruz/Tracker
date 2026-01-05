/**
 * PullToRefreshIndicator - Visual feedback for pull-to-refresh
 */
export default function PullToRefreshIndicator({ isPulling, pullDistance, isRefreshing }) {
  if (!isPulling && !isRefreshing) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200"
      style={{
        transform: `translateY(${Math.min(pullDistance, 80)}px)`,
        opacity: Math.min(pullDistance / 80, 1),
      }}
    >
      <div className="bg-slate-800/90 rounded-full p-3 shadow-lg backdrop-blur-sm border border-slate-700">
        {isRefreshing ? (
          <svg
            className="animate-spin h-6 w-6 text-emerald-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="h-6 w-6 text-emerald-500 transition-transform"
            style={{
              transform: `rotate(${Math.min(pullDistance * 2, 180)}deg)`,
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
