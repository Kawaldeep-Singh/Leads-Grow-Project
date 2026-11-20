import Link from 'next/link';

export function ServiceBreadcrumb({ current }: { current: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 font-mono text-[clamp(10px,2.6vw,12px)] tracking-[0.12em] text-[#22C55E] sm:tracking-[0.2em]">
      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-[#22C55E]" />
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
          <li aria-hidden="true" className="opacity-60">/</li>
          <li><Link href="/#services" className="transition-colors hover:text-white">Service</Link></li>
          <li aria-hidden="true" className="opacity-60">/</li>
          <li aria-current="page" className="min-w-0 text-white/80">{current}</li>
        </ol>
      </nav>
    </div>
  );
}
