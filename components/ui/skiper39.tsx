"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
  peepScale?: number;
}

const CrowdCanvas = ({
  src,
  rows = 15,
  cols = 7,
  peepScale = 0.72,
}: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      src,
      rows,
      cols,
    };

    // TYPES
    interface Stage {
      width: number;
      height: number;
    }

    interface WalkProps {
      startX: number;
      startY: number;
      endX: number;
    }

    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: (HTMLImageElement | number)[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: gsap.core.Timeline | null;
      mobileTier?: number;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = <T,>(array: T[]) => (randomRange(0, array.length) | 0);
    const removeFromArray = <T,>(array: T[], i: number): T => array.splice(i, 1)[0];
    const removeItemFromArray = <T,>(array: T[], item: T): T =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = <T,>(array: T[]): T =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = <T,>(array: T[]): T => array[randomIndex(array) | 0];

    // RESPONSIVE SIZING & DENSITY HELPERS
    const getPeepScale = () => {
      const width = stage.width || (canvas ? canvas.clientWidth : (typeof window !== "undefined" ? window.innerWidth : 1024));
      const height = stage.height || (canvas ? canvas.clientHeight : (typeof window !== "undefined" ? window.innerHeight : 700));

      if (width < 768) {
        // Mobile & Tablet:
        // Natural human proportions (0.74 - 0.82) to allow a lively crowd of 6-8 people
        // visible across the screen at once with rich depth layering and no giant bloated look
        if (width < 500) {
          return Math.min(0.82, Math.max(0.74, 0.72 + (height - 560) * 0.00035));
        }
        return 0.74;
      }

      // PC: exact original scale unchanged ("perfect on pc", 100% untouched)
      return peepScale; // 0.72
    };

    const getMobileTierCount = () => {
      const height = stage.height || (canvas ? canvas.clientHeight : (typeof window !== "undefined" ? window.innerHeight : 700));
      return height > 520 ? 5 : 4;
    };

    const getMaxCrowd = () => {
      const width = stage.width || (canvas ? canvas.clientWidth : (typeof window !== "undefined" ? window.innerWidth : 1024));
      if (width < 500) {
        // High density festival crowd: 35 active peeps distributed across 5 tiers (~7 peeps per tier)
        // With 7 peeps per tier and 180px peep width, every tier has continuous horizontal coverage across
        // the 360px mobile width, completely eliminating gaps and hiding any floating cut-off waists!
        return getMobileTierCount() === 5 ? 35 : 28;
      } else if (width < 768) {
        // Tablets
        return 35;
      }
      // PC: full crowd count (all 105 peeps), preserved exactly
      return allPeeps.length;
    };

    const getNextMobileTier = () => {
      const numTiers = getMobileTierCount();
      const counts = new Array(numTiers).fill(0);
      crowd.forEach((p: Peep) => {
        if (typeof p.mobileTier === "number" && p.mobileTier < numTiers) {
          counts[p.mobileTier]++;
        }
      });
      // Pick tier with fewest active peeps, prioritizing the front tier (numTiers - 1)
      // so the bottom border is always reliably guarded
      let minTier = numTiers - 1;
      let minVal = counts[numTiers - 1];
      for (let t = numTiers - 2; t >= 0; t--) {
        if (counts[t] < minVal) {
          minVal = counts[t];
          minTier = t;
        }
      }
      return minTier;
    };

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: Stage; peep: Peep }): WalkProps => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const isMobile = stage.width < 768;

      let startY: number;
      if (isMobile) {
        const numTiers = getMobileTierCount();
        const tier = getNextMobileTier();
        peep.mobileTier = tier;

        const currentScale = getPeepScale();
        const headTopOffset = 49 * currentScale;
        const waistOffset = 288 * currentScale;

        // Tier 0 (Back row): head reaches right below '2026'
        // Logo ends around 210-212px from the top of the card
        const backTargetTop = 215;
        const backStartY = backTargetTop - headTopOffset;

        // Front tier (Tier numTiers - 1): waist submerged 32px below the bottom card border!
        // The sprite has ~36px of transparent padding at the bottom. Sinking the waist
        // 32px below stage.height ensures the bottom cutoff line of the drawing is completely
        // submerged below the card border at all times, including during walking bounces!
        const waistSubmerge = 32;
        const frontStartY = stage.height - waistOffset + waistSubmerge;

        if (tier === 0) {
          startY = backStartY;
        } else if (tier === numTiers - 1) {
          startY = frontStartY;
        } else {
          const fraction = tier / (numTiers - 1);
          startY = backStartY + fraction * (frontStartY - backStartY);
        }
      } else {
        // PC: exact original math unchanged ("perfect on pc", 100% untouched)
        const offsetY = 40 - 150 * gsap.parseEase("power2.in")(Math.random());
        startY = stage.height - peep.height + offsetY;
      }

      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }: { peep: Peep; props: WalkProps }) => {
      const { startY, endX } = props;
      const isMobile = stage.width < 768;
      const xDuration = isMobile ? 9 : 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.6, 1.4));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          // Subtle walking bounce (2.5px) on mobile so bottom remains submerged
          y: startY - (isMobile ? 2.5 : 10),
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          const currentScale = getPeepScale();
          peep.width = rect[2] * currentScale;
          peep.height = rect[3] * currentScale;
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      const maxCrowd = getMaxCrowd();
      while (availablePeeps.length && crowd.length < maxCrowd) {
        addPeepToCrowd().walk?.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        const maxCrowd = getMaxCrowd();
        if (crowd.length < maxCrowd && availablePeeps.length) {
          addPeepToCrowd();
        }
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;

      // Dynamically update peep dimensions for current device width
      const currentScale = getPeepScale();
      allPeeps.forEach((peep) => {
        peep.width = peep.rect[2] * currentScale;
        peep.height = peep.rect[3] * currentScale;
        peep.drawArgs = [peep.image, ...peep.rect, 0, 0, peep.width, peep.height];
      });

      crowd.forEach((peep) => {
        peep.walk?.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    let isTickerActive = false;
    const startTicker = () => {
      if (!isTickerActive) {
        gsap.ticker.add(render);
        isTickerActive = true;
      }
    };
    const stopTicker = () => {
      if (isTickerActive) {
        gsap.ticker.remove(render);
        isTickerActive = false;
      }
    };

    const init = () => {
      createPeeps();
      resize();
      startTicker();
    };

    img.onload = init;
    img.src = config.src;

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    // Pause rendering loop when canvas is off-screen to preserve 60/120fps mobile scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTicker();
          } else {
            stopTicker();
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      stopTicker();
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols, peepScale]);
  return (
    <canvas ref={canvasRef} className="absolute bottom-0 h-full w-full" />
  );
};

