export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center gutter">
      <div className="space-y-6 text-center measure">
        <span
          aria-hidden
          className="mx-auto block size-2 rounded-full bg-dot"
          style={{ boxShadow: "0 0 24px var(--dot-glow)" }}
        />
        <h1 className="font-serif text-4xl font-light tracking-tight text-balance text-fg-strong sm:text-5xl">
          Ujjawal Bansal
        </h1>
        <p className="font-mono text-xs tracking-widest text-fg-faint uppercase">Phase 0 · foundation laid</p>
      </div>
    </main>
  );
}
