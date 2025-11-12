import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Local MP3 import (place sombr.mp3 in src next to this file)
import backToFriendsAudio from "./sombr.mp3";

const IDF_COLORS = {
  olive: "#2f3e2c",
  oliveDark: "#243022",
  sand: "#c8a858",
  sandLight: "#e1d3a9",
  sky: "#e8f3ff",
  white: "#ffffff",
};

function placeholderSVG(label: string, w = 800, h = 600) {
  const bg = encodeURIComponent(`#1f2917`);
  const fg = encodeURIComponent(`#c8a858`);
  const text = encodeURIComponent(label);
  return (
    `data:image/svg+xml;utf8,` +
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
    `<rect width='100%' height='100%' fill='${bg}'/>` +
    `<g fill='${fg}' opacity='0.2'>` +
    `<circle cx='${w * 0.28}' cy='${h * 0.58}' r='${Math.min(w, h) * 0.22}' />` +
    `<rect x='${w * 0.48}' y='${h * 0.25}' width='${w * 0.22}' height='${h * 0.35}' rx='${Math.min(w, h) * 0.03}'/>` +
    `</g>` +
    `<g fill='${IDF_COLORS.white}' font-family='ui-sans-serif, system-ui' text-anchor='middle'>` +
    `<text x='50%' y='50%' font-size='${Math.min(w, h) * 0.05}' font-weight='700'>AI Tribute Image</text>` +
    `<text x='50%' y='58%' font-size='${Math.min(w, h) * 0.035}'>${text}</text>` +
    `</g>` +
    `</svg>`
  );
}

// Use ONLY your external links
const DEFAULT_IMAGES = [
  { id: 1, alt: "Homecoming hug — Shutterstock 2650158465", src: "https://www.shutterstock.com/image-photo/israeli-soldier-back-home-hugging-260nw-2650158465.jpg" },
  { id: 2, alt: "Family hug — gstatic thumb", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDN8Far8QXEDhOFEYxytcbmO3vT28DXBgbSA&s" },
  { id: 3, alt: "Hugs wife & child — Shutterstock 2626789507", src: "https://www.shutterstock.com/shutterstock/photos/2626789507/display_1500/stock-photo-an-israeli-soldier-hugs-his-wife-and-child-2626789507.jpg" },
  { id: 4, alt: "Joyful family — Freepik Premium", src: "https://img.freepik.com/premium-photo/israeli-soldier-joyfully-hugs-his-wife-child_1161356-215675.jpg" },
  { id: 5, alt: "Hug wife — Shutterstock 2626868725", src: "https://www.shutterstock.com/image-photo/israeli-soldier-hugs-his-wife-260nw-2626868725.jpg" },
  { id: 6, alt: "Reunion daughter — Shutterstock 2000415086", src: "https://www.shutterstock.com/image-photo/reunion-soldier-israel-family-daughter-260nw-2000415086.jpg" },
  { id: 7, alt: "Soldier & daughter — Getty (video poster)", src: "https://media.gettyimages.com/id/1338605628/video/israeli-soldier-and-his-daughter.jpg?s=640x640&k=20&c=oXdBZelFRxvMeHytc006m1a9_dagzCnd7KGyrp4l7jE=" },
  { id: 8, alt: "Family embrace — Shutterstock 2626789507 (dup)", src: "https://www.shutterstock.com/shutterstock/photos/2626789507/display_1500/stock-photo-an-israeli-soldier-hugs-his-wife-and-child-2626789507.jpg" },
  { id: 9, alt: "gstatic thumb — alt", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDN8Far8QXEDhOFEYxytcbmO3vT28DXBgbSA&s" },
  { id: 10, alt: "Fallback placeholder", src: placeholderSVG("Hug 10") },
];

function IDFTributeMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="IDF Tribute Mark" className="shrink-0">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor={IDF_COLORS.sand} />
          <stop offset="100%" stopColor={IDF_COLORS.sandLight} />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="4" fill={IDF_COLORS.olive} stroke="url(#g)" strokeWidth="2" />
      <path d="M12 4l2.6 4.5h5L15 12l2.6 4.5h-5L12 21l-2.6-4.5h-5L9 12 4.4 8.5h5z" fill="url(#g)" opacity="0.95" />
    </svg>
  );
}

function TributeSeal() {
  return (
    <div title="Benjamin Netanyahu" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-300 bg-amber-50 text-amber-700 text-[10px] font-semibold uppercase tracking-wide">
      <span className="opacity-70">Benjamin Netanyahu</span>
    </div>
  );
}

function NetanyahuPortrait({ src }: { src: string }) {
  const fallback = placeholderSVG("Netanyahu Tribute", 320, 320);
  return (
    <div className="relative">
      <img referrerPolicy="no-referrer" src={src || fallback} alt="Benjamin Netanyahu — Tribute portrait" className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover ring-2" />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2"><TributeSeal /></div>
    </div>
  );
}

type ImgItem = { id: number; alt: string; src: string };

