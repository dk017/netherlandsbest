import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-navy/10 bg-white">
      <div className="container-padded grid gap-10 py-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-lg font-semibold text-navy">
            Netherlands<span className="text-orange">Best</span>.nl
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-ink/65">
            Premium travel, culture, where-to-stay, and expat guides for people who want the Netherlands to feel clear, beautiful, and usable.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-ink/75 md:justify-end">
          <Link href="/travel">Travel</Link>
          <Link href="/expat-life">Expat Life</Link>
          <Link href="/dutch-culture">Dutch Culture</Link>
          <Link href="/where-to-stay">Where to Stay</Link>
          <Link href="/about">About</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
      <div className="container-padded border-t border-navy/10 py-6 text-sm text-ink/55">
        Copyright {new Date().getFullYear()} NetherlandsBest.nl
      </div>
    </footer>
  );
}
