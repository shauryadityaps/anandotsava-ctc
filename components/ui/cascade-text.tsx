"use client";

import React, { useMemo, useState, useRef, type ElementType, type CSSProperties } from "react";

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
  as: Component = "a",
  href,
  target,
  className = "",
  style,
  fontSize = "3rem",
  staggerDelay = 25,
  duration = 250,
  easing = "ease-in-out",
  color = "inherit",
  hoverColor,
  direction = "up",
  nowrap = false,
  onClick,
}: TextRevealProps) {
  const [hovered, setHovered] = useState(false);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // If hoverColor is not explicitly passed, default to color so headings stay in one consistent joyful color
  const effectiveHoverColor = hoverColor ?? color;

  // Split into words while retaining global character index for seamless staggered cascade
  const words = useMemo(() => {
    const rawWords = text.split(" ");
    let globalIndex = 0;
    return rawWords.map((word) => {
      let chars: string[] = [];
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
        chars = Array.from(segmenter.segment(word), (s) => s.segment);
      } else {
        chars = [...word];
      }
      const wordObj = {
        word,
        chars,
        startIndex: globalIndex,
      };
      globalIndex += chars.length + 1; // account for space separator
      return wordObj;
    });
  }, [text]);

  const totalChars = useMemo(() => {
    return words.reduce((acc, w) => acc + w.chars.length, 0);
  }, [words]);

  const sign = direction === "up" ? 1 : -1;

  const handleTouchStart = () => {
    setHovered(true);
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => {
      setHovered(false);
    }, duration + totalChars * staggerDelay + 250);
  };

  const isNoWrap = nowrap || className.includes("whitespace-nowrap") || className.includes("flex-nowrap");

  const rootProps: Record<string, unknown> = {
    className: `inline-flex ${isNoWrap ? "flex-nowrap whitespace-nowrap" : "flex-wrap"} items-center justify-center relative no-underline font-extrabold uppercase tracking-tight max-w-full cursor-pointer select-none text-center ${className}`.trim(),
    style: {
      fontSize,
      color: hovered ? effectiveHoverColor : color,
      transition: "color 0.35s ease",
      padding: "0.1em 0.2em",
      lineHeight: 1.15,
      ...style,
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onTouchStart: handleTouchStart,
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
        className={`inline-flex ${isNoWrap ? "flex-nowrap whitespace-nowrap" : "flex-wrap"} items-center justify-center max-w-full`}
        style={{ columnGap: "0.26em", rowGap: "0.15em" }}
        aria-hidden="true"
      >
        {words.map((wordObj, wIdx) => (
          <span
            key={wIdx}
            className="inline-flex overflow-hidden relative shrink-0"
            style={{ height: "1.15em", verticalAlign: "middle" }}
          >
            {wordObj.chars.map((char, cIdx) => {
              const charGlobalIndex = wordObj.startIndex + cIdx;
              return (
                <span
                  key={cIdx}
                  className="inline-block relative will-change-transform"
                  style={{
                    textShadow: `0 ${sign}em currentColor`,
                    transition: `transform ${duration}ms ${easing}`,
                    transitionDelay: `${charGlobalIndex * staggerDelay}ms`,
                    transform: hovered
                      ? `translateY(${-sign}em)`
                      : "translateY(0)",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </Component>
  );
});

TextReveal.displayName = "TextReveal";
export { TextReveal };
