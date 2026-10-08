/**
 * Flat, CSS-only visuals (no images, no 3D). Colours follow the brand tokens:
 * off-white #f5f5f0, dark green #17261f, black #101512, red accent #ff3b30.
 */

const layers = [
  { no: "01", name: "Interface", tags: "Web · Mobile · Design system" },
  { no: "02", name: "Application", tags: "APIs · Services · Automation" },
  { no: "03", name: "Platform", tags: "Cloud · DevOps · Security" },
  { no: "04", name: "Data", tags: "Analytics · AI · Reporting" },
];

const offsets = ["", "sm:ml-6", "sm:ml-12", "sm:ml-[4.5rem]"];

/** Hero visual: an architecture stack, one flat layer per row. */
export function LayerStack({ className = "" }) {
  return (
    <div className={`w-full max-w-[460px] ${className}`} aria-hidden="true">
      <div className="space-y-2.5">
        {layers.map((layer, i) => (
          <div
            key={layer.no}
            className={`flex items-center justify-between gap-4 rounded-md border px-4 py-3.5 sm:px-5 sm:py-4 ${offsets[i]} ${
              i === 0
                ? "border-[#17261f] bg-[#17261f] text-white"
                : "border-[#101512]/15 bg-white text-[#101512]"
            }`}
          >
            <div className="flex items-baseline gap-3">
              <span className="text-[11px] font-semibold tracking-[0.16em] text-[#ff3b30]">
                {layer.no}
              </span>
              <span className="text-[15px] font-semibold tracking-tight">{layer.name}</span>
            </div>
            <span
              className={`hidden text-[11px] sm:block ${
                i === 0 ? "text-white/60" : "text-[#5f6661]"
              }`}
            >
              {layer.tags}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Project thumbnail drawn with plain boxes. */
export function ProjectPreview({ variant = "commerce", className = "" }) {
  const frame = `relative aspect-[16/10] w-full overflow-hidden rounded-md border border-[#101512]/10 bg-[#f5f5f0] ${className}`;

  if (variant === "dashboard") {
    const bars = [38, 62, 46, 78, 54, 90, 66];
    return (
      <div className={frame} aria-hidden="true">
        <div className="absolute inset-y-0 left-0 w-[22%] bg-[#17261f] p-3">
          <div className="h-1.5 w-7 rounded-sm bg-[#ff3b30]" />
          <div className="mt-4 space-y-2">
            {[70, 55, 62, 48].map((w, i) => (
              <div key={i} className="h-1.5 rounded-sm bg-white/25" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div className="absolute inset-y-0 left-[22%] right-0 p-4">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-sm border border-[#101512]/10 bg-white p-2">
                <div className="h-1 w-6 rounded-sm bg-[#101512]/20" />
                <div className="mt-2 h-2.5 w-9 rounded-sm bg-[#17261f]" />
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-[46%] items-end gap-1.5 rounded-sm border border-[#101512]/10 bg-white px-3 pb-2 pt-3">
            {bars.map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${i === 5 ? "bg-[#ff3b30]" : "bg-[#17261f]/80"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={`${frame} flex items-center justify-center gap-4`} aria-hidden="true">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`h-[78%] w-[26%] rounded-lg border-2 border-[#17261f] bg-white p-2 ${
              i === 1 ? "translate-y-3" : "-translate-y-2"
            }`}
          >
            <div className="mx-auto h-1 w-4 rounded-sm bg-[#17261f]/30" />
            <div className={`mt-3 h-8 rounded-sm ${i === 0 ? "bg-[#17261f]" : "bg-[#17261f]/15"}`} />
            <div className="mt-2 space-y-1.5">
              <div className="h-1.5 w-full rounded-sm bg-[#101512]/15" />
              <div className="h-1.5 w-4/5 rounded-sm bg-[#101512]/15" />
              <div className="h-1.5 w-3/5 rounded-sm bg-[#ff3b30]/70" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "automation") {
    const nodes = [
      ["8%", "38%", false],
      ["36%", "16%", false],
      ["36%", "62%", false],
      ["64%", "38%", true],
    ];
    return (
      <div className={frame} aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 62" preserveAspectRatio="none">
          <g fill="none" stroke="#17261f" strokeOpacity="0.35" strokeWidth="0.5" vectorEffect="non-scaling-stroke">
            <path d="M14 24 L40 11" vectorEffect="non-scaling-stroke" />
            <path d="M14 24 L40 40" vectorEffect="non-scaling-stroke" />
            <path d="M40 11 L68 24" vectorEffect="non-scaling-stroke" />
            <path d="M40 40 L68 24" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
        {nodes.map(([left, top, accent], i) => (
          <div
            key={i}
            className={`absolute h-7 w-[22%] rounded-sm border ${
              accent ? "border-[#ff3b30] bg-white" : "border-[#17261f] bg-[#17261f]"
            }`}
            style={{ left, top }}
          />
        ))}
        <div className="absolute bottom-3 right-3 h-1.5 w-10 rounded-sm bg-[#ff3b30]" />
      </div>
    );
  }

  // commerce
  return (
    <div className={frame} aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-[#101512]/10 bg-white px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff3b30]" />
        <span className="h-1.5 w-8 rounded-sm bg-[#101512]/15" />
        <span className="h-1.5 w-6 rounded-sm bg-[#101512]/15" />
        <span className="ml-auto h-3 w-8 rounded-sm bg-[#17261f]" />
      </div>
      <div className="grid grid-cols-3 gap-2.5 p-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-sm border border-[#101512]/10 bg-white p-1.5">
            <div className={`aspect-[4/3] rounded-sm ${i === 1 ? "bg-[#17261f]" : "bg-[#17261f]/10"}`} />
            <div className="mt-1.5 h-1 w-3/4 rounded-sm bg-[#101512]/20" />
            <div className={`mt-1 h-1 w-1/3 rounded-sm ${i === 4 ? "bg-[#ff3b30]" : "bg-[#101512]/15"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Large brand monogram panel: dark green, flat, type only. */
export function MonogramPanel({ caption = "Engineering · Product · Cloud", className = "" }) {
  return (
    <div
      className={`relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden rounded-md bg-[#17261f] p-6 text-white sm:p-8 ${className}`}
      aria-hidden="true"
    >
      <span className="h-1.5 w-8 rounded-sm bg-[#ff3b30]" />
      <span className="select-none text-[clamp(5rem,14vw,9rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-white/95">
        W
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
        {caption}
      </span>
    </div>
  );
}
