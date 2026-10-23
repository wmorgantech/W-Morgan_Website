import { useEffect, useState } from 'react';
import en3Logo from '@/assets/en3 logo.png';
import pantopoleioLogo from '@/assets/Pantopoleio logo.avif';
import annaiPackersLogo from '@/assets/Annai packer logo.png';
import { fetchPublicPortfolio } from '@/lib/api';
import { validImageUrl } from '@/lib/portfolioApi';

/*
 * The client list comes from the published Portfolio projects (Admin → Portfolio,
 * "Client"), so it can never disagree with the portfolio. A client's logo is the
 * "Client logo" uploaded in Admin on its project. Where none has been uploaded yet,
 * the bundled logos below are matched by client name; a client without either gets
 * a neutral initials tile.
 */
const knownLogos = [
  { match: /en3/i, logo: en3Logo, scale: 'scale-[1.2]' },
  { match: /pantopoleio/i, logo: pantopoleioLogo, scale: 'scale-[1.1]' },
  { match: /annai packers/i, logo: annaiPackersLogo, scale: 'scale-[1.2]' },
];

function uniqueClients(projects) {
  const seen = new Set();

  return projects
    .map((project) => (project.clientName || '').trim())
    .filter((name) => {
      const key = name.toLowerCase();
      if (!name || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((name) => {
      // Any of this client's projects may carry the logo uploaded in Admin.
      const uploaded = projects
        .filter((project) => (project.clientName || '').trim().toLowerCase() === name.toLowerCase())
        .map((project) => validImageUrl(project.clientLogo))
        .find(Boolean);
      if (uploaded) return { name, logo: uploaded, scale: '' };

      const known = knownLogos.find((entry) => entry.match.test(name));
      return { name, logo: known?.logo, scale: known?.scale ?? '' };
    });
}

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter((word) => /^[a-z0-9]/i.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function ClientItem({ client }) {
  return (
    <div className="group flex w-32 shrink-0 flex-col items-center gap-2 text-center">
      <div className="relative flex h-20 w-full items-center justify-center overflow-hidden rounded-xl border border-[#0e1411]/10 bg-white px-3 py-2 shadow-[0_4px_14px_-8px_rgba(8,18,13,0.22)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#2faa7d]/50 md:h-24">
        {client.logo ? (
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            className={`h-full w-full object-contain ${client.scale}`}
          />
        ) : (
          <span
            aria-hidden="true"
            className="font-mono text-lg font-medium text-[#176b4d]"
          >
            {initialsOf(client.name)}
          </span>
        )}
      </div>

      <span className="max-w-full truncate text-xs font-semibold tracking-[-0.01em] text-[#2a332d] transition-colors duration-300 group-hover:text-[#0e1411]">
        {client.name}
      </span>
    </div>
  );
}

function TrustedClients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    let active = true;

    fetchPublicPortfolio()
      .then((projects) => {
        if (active && Array.isArray(projects)) setClients(uniqueClients(projects));
      })
      .catch(() => {
        // The strip is decorative; it simply stays hidden if the API is unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  if (!clients.length) return null;

  return (
    <section className="relative overflow-hidden border-y border-[#0e1411]/10 bg-[#f6f6f1] py-8 md:py-10">
      <div data-aos="fade-up" className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-6 text-center">
          <p className="mono-label text-[#176b4d]">Our Clients</p>
          <h2 className="mt-1.5 font-serif text-[19px] leading-tight tracking-[-0.01em] text-[#0e1411] md:text-[22px]">
            Trusted by businesses building what’s next
          </h2>
        </div>
        {/* Marquee */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-[#f6f6f1] to-transparent md:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-[#f6f6f1] to-transparent md:w-20" />

          <div className="animate-trusted-marquee flex w-max">
            <div className="flex items-center gap-6 px-4 sm:gap-8 md:gap-10">
              {clients.map((client) => (
                <ClientItem key={`first-${client.name}`} client={client} />
              ))}
            </div>

            {/* Duplicate set for seamless looping */}
            <div className="flex items-center gap-6 px-4 sm:gap-8 md:gap-10" aria-hidden="true">
              {clients.map((client) => (
                <ClientItem key={`second-${client.name}`} client={client} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes trustedMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .animate-trusted-marquee {
          animation: trustedMarquee 24s linear infinite;
          will-change: transform;
        }

        .animate-trusted-marquee:hover {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .animate-trusted-marquee {
            animation-duration: 18s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-trusted-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default TrustedClients;
