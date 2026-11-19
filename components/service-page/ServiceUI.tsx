export function Eyebrow({ children, tone = 'green' }: { children: string; tone?: 'green' | 'ink' }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${tone === 'green' ? 'bg-[#22C55E] text-[#0B0F0D]' : 'bg-[#0B0F0D] text-[#16A34A]'}`}>
      <span aria-hidden="true" className={`size-2 rounded-full ${tone === 'green' ? 'bg-[#0B0F0D]' : 'bg-[#22C55E]'}`} />
      {children}
    </span>
  );
}
