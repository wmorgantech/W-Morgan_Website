import { AlertCircle, Inbox } from "lucide-react";

/**
 * Shared loading / empty / error states for API-driven sections.
 * Skeletons mirror the layout they stand in for, so content does not jump.
 * `dark` switches the palette for sections on the dark-green background.
 */

const pulse = (dark) =>
  `animate-pulse rounded ${dark ? "bg-white/10" : "bg-[#101512]/[0.07]"}`;

function Bar({ dark, className = "" }) {
  return <div className={`${pulse(dark)} ${className}`} />;
}

function SkeletonCard({ dark, lines = 2, className = "" }) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        dark ? "border-white/10 bg-white/[0.03]" : "border-[#101512]/10 bg-white"
      } ${className}`}
    >
      <Bar dark={dark} className="h-8 w-8 rounded-md" />
      <Bar dark={dark} className="mt-5 h-3.5 w-2/3" />
      {Array.from({ length: lines }, (_, i) => (
        <Bar key={i} dark={dark} className={`mt-2.5 h-2.5 ${i === lines - 1 ? "w-1/2" : "w-full"}`} />
      ))}
    </div>
  );
}

export function LoadingState({ label = "Loading…", variant = "cards", dark = false }) {
  let body;

  if (variant === "marquee") {
    body = (
      <div className="flex gap-6 overflow-hidden py-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={`flex shrink-0 items-center gap-3 rounded-lg border px-4 py-3 ${
              dark ? "border-white/10" : "border-[#101512]/10 bg-[#f5f5f0]"
            }`}
          >
            <Bar dark={dark} className="h-9 w-9" />
            <div>
              <Bar dark={dark} className="h-2.5 w-28" />
              <Bar dark={dark} className="mt-2 h-2 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (variant === "quotes") {
    body = (
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="border-t border-white/15 pt-5">
            <Bar dark={dark} className="h-2.5 w-full" />
            <Bar dark={dark} className="mt-2.5 h-2.5 w-11/12" />
            <Bar dark={dark} className="mt-2.5 h-2.5 w-2/3" />
            <Bar dark={dark} className="mt-6 h-3 w-1/3" />
          </div>
        ))}
      </div>
    );
  } else if (variant === "bento") {
    body = (
      <div className="grid auto-rows-[minmax(150px,auto)] gap-4 md:grid-cols-3">
        <SkeletonCard dark={dark} lines={3} className="md:col-span-2 md:row-span-2" />
        {Array.from({ length: 5 }, (_, i) => (
          <SkeletonCard key={i} dark={dark} />
        ))}
      </div>
    );
  } else if (variant === "rows") {
    body = (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonCard key={i} dark={dark} lines={2} />
        ))}
      </div>
    );
  } else {
    body = (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonCard key={i} dark={dark} lines={3} />
        ))}
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {body}
    </div>
  );
}

export function EmptyState({ message, dark = false }) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center ${
        dark ? "border-white/20" : "border-[#101512]/15 bg-white/60"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          dark ? "bg-white/10 text-white/70" : "bg-[#17261f]/[0.07] text-[#17261f]"
        }`}
      >
        <Inbox size={17} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <p className={`text-sm ${dark ? "text-white/70" : "text-[#5f6661]"}`}>{message}</p>
    </div>
  );
}

export function ErrorState({ message, dark = false }) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border px-4 py-4 ${
        dark ? "border-white/15 bg-white/[0.04] text-white/80" : "border-[#c5221f]/20 bg-[#c5221f]/[0.04] text-[#101512]"
      }`}
    >
      <AlertCircle size={18} strokeWidth={1.7} className="mt-0.5 shrink-0 text-[#c5221f]" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold">We couldn't load this right now.</p>
        <p className={`mt-0.5 text-xs ${dark ? "text-white/60" : "text-[#5f6661]"}`}>{message}</p>
      </div>
    </div>
  );
}
