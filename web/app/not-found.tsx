import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0F0D] text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="relative z-10 flex flex-col items-center max-w-md">
        <span className="font-mono text-sm tracking-widest text-[#22C55E] uppercase mb-4">
          404 — Page Not Found
        </span>
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-white tracking-tight mb-4">
          Lost in Space?
        </h1>
        <p className="text-sm text-[#9FB0A7] leading-relaxed mb-8">
          The page you are looking for doesn&apos;t exist or has been moved to another coordinate.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm transition-colors shadow-lg shadow-[#16A34A]/25"
        >
          Return to LeadsGrow
        </Link>
      </div>
    </div>
  );
}

