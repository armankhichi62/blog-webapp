type AuthVisualProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function AuthVisual({ eyebrow, title, description }: AuthVisualProps) {
  return (
    <section className="relative hidden overflow-hidden rounded-3xl bg-blue-600 p-10 text-white shadow-xl shadow-blue-200 lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-blue-400/40" />
      <div className="relative">
        <div className="mb-14 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-black text-blue-600 shadow-lg">
          Iw
        </div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">{eyebrow}</p>
        <h2 className="max-w-md text-4xl font-semibold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h2>
        <p className="mt-5 max-w-md text-sm leading-7 text-blue-100">{description}</p>
      </div>
      <div className="relative mt-12 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
        <p className="text-sm font-semibold leading-6 text-blue-50">
          “A clean place to draft ideas, publish useful stories, and keep your writing organized.”
        </p>
        <p className="mt-3 text-xs font-bold uppercase tracking-widest text-blue-200">Inkwell Workspace</p>
      </div>
    </section>
  );
}
