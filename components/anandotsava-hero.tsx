"use client";

import { useState, useEffect } from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import Skiper39 from "@/components/ui/skiper39";
import PillNav from "@/components/ui/pill-nav";
import EventSection from "@/components/event-section";
import AboutSection from "@/components/about-section";
import ReportSection from "@/components/report-section";
import ContactSection from "@/components/contact-section";

export default function AnandotsavaHero() {
  const outerBgSrc = "/images/anandotsava-campus-outer-v4.webp";
  const [activeHref, setActiveHref] = useState<string>("#home");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    const rootEl = document.getElementById("anandotsava-root-container");
    if (rootEl) {
      rootEl.scrollTop = 0;
      rootEl.scrollLeft = 0;
      const preventNativeScroll = () => {
        if (rootEl.scrollTop !== 0) rootEl.scrollTop = 0;
        if (rootEl.scrollLeft !== 0) rootEl.scrollLeft = 0;
      };
      rootEl.addEventListener("scroll", preventNativeScroll, { passive: true });
    }

    const handleOffsetChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ offset: number }>;
      const offset = customEvent.detail?.offset ?? 0;
      if (typeof window !== "undefined") {
        if (offset > window.innerHeight * 0.45) {
          setActiveHref("#contact");
        } else {
          setActiveHref((prev) => (prev === "#contact" ? "#newsletter" : prev));
        }
      }
    };

    window.addEventListener("contact-offset-change", handleOffsetChange);
    return () => {
      window.removeEventListener("contact-offset-change", handleOffsetChange);
    };
  }, []);

  return (
    <div
      id="anandotsava-root-container"
      className="fixed inset-0 w-full h-full h-[100dvh] overflow-hidden bg-[#0f172a] text-slate-900 selection:bg-blue-600 selection:text-white"
    >
      {/* React Bits PillNav with Anandotsava Logo */}
      <PillNav
        logo="/images/anandotsava-logo-transparent.webp"
        logoAlt="Anandotsava 2026 Logo"
        items={[
          { label: "Home", href: "#home" },
          { label: "Events", href: "#events" },
          { label: "About", href: "#about" },
          { label: "Newsletter", href: "#newsletter" },
          { label: "Contact", href: "#contact" },
        ]}
        activeHref={activeHref}
        baseColor="#0f172a"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#0f172a"
      />

      {/* Page Sliding Track: Continuous, pixel-by-pixel scrolling into Contact section */}
      <div
        id="page-sliding-track"
        className="w-full h-full flex flex-col will-change-transform bg-[#0f172a]"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {/* Section 1: Hero & Festival Window (Full Height) */}
        <div className="w-full h-full shrink-0 relative overflow-hidden bg-[#0f172a]">
          <ScrollExpandMedia
            mediaType="custom"
            customMedia={<Skiper39 />}
            bgImageSrc={outerBgSrc}
            title="ANANDOTSAVA 2026"
            subLogoSrc="/images/colvin-logo-transparent.webp"
            textBlend={false}
          >
            {/* Events & Grand Arenas with Interactive Polaroid Line Carousel */}
            <EventSection />

            {/* About Section with Infinite Landscape Image Stream */}
            <AboutSection />

            {/* Festival Schedule & Conclave Report Section - Window ends right here! */}
            <ReportSection />
          </ScrollExpandMedia>
        </div>

        {/* Section 2: Contact Section on the page below the window - Full-screen sky-blue (#bfe8fc) */}
        <div
          id="contact"
          className="w-full h-full shrink-0 relative bg-[#bfe8fc] overflow-hidden"
        >
          <ContactSection />
        </div>
      </div>
    </div>
  );
}
