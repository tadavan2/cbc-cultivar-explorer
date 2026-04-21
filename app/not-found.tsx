import Link from "next/link";

/**
 * Custom 404 — layout/icons match cbc-homepage `app/not-found.tsx`; links target cultivars vs www.
 * Keep structure/classes in sync when updating either app.
 */

export default function NotFound() {
  return (
    <div className="relative z-10 min-h-screen bg-[var(--cbc-blue)] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="inline-block bg-[var(--cbc-red)] text-white text-sm font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
          Page Not Found
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">
          Oops! This page<br />
          doesn&apos;t exist.
        </h1>

        <p className="text-white/80 text-lg mb-8 leading-relaxed">
          The page you&apos;re looking for may have moved or no longer exists. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-hover-gold bg-[var(--cbc-gold)] text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] focus-visible:outline-none"
          >
            Go Home
          </Link>
          <a
            href="https://www.cbcberry.com"
            className="btn-hover-ghost bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] focus-visible:outline-none"
          >
            CBC Homepage
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-white/60 text-sm mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <a
              href="https://www.cbcberry.com/breeding"
              className="text-[var(--cbc-gold)] hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] focus-visible:outline-none rounded"
            >
              Breeding Program
            </a>
            <a
              href="https://www.cbcberry.com/about"
              className="text-[var(--cbc-gold)] hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] focus-visible:outline-none rounded"
            >
              About Us
            </a>
            <a
              href="https://www.cbcberry.com/contact"
              className="text-[var(--cbc-gold)] hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] focus-visible:outline-none rounded"
            >
              Contact
            </a>
            <a
              href="https://www.cbcberry.com/careers"
              className="text-[var(--cbc-gold)] hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[var(--cbc-gold)] focus-visible:outline-none rounded"
            >
              Careers
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