export default function IDFHugsSlideshow({
  images = DEFAULT_IMAGES,
  netanyahuImg = "https://upload.wikimedia.org/wikipedia/commons/7/74/Benjamin_Netanyahu%2C_February_2023.jpg",
  autoAdvanceMs = 5000,
}: {
  images?: ImgItem[];
  netanyahuImg?: string;
  autoAdvanceMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [dark, setDark] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const n = images.length || 1;
  const go = (dir: number) => setIndex((i) => (i + dir + n) % n);
  const goTo = (i: number) => setIndex(((i % n) + n) % n);

  // slideshow auto-advance without ESLint dependency warning
  useEffect(() => {
    const t = setTimeout(() => setIndex((i) => (i + 1) % (images.length || 1)), autoAdvanceMs);
    return () => clearTimeout(t);
  }, [index, autoAdvanceMs, images.length]);

  // Autoplay policy: start muted, unmute on first interaction
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const tryPlay = () => a.play().catch(() => {});
    const unmute = () => { a.muted = false; tryPlay(); };

    a.muted = true; // allowed to autoplay when muted
    tryPlay();

    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const handler = () => {
      unmute();
      events.forEach((ev) => window.removeEventListener(ev, handler));
    };
    events.forEach((ev) => window.addEventListener(ev, handler, { once: true }));

    return () => events.forEach((ev) => window.removeEventListener(ev, handler));
  }, []);

  const bgClass = dark ? "from-[#10160b] to-[#1a2115]" : "from-[#f7f6ee] to-[#ffffff]";
  const cardClass = dark ? "bg-[#111811]/70 border-[#445038]" : "bg-white/80 border-[#e2e0d1]";

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgClass} text-[15px]`} style={{ color: dark ? IDF_COLORS.sandLight : IDF_COLORS.olive }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <IDFTributeMark />
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ color: IDF_COLORS.sand }}>IDF • Hugs & Hope (Tribute)</h1>
              <p className="text-xs opacity-80">
                IDF's official anthem auto-plays; there are no controls.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NetanyahuPortrait src={netanyahuImg} />
            <button onClick={() => setDark((d) => !d)} className="hidden sm:inline-flex px-3 py-1 rounded-lg border text-xs" style={{ borderColor: IDF_COLORS.sand, color: IDF_COLORS.sand }}>
              {dark ? "Light" : "Dark"} mode
            </button>
          </div>
        </header>

        {/* Card */}
        <div className={`rounded-2xl border shadow-xl overflow-hidden ${cardClass}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Slideshow area */}
            <div className="col-span-2 relative p-3 md:p-6">
              <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4/3", background: IDF_COLORS.oliveDark }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={images[index]?.id ?? index}
                    src={images[index]?.src}
                    alt={images[index]?.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      try { (e.currentTarget as HTMLImageElement).src = placeholderSVG("Image unavailable"); } catch {}
                    }}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>

                {/* Controls overlay */}
                <div className="absolute inset-0 flex items-center justify-between p-2">
                  <button onClick={() => go(-1)} className="h-10 w-10 grid place-items-center rounded-full bg-black/30 text-white hover:bg-black/50" aria-label="Previous">◀</button>
                  <button onClick={() => go(1)} className="h-10 w-10 grid place-items-center rounded-full bg-black/30 text-white hover:bg-black/50" aria-label="Next">▶</button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)} className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} aria-label={`Go to slide ${i + 1}`} />
                  ))}
                </div>
              </div>

              {/* Mobile controls */}
              <div className="mt-3 flex sm:hidden gap-2">
                <button onClick={() => setDark((d) => !d)} className="px-3 py-2 rounded-lg border text-xs" style={{ borderColor: IDF_COLORS.sand, color: IDF_COLORS.sand }}>
                  {dark ? "Light" : "Dark"} mode
                </button>
              </div>
            </div>

            {/* Right sidebar with automatic audio playback */}
            <aside className="p-4 md:p-6 space-y-4" style={{ background: dark ? "#0b0f09" : IDF_COLORS.sky }}>
              <h3 className="text-sm font-bold tracking-wide" style={{ color: IDF_COLORS.olive }}>Mission • Family • Hope</h3>
              <p className="text-xs opacity-80">This tribute automatically plays "Back to friends" by Sombr. There are no playback controls.</p>

              {/* Hidden audio element that auto-plays; unmuted after first interaction. If it errors, fall back to YouTube. */}
              <div className="rounded-xl overflow-hidden ring-1 p-3 flex flex-col gap-3" style={{ borderColor: IDF_COLORS.sand }}>
                {!audioError ? (
                  <audio
                    ref={audioRef}
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    style={{ display: "none" }}
                    onError={() => setAudioError(true)}
                  >
                    <source src={(backToFriendsAudio as unknown as string) || "/sombr.mp3"} type="audio/mpeg" />
                  </audio>
                ) : (
                  <iframe
                    title="Back to friends — YouTube fallback"
                    src="https://www.youtube.com/embed/c8zq4kAn_O0?autoplay=1&controls=0&mute=1&loop=1&playlist=c8zq4kAn_O0&playsinline=1"
                    width="100%"
                    height="0"
                    style={{ display: "none" }}
                    frameBorder={0}
                    allow="autoplay; encrypted-media"
                  />
                )}
                {audioError && (
                  <span className="text-amber-400 text-xs">Local audio could not be loaded. Streaming from YouTube instead.</span>
                )}
              </div>

            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
