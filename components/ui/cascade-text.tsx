"use client";

import React, { useMemo, type ElementType, type CSSProperties } from "react";

export interface TextRevealProps {
  text: string;
  as?: ElementType;
  href?: string;
  target?: string;
  className?: string;
  style?: CSSProperties;
  fontSize?: string;
  staggerDelay?: number;
  duration?: number;
  easing?: string;
  color?: string;
  hoverColor?: string;
  direction?: "up" | "down";
  nowrap?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const TextReveal = React.memo(function TextReveal({
  text,
  as: Component = "span",
  href,
  target,
  className = "",
  style,
  fontSize = "3rem",
  staggerDelay = 22,
  duration = 240,
  easing = "cubic-bezier(0.2, 0.7, 0.2, 1)",
  color = "inherit",
  hoverColor,
  direction = "up",
  nowrap = false,
  onClick,
}: TextRevealProps) {
  const effectiveHoverColor = hoverColor ?? color;

  // Split into words while retaining character order for clean layout and desktop cascade
  const words = useMemo(() => {
    const rawWords = text.split(" ");
    let globalIndex = 0;
    return rawWords.map((word) => {
      let chars: string[] = [];
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
        chars = Array.from(segmenter.segment(word), (s) => s.segment);
      } else {
        chars = Array.from(word);
      }
      const wordObj = {
        word,
        chars,
        startIndex: globalIndex,
      };
      globalIndex += chars.length + 1; // space separator
      return wordObj;
    });
  }, [text]);

  const sign = direction === "up" ? 1 : -1;
  const isNoWrap = nowrap || className.includes("whitespace-nowrap");

  const rootProps: Record<string, unknown> = {
    className: `cascade-text-root inline-flex ${
      isNoWrap ? "flex-nowrap whitespace-nowrap" : "flex-wrap"
    } items-center justify-center relative no-underline font-extrabold uppercase tracking-tight max-w-full select-none text-center ${className}`.trim(),
    style: {
      fontSize,
      color,
      lineHeight: 1.25,
      ...style,
    },
    onClick,
    "aria-label": text,
  };

  if (Component === "a") {
    rootProps.href = href ?? "#";
    if (target) rootProps.target = target;
    if (target === "_blank") rootProps.rel = "noopener noreferrer";
  }

  return (
    <Component {...rootProps}>
      <span
        className={`cascade-text-container inline-flex ${
          isNoWrap ? "flex-nowrap whitespace-nowrap" : "flex-wrap"
        } items-center justify-center max-w-full`}
        style={{ columnGap: "0.26em", rowGap: "0.15em" }}
        aria-hidden="true"
      >
        {words.map((wordObj, wIdx) => (
          <span
            key={wIdx}
            className="cascade-text-word inline-flex relative"
          >
            {wordObj.chars.map((char, cIdx) => {
              const charGlobalIndex = wordObj.startIndex + cIdx;
              return (
                <span
                  key={cIdx}
                  className="cascade-text-char inline-block relative"
                  style={
                    {
                      "--char-delay": `${charGlobalIndex * staggerDelay}ms`,
                    } as React.CSSProperties
                  }
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </span>

      <style jsx>{`
        /* Desktop (with fine pointer / mouse): Smooth, clean cascade hover */
        @media (hover: hover) and (pointer: fine) {
          .cascade-text-root {
            cursor: pointer;
            transition: color 0.3s ease;
          }
          .cascade-text-root:hover {
            color: ${effectiveHoverColor} !important;
          }
          .cascade-text-word {
            overflow: hidden;
            height: 1.25em;
            vertical-align: baseline;
          }
          .cascade-text-char {
            transform: translateY(0);
            transition: transform ${duration}ms ${easing};
            transition-delay: 0ms; /* Instant, synchronous return to original position when unhovered */
            text-shadow: 0 ${sign * 1.25}em currentColor;
            will-change: transform;
          }
          .cascade-text-root:hover .cascade-text-char {
            transform: translateY(${-sign * 1.25}em);
            transition-delay: var(--char-delay, 0ms);
          }
        }

        /* Mobile / Touch: Perfectly solid, un-split headings that never jumble or get stuck */
        @media (hover: none), (pointer: coarse), (max-width: 768px) {
          .cascade-text-root {
            cursor: default !important;
            touch-action: pan-y !important;
          }
          .cascade-text-word {
            display: inline !important;
            overflow: visible !important;
            height: auto !important;
            line-height: inherit !important;
          }
          .cascade-text-char {
            display: inline !important;
            transform: none !important;
            transition: none !important;
            text-shadow: none !important;
            will-change: auto !important;
          }
        }
      `}</style>
    </Component>
  );
});

TextReveal.displayName = "TextReveal";
export { TextReveal };
export default TextReveal;
