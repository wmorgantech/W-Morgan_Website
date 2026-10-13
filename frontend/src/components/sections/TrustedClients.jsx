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
    <div className="group flex shrink-0 items-center gap-3">
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#0e1411]/10 bg-white shadow-[0_4px_14px_-8px_rgba(8,18,13,0.4)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#2faa7d]/50">
        {client.logo ? (
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            className={`h-[80%] w-[80%] object-contain opacity-80 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 ${client.scale}`}
          />
        ) : (
          <span
            aria-hidden="true"
            className="font-mono text-xs font-medium text-[#176b4d]"
          >
            {initialsOf(client.name)}
          </span>
        )}
      </div>

      <span className="whitespace-nowrap text-[14px] font-semibold tracking-[-0.01em] text-[#2a332d] transition-colors duration-300 group-hover:text-[#0e1411]">
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
    <section className="relative overflow-hidden border-b border-[#0e1411]/10 bg-white py-7 md:py-8">
      <div className="mx-auto grid max-w-7xl items-center gap-5 px-5 sm:px-8 lg:grid-cols-[auto_1fr] lg:gap-10 lg:px-12">
        {/* Label */}
        <div className="lg:w-56 lg:border-r lg:border-[#0e1411]/10 lg:pr-8">
          <p className="mono-label text-[#176b4d]">Our Clients</p>
          <h2 className="mt-1.5 font-serif text-[22px] leading-tight tracking-[-0.01em] text-[#0e1411] md:text-[24px]">
            Trusted by leading companies
          </h2>
        </div>

        {/* Marquee */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-white to-transparent md:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-white to-transparent md:w-20" />

          <div className="animate-trusted-marquee flex w-max">
            <div className="flex items-center gap-12 px-6 md:gap-16 md:px-8">
              {clients.map((client) => (
                <ClientItem key={`first-${client.name}`} client={client} />
              ))}
            </div>

            {/* Duplicate set for seamless looping */}
            <div className="flex items-center gap-12 px-6 md:gap-16 md:px-8" aria-hidden="true">
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
