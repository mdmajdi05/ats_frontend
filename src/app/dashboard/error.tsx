'use client';

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Error</h1>
        <h2 className="text-2xl font-semibold text-navy mb-2">Something went wrong</h2>
        <p className="text-text-muted mb-8">{error.message || 'An unexpected error occurred.'}</p>
        <button onClick={reset} className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );
}
