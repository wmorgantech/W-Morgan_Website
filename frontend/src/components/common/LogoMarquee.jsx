function LogoMarquee({ items }) {
  const track = [...items, ...items];

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-16 group-hover:[animation-play-state:paused]">
        {track.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center gap-2 whitespace-nowrap text-muted grayscale transition-all duration-300 hover:text-foreground hover:grayscale-0"
          >
            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoMarquee;
