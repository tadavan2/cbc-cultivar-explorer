import Link from "next/link";

/**
 * Marketing-style 404 for cultivars subdomain — aligned with cbc-homepage tone.
 */

export default function NotFound() {
  const year = new Date().getFullYear();

  return (
    <div className="cbc-marketing-not-found relative z-10 flex min-h-screen flex-col bg-[var(--cbc-blue)]">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-xl text-center">
          <p className="mb-5 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
            Cultivar Explorer
          </p>

          <div className="inline-block bg-[var(--cbc-red)] text-white text-sm font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
            Page Not Found
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">
            Oops! This page<br />
            doesn&apos;t exist.
          </h1>

          <p className="text-white/80 text-lg mb-3 leading-relaxed">
            The page you&apos;re looking for may have moved or no longer exists.
            <br />
            Let&apos;s get you back on track.
          </p>
          <p className="mb-10 text-sm text-white/60">Pick a destination below.</p>

          <div className="not-found-actions">
            <Link
              href="/"
              className="not-found-btn not-found-btn--primary btn-hover-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cbc-blue)]"
            >
              Back to Cultivar Explorer
            </Link>
            <a
              href="https://www.cbcberry.com"
              className="not-found-btn not-found-btn--ghost btn-hover-ghost focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cbc-blue)]"
            >
              CBC Homepage
            </a>
          </div>

          <nav
            className="mt-14 border-t border-white/20 pt-9"
            aria-label="Quick links to main site"
          >
            <p className="mb-4 text-sm text-white/60">Quick Links</p>
            <div className="not-found-quicklinks text-sm">
              <Link
                href="https://www.cbcberry.com/breeding"
                className="text-[var(--cbc-gold)] transition-colors hover:text-white visited:text-[var(--cbc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] rounded"
              >
                Breeding Program
              </Link>
              <Link
                href="https://www.cbcberry.com/about"
                className="text-[var(--cbc-gold)] transition-colors hover:text-white visited:text-[var(--cbc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] rounded"
              >
                About Us
              </Link>
              <Link
                href="https://www.cbcberry.com/contact"
                className="text-[var(--cbc-gold)] transition-colors hover:text-white visited:text-[var(--cbc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] rounded"
              >
                Contact
              </Link>
              <Link
                href="https://www.cbcberry.com/careers"
                className="text-[var(--cbc-gold)] transition-colors hover:text-white visited:text-[var(--cbc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] rounded"
              >
                Careers
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <footer className="not-found-site-footer shrink-0 border-t border-white/15 bg-black/20 px-4 py-6 text-center">
        <p className="text-[13px] text-white/55">
          © {year} California Berry Cultivars
        </p>
        <p className="mt-2 text-xs text-white/45">
          <a
            href="https://www.cbcberry.com"
            className="font-medium text-[var(--cbc-gold)]/90 transition-colors hover:text-white visited:text-[var(--cbc-gold)]"
          >
            cbcberry.com
          </a>
          <span className="text-white/35"> · </span>
          Strawberry genetics &amp; licensing
        </p>
      </footer>
    </div>
  );
}
