"use client";

import { useState } from "react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "drucker@example.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="contact" className="py-32 px-6 max-w-6xl mx-auto w-full">
      <div className="flex items-baseline gap-4 mb-16">
        <span className="font-mono text-xs tracking-widest uppercase text-[#f0f0f0]/30">
          Contact
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="max-w-2xl">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
          Let&apos;s build
          <br />
          something great.
        </h2>
        <p className="text-[#f0f0f0]/40 text-lg leading-relaxed mb-12">
          Whether you have a project in mind or just want to connect — my inbox
          is always open.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={copyEmail}
            className="group flex items-center gap-3 px-6 py-4 border border-white/20 hover:border-white/60 rounded-sm transition-all duration-300 text-sm font-mono"
          >
            <span className="text-[#f0f0f0]/60 group-hover:text-[#f0f0f0] transition-colors">
              {email}
            </span>
            <span className="text-[#f0f0f0]/30 group-hover:text-[#f0f0f0] transition-colors text-xs">
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>

          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-[#f0f0f0] text-[#0a0a0a] rounded-sm font-mono text-sm hover:bg-white transition-colors duration-200"
          >
            Send email ↗
          </a>
        </div>

        <div className="flex gap-8 mt-16 pt-8 border-t border-white/10">
          {[
            { label: "GitHub", href: "https://github.com" },
            { label: "LinkedIn", href: "https://linkedin.com" },
            { label: "Twitter", href: "https://twitter.com" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-widest uppercase text-[#f0f0f0]/30 hover:text-[#f0f0f0] transition-colors duration-200"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
