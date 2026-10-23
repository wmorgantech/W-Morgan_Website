import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ArrowUpRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "../../routes/paths";
import aboutImg from "../../assets/img2.jpeg";
import introVideo from "../../assets/Introduction video.mp4";
import { fetchPublicSiteSettings } from "../../lib/api";
import { validImageUrl } from "../../lib/portfolioApi";
import Reveal from "../common/Reveal";

const metrics = [
  { value: "Custom", label: "Tailored Software Engineering" },
  { value: "Agile", label: "Rapid Product Delivery" },
];

function getVideoSource(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return null;

    const host = url.hostname.toLowerCase();
    if (host === "youtu.be" || host.endsWith(".youtube.com") || host === "youtube.com" || host.endsWith(".youtube-nocookie.com")) {
      const videoId =
        host === "youtu.be"
          ? url.pathname.split("/").filter(Boolean)[0]
          : url.pathname === "/watch"
            ? url.searchParams.get("v")
            : url.pathname.split("/").filter(Boolean).at(-1);
      return videoId && /^[\w-]{6,}$/.test(videoId)
        ? { kind: "embed", url: `https://www.youtube-nocookie.com/embed/${videoId}` }
        : null;
    }

    if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
      const videoId = url.pathname.split("/").filter(Boolean).at(-1);
      return videoId && /^\d+$/.test(videoId)
        ? { kind: "embed", url: `https://player.vimeo.com/video/${videoId}` }
        : null;
    }

    return /\.(mp4|webm|ogg)$/i.test(url.pathname)
      ? { kind: "video", url: url.href }
      : null;
  } catch {
    return null;
  }
}

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const controlButton =
  "flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#0d1b14]/75 text-white backdrop-blur-md transition hover:bg-[#176b4d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7be0b4]";

/**
 * The introduction video in a framed player. It starts muted and loops (as browsers require for
 * autoplay), pauses while off-screen, and stays paused with the poster for visitors who prefer
 * reduced motion. If the file cannot load, the poster image is shown instead.
 */
function IntroVideo({ source, poster }) {
  const frame = useRef(null);
  const video = useRef(null);
  const onScreen = useInView(frame, { amount: 0.3 });
  const [wantsPlay, setWantsPlay] = useState(() => !prefersReducedMotion());
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  // Play only while the visitor wants it and the player is on screen
  useEffect(() => {
    const node = video.current;
    if (!node || failed) return;
    if (wantsPlay && onScreen) {
      node.play().catch(() => setPlaying(false));
    } else {
      node.pause();
    }
  }, [wantsPlay, onScreen, failed, source]);

  const toggleMuted = useCallback(() => {
    const node = video.current;
    if (!node) return;
    node.muted = !node.muted;
    setMuted(node.muted);
  }, []);

  return (
    <div className="relative">
      {/* offset green hairline frame */}
      <div
        aria-hidden="true"
        className="absolute -bottom-2.5 -right-2.5 h-full w-full rounded-[1.5rem] border border-[#2faa7d]/40"
      />

      <div
        ref={frame}
        className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-[#176b4d]/30 bg-[#0d1b14] shadow-[0_30px_60px_-34px_rgba(8,18,13,0.65)]"
      >
        {failed ? (
          <img src={poster} alt="W Morgan Technologies engineering team at work" className="h-full w-full object-cover" />
        ) : (
          <video
            ref={video}
            src={source}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="W Morgan Technologies introduction video"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08120d]/55 via-transparent to-[#08120d]/10"
        />

        <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0d1b14]/70 px-3 py-1 backdrop-blur-md">
          <span className={`h-1.5 w-1.5 rounded-full bg-[#7be0b4] ${playing ? "animate-pulse" : ""}`} />
          <span className="mono-label text-white/85">Introduction</span>
        </span>

        <span className="mono-label absolute bottom-4 left-4 text-white/80">Tamil Nadu, IN</span>

        {!failed && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMuted}
              aria-label={muted ? "Turn sound on" : "Turn sound off"}
              className={controlButton}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button
              type="button"
              onClick={() => setWantsPlay((value) => !value)}
              aria-label={playing ? "Pause video" : "Play video"}
              className={controlButton}
            >
              {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * "Who we are" summary shown on the Home page.
 * The company values live in one place only (WhyMorganSection on the About
 * page), so they are not repeated here.
 */
export default function AboutSection() {
  const [media, setMedia] = useState({
    imageUrl: aboutImg,
    video: null,
  });

  useEffect(() => {
    let active = true;
    fetchPublicSiteSettings()
      .then((settings) => {
        if (!active) return;
        setMedia({
          imageUrl: validImageUrl(settings.aboutImageUrl) || aboutImg,
          video: getVideoSource(settings.aboutVideoUrl),
        });
      })
      .catch((error) => {
        console.error("Who We Are media settings could not be loaded.", error);
      });
    return () => {
      active = false;
    };
  }, []);

  // A video set in Admin → Settings wins; otherwise the introduction video bundled with the site
  const embed = media.video?.kind === "embed" ? media.video : null;
  const videoSource = media.video?.kind === "video" ? media.video.url : introVideo;

  return (
    <section className="bg-[#f6f6f1] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* VIDEO */}
          <Reveal className="min-w-0">
            {embed ? (
              <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-[#176b4d]/30 bg-[#0d1b14] shadow-[0_30px_60px_-34px_rgba(8,18,13,0.65)]">
                <iframe
                  src={embed.url}
                  title="W Morgan Technologies overview"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="h-full w-full border-0"
                />
              </div>
            ) : (
              <IntroVideo source={videoSource} poster={media.imageUrl} />
            )}
          </Reveal>

          {/* TEXT */}
          <Reveal delay={0.06} className="min-w-0">
            <p className="eyebrow">Who We Are</p>

            <h2 className="display mt-4 text-[clamp(1.6rem,2.8vw,2.3rem)] text-[#0e1411]">
              We turn ideas into <span className="text-[#176b4d]">digital systems.</span>
            </h2>

            <p className="lead mt-4 max-w-lg !text-[0.95rem]">
              W Morgan Technologies is a modern technology partner. We design and engineer
              software products that bring clarity, performance, and long-term business value to
              ambitious companies.
            </p>

            <dl className="mt-5 flex flex-wrap gap-2.5">
              {metrics.map((item) => (
                <div
                  key={item.value}
                  className="flex items-baseline gap-2.5 rounded-xl border border-[#0e1411]/10 bg-white px-4 py-2.5"
                >
                  <dt className="font-serif text-2xl italic leading-none text-[#176b4d]">{item.value}</dt>
                  <dd className="text-xs text-[#5c655f]">{item.label}</dd>
                </div>
              ))}
            </dl>

            <Link to={paths.about} className="link-arrow mt-6">
              About W Morgan Technologies
              <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
