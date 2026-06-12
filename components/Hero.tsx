"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity =
          cursorRef.current.style.opacity === "0" ? "1" : "0";
      }
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-end pb-20 px-6 max-w-6xl mx-auto w-full"
    >
      <div className="mb-12">
        <p className="font-mono text-xs tracking-widest uppercase text-[#f0f0f0]/30 mb-6">
          Available for work · 2026
        </p>
        <h1 className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tighter text-[#f0f0f0]">
          Drucker
          <br />
          Nguyen
          <span
            ref={cursorRef}
            className="inline-block ml-2 w-1 bg-[#f0f0f0] align-baseline transition-opacity duration-100"
            style={{ height: "0.85em", verticalAlign: "text-bottom" }}
          />
        </h1>
        <p className="mt-8 text-[#f0f0f0]/40 text-lg max-w-xl leading-relaxed">
          Full-stack developer & designer building products that live at the
          intersection of craft and clarity.
        </p>
      </div>

      <div className="flex items-end justify-between border-t border-white/10 pt-8">
        <div className="flex gap-8">
          {["GitHub", "LinkedIn", "Twitter"].map((s) => (
            <a
              key={s}
              href="#"
              className="font-mono text-xs tracking-widest uppercase text-[#f0f0f0]/30 hover:text-[#f0f0f0] transition-colors duration-200"
            >
              {s}
            </a>
          ))}
        </div>
        <a
          href="#projects"
          className="font-mono text-xs tracking-widest uppercase text-[#f0f0f0]/30 hover:text-[#f0f0f0] transition-colors duration-200 flex items-center gap-2"
        >
          Scroll
          <span className="inline-block animate-bounce">↓</span>
        </a>
      </div>
    </section>
  );
}