interface Skiper39Props {
  className?: string;
  badgeText?: string;
  bgImageSrc?: string;
  src?: string;
  rows?: number;
  cols?: number;
  peepScale?: number;
}

const Skiper39 = ({
  className = "",
  badgeText = "",
  bgImageSrc = "/images/anandotsava-inner-bg.webp",
  src = "/images/skiper-peeps.png",
  rows = 15,
  cols = 7,
  peepScale = 0.72,
}: Skiper39Props) => {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#bfe8fc] text-slate-900 ${className}`}>
      {/* Background artwork: seamless matching sky-blue with original constant logo placed at the top */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#bfe8fc] flex flex-col items-center justify-start pt-2 sm:pt-3 md:pt-4">
        {/* Constant logo at the top: clearly visible and leveled above the walking crowd */}
        <div
          className="relative w-[210px] sm:w-[250px] md:w-[290px] lg:w-[330px] aspect-[1024/990] shrink-0"
          style={{
            transform: "rotate(1.8deg)",
            transformOrigin: "center center",
          }}
        >
          <Image
            src={bgImageSrc}
            alt="Anandotsava 2026 Logo"
            fill
            sizes="(max-width: 640px) 210px, (max-width: 768px) 250px, 330px"
            className="w-full h-full object-contain pointer-events-none"
            priority
          />
        </div>
      </div>

      {/* Optional top badge */}
      {badgeText && (
        <div className="top-10 sm:top-14 absolute left-1/2 z-20 grid -translate-x-1/2 content-start justify-items-center gap-3 text-center text-slate-800 pointer-events-none select-none">
          <span className="relative max-w-[16ch] text-xs sm:text-sm font-semibold tracking-widest uppercase leading-tight opacity-60 after:absolute after:left-1/2 after:top-full after:h-10 after:w-px after:bg-gradient-to-b after:from-slate-400 after:to-transparent after:content-['']">
            {badgeText}
          </span>
        </div>
      )}

      {/* Animated Walking Crowd Canvas */}
      <div className="absolute inset-0 h-full w-full z-10 pointer-events-none">
        <CrowdCanvas
          src={src}
          rows={rows}
          cols={cols}
          peepScale={peepScale}
        />
      </div>
    </div>
  );
};

export { CrowdCanvas, Skiper39 };
export default Skiper39;

/**
 * Skiper 39 Canvas_Landing_004 — React + Canvas
 * Inspired by and adapted from https://codepen.io/zadvorsky/pen/xxwbBQV
 * illustration by https://www.openpeeps.com/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the codepen.io . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
