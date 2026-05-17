import Link from "next/link";

const nav = [
  ["Travel", "/travel"],
  ["Expat Life", "/expat-life"],
  ["Dutch Culture", "/dutch-culture"],
  ["Where to Stay", "/where-to-stay"],
  ["About", "/about"]
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-white/95 backdrop-blur">
      <div className="container-padded flex h-20 items-center justify-between gap-8">
        <Link href="/" className="text-xl font-semibold tracking-tight text-navy">
          Netherlands<span className="text-orange">Best</span>.nl
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink/80 md:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-orange">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
