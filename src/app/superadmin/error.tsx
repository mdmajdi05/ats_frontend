'use client';

export default function SuperAdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0D0D20] flex items-center justify-center text-white">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-400 mb-4">Error</h1>
        <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-purple-300/60 mb-8">{error.message || 'An unexpected error occurred.'}</p>
        <button onClick={reset} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );
}
