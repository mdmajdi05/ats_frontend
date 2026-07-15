import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-emerald-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  );
}
