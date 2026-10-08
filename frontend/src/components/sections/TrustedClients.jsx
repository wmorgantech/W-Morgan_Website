import en3Logo from '@/assets/en3 logo.png';
import pantopoleioLogo from '@/assets/Pantopoleio logo.avif';
import annaiPackersLogo from '@/assets/Annai packer logo.png';
import tamilVelanLogo from '@/assets/Tamilvelan logo.png';

const trustedClients = [
  { name: 'EN3', logo: en3Logo, scale: 'scale-[1.2]' },
  { name: 'Pantopoleio', logo: pantopoleioLogo, scale: 'scale-[1.1]' },
  { name: 'Annai Packers', logo: annaiPackersLogo, scale: 'scale-[1.2]' },
  { name: 'TamilVelan', logo: tamilVelanLogo, scale: 'scale-[1.05]' },
];

function ClientItem({ client }) {
  return (
    <div className="group flex shrink-0 items-center gap-3">
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#0e1411]/10 bg-white shadow-[0_4px_14px_-8px_rgba(8,18,13,0.4)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#2faa7d]/50">
        <img
          src={client.logo}
          alt={`${client.name} logo`}
          className={`h-[80%] w-[80%] object-contain opacity-80 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 ${client.scale}`}
        />
      </div>

      <span className="whitespace-nowrap text-[14px] font-semibold tracking-[-0.01em] text-[#2a332d] transition-colors duration-300 group-hover:text-[#0e1411]">
        {client.name}
      </span>
    </div>
  );
}

function TrustedClients() {
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
              {trustedClients.map((client) => (
                <ClientItem key={`first-${client.name}`} client={client} />
              ))}
            </div>

            {/* Duplicate set for seamless looping */}
            <div className="flex items-center gap-12 px-6 md:gap-16 md:px-8" aria-hidden="true">
              {trustedClients.map((client) => (
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
