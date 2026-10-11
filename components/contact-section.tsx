"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import { TextReveal } from "@/components/ui/cascade-text";
import {
  MapPin,
  Globe,
  FileText,
  ExternalLink,
  Code2,
  Phone,
} from "lucide-react";

interface ContactSectionProps {
  onReturnToFest?: () => void;
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactSection({ onReturnToFest }: ContactSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch("/Anandotsav.pdf");
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Anandotsav.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch {
      // Direct fallback
      const link = document.createElement("a");
      link.href = "/Anandotsav.pdf";
      link.download = "Anandotsav.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 1200);
    }
  }, [isDownloading]);

  const handleReturn = useCallback(() => {
    onReturnToFest?.();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hide-contact-section"));
    }
  }, [onReturnToFest]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleReturn();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleReturn]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-full min-h-full flex flex-col justify-between items-center px-3.5 sm:px-6 md:px-10 pt-13 sm:pt-20 pb-5 sm:pb-4 bg-[#bfe8fc] text-slate-900 overflow-y-auto select-text"
    >
      {/* Ambient Watercolor-inspired background glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-white/40 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-sky-200/50 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Main Content Wrapper - Centered & Fitted in 1 Screen */}
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center my-auto py-1 sm:py-2">
        {/* Heading */}
        <TextReveal
          as="h2"
          text="Connect & Explore"
          fontSize="clamp(1.35rem, 4.2vw, 2.75rem)"
          color="#1d4ed8"
          className="font-black tracking-tight"
        />

        {/* Subtitle */}
        <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm text-slate-700 max-w-xl font-normal leading-snug">
          Official portals, campus navigation, contact helpline, festival brochure, and social channels:
        </p>

        {/* Cards Grid: 5 items (Maps, Helpline, Instagram, Website, Brochure) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3.5 w-full mt-2 sm:mt-4 text-slate-800">
          {/* Card 1: Maps */}
          <a
            href="https://maps.app.goo.gl/4tCbeJnyXuFS9dh57"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/85 hover:bg-white border border-white/90 shadow-[0_4px_20px_rgba(30,58,138,0.06)] hover:shadow-[0_8px_25px_rgba(30,58,138,0.12)] transition-all duration-300 hover:-translate-y-0.5 text-center"
          >
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-600/10 border border-blue-200/60 flex items-center justify-center text-blue-700 mb-1.5 sm:mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-xs">
              <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[11px] sm:text-sm text-slate-900 flex items-center justify-center gap-1">
                <span>Campus Location</span>
                <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </h3>
              <p className="text-slate-600 text-[9.5px] sm:text-xs mt-0.5 sm:mt-1 leading-snug line-clamp-2">
                Colvin Taluqdars&apos; College, Lucknow
              </p>
            </div>
            <span className="mt-1.5 sm:mt-2.5 inline-flex items-center gap-1 text-[8.5px] sm:text-[11px] font-semibold text-blue-700 bg-blue-50/80 px-2 sm:px-2.5 py-0.5 rounded-full group-hover:bg-blue-100 transition-colors">
              Google Maps
            </span>
          </a>

          {/* Card 2: Helpline */}
          <div className="group flex flex-col items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/85 hover:bg-white border border-white/90 shadow-[0_4px_20px_rgba(30,58,138,0.06)] hover:shadow-[0_8px_25px_rgba(30,58,138,0.12)] transition-all duration-300 hover:-translate-y-0.5 text-center">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-600/10 border border-emerald-200/60 flex items-center justify-center text-emerald-700 mb-1.5 sm:mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-xs">
              <Phone className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div className="w-full">
              <h3 className="font-bold text-[11px] sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                Direct Helpline
              </h3>
              <div className="mt-1 flex flex-col gap-0.5 sm:gap-1 w-full text-[9px] sm:text-xs">
                <a
                  href="tel:+918707287811"
                  className="inline-flex items-center justify-center gap-1 text-slate-700 hover:text-emerald-700 font-medium hover:underline select-all"
                >
                  <span>+91 87072 87811</span>
                  <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 opacity-70" />
                </a>
                <a
                  href="tel:+919140656455"
                  className="inline-flex items-center justify-center gap-1 text-slate-700 hover:text-emerald-700 font-medium hover:underline select-all"
                >
                  <span>+91 91406 56455</span>
                  <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 opacity-70" />
                </a>
              </div>
            </div>
            <span className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 text-[8.5px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2 sm:px-2.5 py-0.5 rounded-full group-hover:bg-emerald-100 transition-colors">
              Call Direct
            </span>
          </div>

          {/* Card 3: Instagram */}
          <div className="group flex flex-col items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/85 hover:bg-white border border-white/90 shadow-[0_4px_20px_rgba(30,58,138,0.06)] hover:shadow-[0_8px_25px_rgba(30,58,138,0.12)] transition-all duration-300 hover:-translate-y-0.5 text-center">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-pink-600/10 border border-pink-200/60 flex items-center justify-center text-pink-600 mb-1.5 sm:mb-2 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300 shadow-xs">
              <InstagramIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div className="w-full">
              <h3 className="font-bold text-[11px] sm:text-sm text-slate-900 group-hover:text-pink-600 transition-colors">Instagram</h3>
              <div className="mt-1 flex flex-col gap-0.5 sm:gap-1 w-full text-[9px] sm:text-xs">
                <a
                  href="https://www.instagram.com/colvinanandotsava?utm_source=ig_web_button_share_sheet&obrf=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 text-pink-700 hover:text-pink-900 font-medium truncate hover:underline"
                >
                  <span>@colvinanandotsava</span>
                  <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 opacity-70" />
                </a>
                <a
                  href="https://www.instagram.com/colvintaluqdarscollege_lko?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 text-slate-600 hover:text-slate-900 font-medium truncate hover:underline"
                >
                  <span>@colvintaluqdarscollege_lko</span>
                  <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 opacity-70" />
                </a>
              </div>
            </div>
            <span className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 text-[8.5px] sm:text-[11px] font-semibold text-pink-700 bg-pink-50/80 px-2 sm:px-2.5 py-0.5 rounded-full group-hover:bg-pink-100 transition-colors">
              Social Handles
            </span>
          </div>

          {/* Card 4: Main Website */}
          <a
            href="https://colvinisc.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/85 hover:bg-white border border-white/90 shadow-[0_4px_20px_rgba(30,58,138,0.06)] hover:shadow-[0_8px_25px_rgba(30,58,138,0.12)] transition-all duration-300 hover:-translate-y-0.5 text-center"
          >
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-600/10 border border-indigo-200/60 flex items-center justify-center text-indigo-700 mb-1.5 sm:mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-xs">
              <Globe className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[11px] sm:text-sm text-slate-900 flex items-center justify-center gap-1">
                <span>Main Website</span>
                <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </h3>
              <p className="text-slate-600 text-[9.5px] sm:text-xs mt-0.5 sm:mt-1 leading-snug line-clamp-2">
                Colvin Taluqdars&apos; College
              </p>
            </div>
            <span className="mt-1.5 sm:mt-2.5 inline-flex items-center gap-1 text-[8.5px] sm:text-[11px] font-semibold text-indigo-700 bg-indigo-50/80 px-2 sm:px-2.5 py-0.5 rounded-full group-hover:bg-indigo-100 transition-colors font-mono">
              colvinisc.com
            </span>
          </a>

          {/* Card 5: Official Brochure */}
          <a
            href="/Anandotsav.pdf"
            download="Anandotsav.pdf"
            onClick={handleDownloadPdf}
            className="col-span-2 md:col-span-1 group flex flex-row sm:flex-col items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/85 hover:bg-white border border-white/90 shadow-[0_4px_20px_rgba(30,58,138,0.06)] hover:shadow-[0_8px_25px_rgba(30,58,138,0.12)] transition-all duration-300 hover:-translate-y-0.5 text-left sm:text-center cursor-pointer select-none"
            aria-label="Download Official Brochure PDF"
          >
            <div className="flex items-center gap-2 sm:flex-col sm:gap-0">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-600/10 border border-amber-200/60 flex items-center justify-center text-amber-700 sm:mb-2 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shadow-xs shrink-0">
                <FileText className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[11px] sm:text-sm text-slate-900 flex items-center sm:justify-center gap-1">
                  <span>Official Brochure</span>
                  <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 group-hover:text-amber-600 transition-colors" />
                </h3>
                <p className="text-slate-600 text-[9.5px] sm:text-xs mt-0.5 sm:mt-1 leading-snug line-clamp-1 sm:line-clamp-2">
                  Event Dossier &amp; Arena Guidelines
                </p>
              </div>
            </div>
            <span className="mt-0 sm:mt-2.5 inline-flex items-center gap-1 text-[8.5px] sm:text-[11px] font-semibold text-amber-800 bg-amber-50/90 px-2 sm:px-2.5 py-0.5 rounded-full group-hover:bg-amber-100 transition-colors shrink-0">
              {isDownloading ? "Downloading..." : "Download PDF"}
            </span>
          </a>
        </div>

        {/* Made By / Developer Showcase Banner */}
        <div className="mt-2.5 sm:mt-4 w-full flex items-center justify-center">
          <a
            href="https://shauryaditya-portfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-xl bg-white/90 hover:bg-white border border-white/95 shadow-[0_2px_12px_rgba(30,58,138,0.06)] hover:shadow-[0_4px_18px_rgba(30,58,138,0.12)] transition-all duration-300 text-slate-700 hover:text-slate-900"
          >
            <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-[10.5px] sm:text-xs font-medium text-slate-600">
              Crafted by <strong className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Shauryaditya</strong>
            </span>
            <span className="text-[9.5px] sm:text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md group-hover:bg-blue-100 transition-colors flex items-center gap-1">
              <span>portfolio</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </a>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="max-w-5xl mx-auto w-full pt-1.5 sm:pt-2 border-t border-blue-300/40 text-[10px] sm:text-[11px] text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-1 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0">
            <Image
              src="/images/colvin-logo-transparent.webp"
              alt="Colvin Logo"
              fill
              sizes="20px"
              className="object-contain"
            />
          </div>
          <span className="font-semibold text-slate-800 text-[9.5px] sm:text-[11px]">
            © 2026 Anandotsava • Colvin Taluqdars&apos; College
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-600 font-medium text-[9.5px] sm:text-[11px]">
          <span>135+ Years of Heritage</span>
          <span>•</span>
          <span>Estd. 1889</span>
        </div>
      </div>
    </section>
  );
}
