"use client";

import PolaroidLineCarousel from "@/components/ui/polaroid-line-carousel";
import { TextReveal } from "@/components/ui/cascade-text";

export const EVENT_SLIDES = [
  {
    title: "Music",
    caption: "Battle of the Bands, Solo Vocals & Classical Symphonies",
    image: "/images/events/music.webp",
    palette: "dawn" as const,
    seed: 11,
  },
  {
    title: "Dance",
    caption: "Western Freestyle, Classical Kathak & Folk Ensembles",
    image: "/images/events/dance.webp",
    palette: "alpine" as const,
    seed: 22,
  },
  {
    title: "Storytelling",
    caption: "Dramatic Monologues, Narrative Arc & Theatrical Expressions",
    image: "/images/events/storytelling.webp",
    palette: "dusk" as const,
    seed: 33,
  },
  {
    title: "Debates",
    caption: "Parliamentary Eloquence, Cross-Examinations & Rebuttals",
    image: "/images/events/debate.webp",
    palette: "mist" as const,
    seed: 44,
  },
  {
    title: "Moot Court",
    caption: "Judicial Bench Trials, Case Jurisprudence & Appellate Advocacy",
    image: "/images/events/moot-court.webp",
    palette: "dawn" as const,
    seed: 55,
  },
  {
    title: "Mushaira",
    caption: "Traditional Mehfil, Urdu Shayari, Ghazals & Nazms",
    image: "/images/events/mushaira.webp",
    palette: "dusk" as const,
    seed: 66,
  },
  {
    title: "Tech & Hackathon",
    caption: "24-Hour Code Sprint, Web Innovations & Algorithmic Design",
    image: "/images/events/hackathon.webp",
    palette: "alpine" as const,
    seed: 77,
  },
  {
    title: "Robotics",
    caption: "Autonomous Obstacle Race, Bot Battles & Hardware Prototyping",
    image: "/images/events/robotics.webp",
    palette: "mist" as const,
    seed: 88,
  },
  {
    title: "Quiz",
    caption: "General Knowledge, Heritage Trivia & Rapid-Fire Faceoffs",
    image: "/images/events/quiz.webp",
    palette: "dawn" as const,
    seed: 99,
  },
  {
    title: "Gaming Arena",
    caption: "Esports Tournaments, High-Stakes LAN Arena & Strategy Battles",
    image: "/images/events/gaming.webp",
    palette: "alpine" as const,
    seed: 110,
  },
  {
    title: "Arts",
    caption: "Live Canvas Painting, Sketching, Charcoal & Visual Masterpieces",
    image: "/images/events/arts.webp",
    palette: "dusk" as const,
    seed: 121,
  },
];

export default function EventSection() {
  return (
    <section
      id="events"
      className="w-full min-h-[calc(100dvh-2rem)] sm:min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-6rem)] lg:min-h-[calc(100dvh-7rem)] flex flex-col items-center justify-between bg-white text-slate-900 pt-8 pb-4 sm:pt-10 sm:pb-6 relative overflow-hidden"
    >
      {/* Section Heading */}
      <div className="text-center px-4 max-w-2xl mx-auto shrink-0 mb-3 sm:mb-4">
        <TextReveal
          as="h2"
          text="Events & Competitions"
          fontSize="clamp(1.35rem, 4.2vw, 2.75rem)"
          color="#1d4ed8"
          className="font-black tracking-tight"
        />
      </div>

      {/* Interactive Polaroid Line Carousel */}
      <div className="w-full flex-1 min-h-[480px] sm:min-h-[540px] relative my-auto">
        <PolaroidLineCarousel
          slides={EVENT_SLIDES}
          height="100%"
          background="#ffffff"
          ink="#0f172a"
          string="#94a3b8"
          cardWidth={280}
          sag={38}
          swing={1}
          autoplay={4500}
        />
      </div>
    </section>
  );
}
