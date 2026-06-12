export default function Footer() {
  return (
    <footer className="py-8 px-6 max-w-6xl mx-auto w-full border-t border-white/5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-[#f0f0f0]/20 tracking-widest uppercase">
          © 2026 Drucker Nguyen
        </p>
        <p className="font-mono text-xs text-[#f0f0f0]/20 tracking-widest uppercase">
          Built with Next.js & Tailwind
        </p>
      </div>
    </footer>
  );
}
