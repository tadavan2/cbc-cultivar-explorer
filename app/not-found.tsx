import Link from "next/link";

/**
 * Mirrors cbc-homepage marketing 404; URLs target www + cultivars home.
 */

export default function NotFound() {
  return (
    <div className="cbc-marketing-not-found relative z-10 min-h-screen bg-[var(--cbc-blue)] flex items-center justify-center px-4 py-14 sm:py-16">
      <div className="w-full max-w-xl text-center">
        <div className="inline-block bg-[var(--cbc-red)] text-white text-sm font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
          Page Not Found
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">
          Oops! This page<br />
          doesn&apos;t exist.
        </h1>

        <p className="text-white/80 text-lg mb-10 leading-relaxed">
          The page you&apos;re looking for may have moved or no longer exists.
          <br />
          Let&apos;s get you back on track.
        </p>

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

        <nav className="mt-16 border-t border-white/20 pt-10" aria-label="Quick links to main site">
          <p className="text-white/60 text-sm mb-5">Quick Links</p>
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
  );
}
