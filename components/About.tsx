"use client";

const skills = [
  "TypeScript",
  "React / Next.js",
  "Node.js",
  "Go",
  "PostgreSQL",
  "Redis",
  "Docker",
  "AWS",
  "Figma",
  "GraphQL",
];

export default function About() {
  return (
    <section id="about" className="py-32 px-6 max-w-6xl mx-auto w-full">
      <div className="flex items-baseline gap-4 mb-16">
        <span className="font-mono text-xs tracking-widest uppercase text-[#f0f0f0]/30">
          About
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-8">
            I build things that
            <br />
            <span className="text-[#f0f0f0]/30">matter to people.</span>
          </h2>
          <div className="space-y-4 text-[#f0f0f0]/50 leading-relaxed">
            <p>
              Based in Vietnam. I&apos;ve spent the last 4 years working across
              the full stack — from designing systems that scale to crafting
              interfaces that feel inevitable.
            </p>
            <p>
              I care deeply about the details: the right abstraction, the
              readable commit, the transition that earns its place. Good software
              is quiet. It just works.
            </p>
            <p>
              Currently open to full-time roles and select freelance projects.
              If you&apos;re building something ambitious, let&apos;s talk.
            </p>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-[#f0f0f0]/30 mb-6">
            Technologies
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
            {skills.map((skill) => (
              <li
                key={skill}
                className="flex items-center gap-2 text-sm text-[#f0f0f0]/50 hover:text-[#f0f0f0] transition-colors duration-200"
              >
                <span className="w-1 h-1 rounded-full bg-[#f0f0f0]/20 shrink-0" />
                {skill}
              </li>
            ))}
          </ul>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "4+", label: "Years exp." },
                { value: "30+", label: "Projects" },
                { value: "12+", label: "Clients" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="font-mono text-xs tracking-widest uppercase text-[#f0f0f0]/30 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
