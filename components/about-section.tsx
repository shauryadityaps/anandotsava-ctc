"use client";

import { TextReveal } from "@/components/ui/cascade-text";
import { CircularTestimonials, type Testimonial } from "@/components/ui/circular-testimonials";

interface StreamImage {
  src: string;
  alt: string;
  title: string;
  tag: string;
}

const STREAM_IMAGES: StreamImage[] = [
  {
    src: "/images/stream/stream-01.webp",
    alt: "Classical Dance Performance at Anandotsava",
    title: "Nritya Kala",
    tag: "Performing Arts",
  },
  {
    src: "/images/stream/stream-02.webp",
    alt: "Live Youth Vocal and Musical Rendition",
    title: "Sur-Tarang",
    tag: "Music",
  },
  {
    src: "/images/stream/stream-04.webp",
    alt: "Dignitaries and Patrons at the Historic Colvin Heritage Campus",
    title: "Heritage Gathering",
    tag: "Tradition",
  },
  {
    src: "/images/stream/stream-03.webp",
    alt: "Parliamentary Orator Addressing at the Colvin Podium",
    title: "Voice of Reason",
    tag: "Debating",
  },
  {
    src: "/images/stream/stream-06.webp",
    alt: "Inaugural Felicitation Ceremony with Hon'ble Chief Guest",
    title: "Inaugural Gala",
    tag: "Ceremony",
  },
  {
    src: "/images/stream/stream-10.webp",
    alt: "Grand Championship Trophy Distribution Ceremony",
    title: "Trophy Presentation",
    tag: "Awards",
  },
  {
    src: "/images/stream/stream-07.webp",
    alt: "Principal's Official Conclave Address",
    title: "Leadership Address",
    tag: "Keynote",
  },
  {
    src: "/images/stream/stream-05.webp",
    alt: "Colvin Taluqdars' College Quiz and Academic Jury Panel",
    title: "Brain Trust",
    tag: "Academics",
  },
  {
    src: "/images/stream/stream-12.webp",
    alt: "Classical Dastangoi and Heritage Storytelling Recital",
    title: "Dastangoi Showcase",
    tag: "Culture",
  },
  {
    src: "/images/stream/stream-09.webp",
    alt: "Eloquent Youth Orator at the Annual Conclave",
    title: "Oratory Excellence",
    tag: "Literary",
  },
  {
    src: "/images/stream/stream-08.webp",
    alt: "Inter-School Delegation and Adjudicators in Session",
    title: "Delegate Assembly",
    tag: "Conclave",
  },
  {
    src: "/images/stream/stream-11.webp",
    alt: "Distinguished Adjudicators Evaluating Competitions",
    title: "Adjudication Panel",
    tag: "Evaluation",
  },
];

const ABOUT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Mr. Sachidanand Singh",
    designation: "Principal, Colvin Taluqdars' College",
    quote:
      "At Colvin, we nurture character, intellect, and leadership. Anandotsava is a celebration of our students' boundless spirit and a vibrant continuation of our 135-year legacy of excellence.",
    src: "/images/testimonials/principal.webp",
  },
  {
    name: "Mr. Sachin Tiwari",
    designation: "Event Coordinator, Anandotsava 2026",
    quote:
      "Anandotsava is where passion meets the arena. To every participant and delegation—embrace the spirit of camaraderie, challenge your limits, and let your brilliance shine.",
    src: "/images/testimonials/sachin-tiwari.webp",
  },
  {
    name: "Late Raja Anand Singh of Mankapur",
    designation: "In Whose Cherished Memory Anandotsava is Celebrated",
    quote:
      "True service lies in creating avenues for youth to learn, flourish, and lead. May this festival inspire young minds to pursue excellence and serve society with purpose.",
    src: "/images/testimonials/raja-anand-singh.webp",
  },
];

export default function AboutSection() {
  // Duplicate for seamless 100% infinite continuous stream
  const allImages = [...STREAM_IMAGES, ...STREAM_IMAGES];

  return (
    <section
      id="about"
      className="w-full bg-white text-slate-900 pt-14 pb-16 sm:pt-20 sm:pb-24 border-t border-slate-100 relative overflow-hidden flex flex-col"
    >
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-4 right-1/4 w-96 h-96 bg-amber-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Text Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 flex flex-col items-center text-center">
        {/* Heading */}
        <h2 className="flex flex-col items-center text-center font-black tracking-tight max-w-full w-full">
          <TextReveal
            as="span"
            text="Where Royal Heritage Meets"
            fontSize="clamp(0.95rem, 4.3vw, 2.75rem)"
            color="#1d4ed8"
            nowrap
            className="font-black tracking-tight whitespace-nowrap"
          />
          <TextReveal
            as="span"
            text="Tomorrow's Vision"
            fontSize="clamp(1.15rem, 5.2vw, 3.25rem)"
            color="#1d4ed8"
            nowrap
            className="font-black tracking-tight whitespace-nowrap mt-0.5 sm:mt-1"
          />
        </h2>

        {/* Description Paragraph */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
          Celebrated in loving memory of{" "}
          <strong className="text-slate-900 font-semibold">
            Late Raja Anand Singh of Mankapur
          </strong>
          ,{" "}
          <strong className="text-slate-900 font-semibold">Anandotsava 2026</strong>{" "}
          marks the 2nd edition of the flagship inter-institutional conclave of{" "}
          <strong className="text-slate-900 font-semibold">
            Colvin Taluqdars&apos; College, Lucknow
          </strong>
          . Steeped in over 135 years of heritage and guided by the college motto{" "}
          <span className="italic font-medium text-slate-800">Noblesse Oblige</span>,
          it brings together vibrant minds across culture, debating, arts, and
          innovation on one historic campus.
        </p>
      </div>

      {/* Continuous Right-to-Left Flowing Landscape Image Stream */}
      <div className="w-full mt-10 sm:mt-14 overflow-hidden relative select-none">
        {/* Soft edge gradients for smooth infinite reveal */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-image-stream-rtl flex items-center gap-4 sm:gap-6 py-2">
          {allImages.map((img, idx) => (
            <div
              key={`${img.alt}-${idx}`}
              className="relative w-72 sm:w-84 md:w-96 aspect-video shrink-0 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200/80 bg-slate-100 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                width={384}
                height={216}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials: Principal, Sachin Tiwari & Raja Anand Singh */}
      <div className="w-full mt-6 sm:mt-16 md:mt-20 flex flex-col items-center justify-center relative px-3 sm:px-4">
        <CircularTestimonials
          testimonials={ABOUT_TESTIMONIALS}
          autoplay={false}
          colors={{
            name: "#0f172a",
            designation: "#2563eb",
            testimony: "#334155",
            arrowBackground: "#0f172a",
            arrowForeground: "#ffffff",
            arrowHoverBackground: "#2563eb",
          }}
          fontSizes={{
            name: "clamp(1.15rem, 2.2vw, 1.75rem)",
            designation: "clamp(0.8rem, 1.3vw, 1rem)",
            quote: "clamp(0.875rem, 1.5vw, 1.05rem)",
          }}
        />
      </div>
    </section>
  );
}
