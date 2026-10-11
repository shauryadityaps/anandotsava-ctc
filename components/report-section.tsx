"use client";

import { TextReveal } from "@/components/ui/cascade-text";

export default function ReportSection() {
  return (
    <div className="w-full flex flex-col bg-white text-slate-900">
      {/* Report & Dossier Section */}
      <section
        id="newsletter"
        className="w-full px-4 sm:px-6 md:px-12 py-16 sm:py-24 border-t border-slate-100 relative overflow-hidden bg-white"
      >
        {/* Anchor alias for backwards compatibility */}
        <span id="report" className="sr-only" />

        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-50/70 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-sky-50/60 rounded-full blur-[90px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 max-w-full">
          <TextReveal
            as="h2"
            text="Festival Newsletter"
            fontSize="clamp(1.35rem, 4.2vw, 3rem)"
            color="#1d4ed8"
            className="font-black tracking-tight"
          />

          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed px-4">
            The official festival newsletter for Colvin Taluqdars&apos; College flagship festival is coming soon.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col items-center max-w-full">
            <TextReveal
              as="h3"
              text="STAY TUNED"
              fontSize="clamp(2rem, 6.5vw, 4.5rem)"
              color="#1d4ed8"
              className="font-black tracking-widest uppercase select-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
