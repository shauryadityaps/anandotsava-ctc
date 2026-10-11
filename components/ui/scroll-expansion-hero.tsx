"use client";

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  ReactElement,
  cloneElement,
  isValidElement,
  TouchEvent,
  WheelEvent,
} from "react";
import Image from "next/image";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image" | "custom";
  mediaSrc?: string;
  posterSrc?: string;
  customMedia?: ReactNode;
  bgImageSrc?: string;
  bgElement?: ReactNode;
  title?: string;
  subLogoSrc?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaSrc = "",
  customMedia,
  bgImageSrc = "",
  bgElement,
  title,
  subLogoSrc = "/images/colvin-logo-transparent.webp",
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const windowScrollRef = useRef<HTMLDivElement | null>(null);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const touchStartProgressRef = useRef<number>(0);
  const isTouchDraggingRef = useRef<boolean>(false);
  const mediaFullyExpandedRef = useRef<boolean>(false);
  const contactOffsetRef = useRef<number>(0);

  useEffect(() => {
    mediaFullyExpandedRef.current = mediaFullyExpanded;
  }, [mediaFullyExpanded]);

  // High-performance RAF lerp animation loop for butter-smooth 60/120 FPS
  const startAnimationLoop = () => {
    if (rafIdRef.current) {
      return;
    }

    const tick = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) < 0.0006) {
        currentProgressRef.current = targetProgressRef.current;
        setScrollProgress(currentProgressRef.current);
        rafIdRef.current = null;

        if (currentProgressRef.current >= 0.98) {
          mediaFullyExpandedRef.current = true;
          setMediaFullyExpanded(true);
        } else if (currentProgressRef.current < 0.95) {
          mediaFullyExpandedRef.current = false;
          setMediaFullyExpanded(false);
          if (windowScrollRef.current) {
            windowScrollRef.current.scrollTop = 0;
          }
        }
        return;
      }

      currentProgressRef.current += diff * 0.16;
      setScrollProgress(currentProgressRef.current);

      if (currentProgressRef.current >= 0.98 && !mediaFullyExpandedRef.current) {
        mediaFullyExpandedRef.current = true;
        setMediaFullyExpanded(true);
      } else if (currentProgressRef.current < 0.95 && mediaFullyExpandedRef.current) {
        mediaFullyExpandedRef.current = false;
        setMediaFullyExpanded(false);
        if (windowScrollRef.current) {
          windowScrollRef.current.scrollTop = 0;
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  const triggerExpand = () => {
    if (!mediaFullyExpandedRef.current) {
      targetProgressRef.current = 1;
      startAnimationLoop();
    }
  };

  const contactAnimRafRef = useRef<number | null>(null);

  const animateContactOffset = (target: number, duration: number = 380) => {
    if (contactAnimRafRef.current) {
      cancelAnimationFrame(contactAnimRafRef.current);
      contactAnimRafRef.current = null;
    }

    const start = contactOffsetRef.current;
    const distance = target - start;
    if (Math.abs(distance) < 1) {
      contactOffsetRef.current = target;
      const trackEl = document.getElementById("page-sliding-track");
      if (trackEl) {
        trackEl.style.transform = `translate3d(0, -${target}px, 0)`;
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("contact-offset-change", { detail: { offset: target } })
        );
      }
      return;
    }

    const startTime = performance.now();
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(progress);
      const current = start + distance * eased;

      contactOffsetRef.current = current;
      const trackEl = document.getElementById("page-sliding-track");
      if (trackEl) {
        trackEl.style.transform = `translate3d(0, -${current}px, 0)`;
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("contact-offset-change", { detail: { offset: current } })
        );
      }

      if (progress < 1) {
        contactAnimRafRef.current = requestAnimationFrame(step);
      } else {
        contactOffsetRef.current = target;
        if (trackEl) {
          trackEl.style.transform = `translate3d(0, -${target}px, 0)`;
        }
        contactAnimRafRef.current = null;
      }
    };

    contactAnimRafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Cancel any programmatic animation when user wheels manually
      if (contactAnimRafRef.current) {
        cancelAnimationFrame(contactAnimRafRef.current);
        contactAnimRafRef.current = null;
      }

      const trackEl = document.getElementById("page-sliding-track");
      const scrollEl = windowScrollRef.current;
      const maxOffset = typeof window !== "undefined" ? window.innerHeight : 800;

      // 1. If currently scrolled partially, halfway, or fully into Contact section
      if (contactOffsetRef.current > 0) {
        e.preventDefault();
        if (e.deltaY < 0) {
          // Scrolling UP towards festival window
          const nextOffset = Math.max(0, contactOffsetRef.current + e.deltaY);
          const remainder = e.deltaY + contactOffsetRef.current; // negative if crossed 0
          contactOffsetRef.current = nextOffset;
          if (trackEl) {
            trackEl.style.transform = `translate3d(0, -${nextOffset}px, 0)`;
          }
          window.dispatchEvent(
            new CustomEvent("contact-offset-change", { detail: { offset: nextOffset } })
          );

          // If scrolled all the way back to offset 0, pass leftover delta to inner container
          if (nextOffset === 0 && scrollEl && remainder < 0) {
            scrollEl.scrollTop += remainder;
          }
          return;
        } else if (e.deltaY > 0) {
          // Scrolling DOWN further into Contact section (up to maxOffset)
          const nextOffset = Math.min(maxOffset, contactOffsetRef.current + e.deltaY);
          contactOffsetRef.current = nextOffset;
          if (trackEl) {
            trackEl.style.transform = `translate3d(0, -${nextOffset}px, 0)`;
          }
          window.dispatchEvent(
            new CustomEvent("contact-offset-change", { detail: { offset: nextOffset } })
          );
          return;
        }
      }

      // 2. If Festival Window is fully expanded (contactOffsetRef.current === 0)
      if (mediaFullyExpandedRef.current) {
        if (!scrollEl) return;

        const maxInnerScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
        const isAtBottom = scrollEl.scrollTop >= maxInnerScroll - 4;
        const isAtTop = scrollEl.scrollTop <= 2;

        // If at the bottom of the internal window (end of Report) and scrolling DOWN -> smoothly slide into Contact!
        if (e.deltaY > 0 && isAtBottom) {
          e.preventDefault();
          const nextOffset = Math.min(maxOffset, contactOffsetRef.current + e.deltaY);
          contactOffsetRef.current = nextOffset;
          if (trackEl) {
            trackEl.style.transform = `translate3d(0, -${nextOffset}px, 0)`;
          }
          window.dispatchEvent(
            new CustomEvent("contact-offset-change", { detail: { offset: nextOffset } })
          );
          return;
        }

        // If at the top of the internal window (Home) and scrolling UP deliberately -> collapse hero back
        if (e.deltaY < -20 && isAtTop) {
          e.preventDefault();
          handleCollapseHero();
          return;
        }

        // Forward wheel to scrollEl if cursor is anywhere outside scrollEl
        if (!scrollEl.contains(e.target as Node)) {
          e.preventDefault();
          scrollEl.scrollTop += e.deltaY;
        }
        return;
      }

      // 3. Phase 1: Window expansion from hero (unexpanded state)
      e.preventDefault();
      // Ensure track is strictly at 0
      if (contactOffsetRef.current !== 0) {
        contactOffsetRef.current = 0;
        if (trackEl) trackEl.style.transform = "translate3d(0, 0, 0)";
      }

      // Any downward wheel gesture on PC instantly, smoothly expands the window into the festival!
      if (e.deltaY > 0) {
        targetProgressRef.current = 1;
        startAnimationLoop();
      } else if (e.deltaY < 0 && targetProgressRef.current > 0) {
        targetProgressRef.current = 0;
        startAnimationLoop();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Cancel any running animation
      if (contactAnimRafRef.current) {
        cancelAnimationFrame(contactAnimRafRef.current);
        contactAnimRafRef.current = null;
      }

      const target = e.target as HTMLElement | null;
      if (target?.closest?.('.pill-nav-container')) {
        isTouchDraggingRef.current = false;
        return;
      }

      if (!e.touches || e.touches.length === 0) return;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
      touchStartTimeRef.current = Date.now();
      touchStartProgressRef.current = currentProgressRef.current;
      isTouchDraggingRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchDraggingRef.current || !e.touches || e.touches.length === 0) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY; // positive = swiping UP (scrolling down)

      const trackEl = document.getElementById("page-sliding-track");
      const scrollEl = windowScrollRef.current;
      const maxOffset = typeof window !== "undefined" ? window.innerHeight : 800;

      // 1. If currently in Contact section (partially, halfway, or fully)
      if (contactOffsetRef.current > 0) {
        touchStartYRef.current = touchY;
        if (deltaY < 0) {
          // Swiping down (scrolling up)
          const nextOffset = Math.max(0, contactOffsetRef.current + deltaY);
          contactOffsetRef.current = nextOffset;
          if (trackEl) {
            trackEl.style.transform = `translate3d(0, -${nextOffset}px, 0)`;
          }
          window.dispatchEvent(
            new CustomEvent("contact-offset-change", { detail: { offset: nextOffset } })
          );
        } else if (deltaY > 0) {
          // Swiping up (scrolling down further)
          const nextOffset = Math.min(maxOffset, contactOffsetRef.current + deltaY);
          contactOffsetRef.current = nextOffset;
          if (trackEl) {
            trackEl.style.transform = `translate3d(0, -${nextOffset}px, 0)`;
          }
          window.dispatchEvent(
            new CustomEvent("contact-offset-change", { detail: { offset: nextOffset } })
          );
        }
        if (e.cancelable) e.preventDefault();
        return;
      }

      // 2. If Festival Window is fully expanded
      if (mediaFullyExpandedRef.current) {
        if (!scrollEl) return;

        // Swiping down at top of Home -> collapse hero
        if (scrollEl.scrollTop <= 1 && deltaY < -60) {
          if (e.cancelable) e.preventDefault();
          handleCollapseHero();
          isTouchDraggingRef.current = false;
          return;
        }

        // Swiping up at bottom of Report -> slide into Contact!
        const maxInnerScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
        const isAtBottom = scrollEl.scrollTop >= maxInnerScroll - 4;

        if (deltaY > 0 && isAtBottom) {
          touchStartYRef.current = touchY;
          const nextOffset = Math.min(maxOffset, contactOffsetRef.current + deltaY);
          contactOffsetRef.current = nextOffset;
          if (trackEl) {
            trackEl.style.transform = `translate3d(0, -${nextOffset}px, 0)`;
          }
          window.dispatchEvent(
            new CustomEvent("contact-offset-change", { detail: { offset: nextOffset } })
          );
          if (e.cancelable) e.preventDefault();
          return;
        }

        // If touch is on outside margins, forward touch delta
        if (!scrollEl.contains(e.target as Node)) {
          if (e.cancelable) e.preventDefault();
          scrollEl.scrollTop += deltaY * 0.8;
          touchStartYRef.current = touchY;
          return;
        }

        return;
      }

      // 3. Phase 1: Expansion on mobile swipe up
      if (deltaY > 8) {
        if (e.cancelable) e.preventDefault();
        targetProgressRef.current = 1;
        startAnimationLoop();
      }
    };

    const handleTouchEnd = (e: TouchEvent): void => {
      if (!isTouchDraggingRef.current) return;
      isTouchDraggingRef.current = false;

      // Phase 1 snapping (when not fully expanded)
      if (!mediaFullyExpandedRef.current && contactOffsetRef.current === 0) {
        const lastTouchY = e.changedTouches?.[0]?.clientY ?? touchStartYRef.current;
        const lastTouchX = e.changedTouches?.[0]?.clientX ?? touchStartXRef.current;
        const totalDeltaY = touchStartYRef.current - lastTouchY;
        const totalDeltaX = touchStartXRef.current - lastTouchX;
        const totalDistance = Math.hypot(totalDeltaX, totalDeltaY);
        const duration = Date.now() - touchStartTimeRef.current;

        // Tap or swipe UP detected: expand fully into the festival!
        if (totalDeltaY > 8 || (totalDistance < 30 && duration < 600)) {
          targetProgressRef.current = 1;
          startAnimationLoop();
        } else if (totalDeltaY < -30) {
          // Strong downward swipe -> stay at 0
          targetProgressRef.current = 0;
          startAnimationLoop();
        }
      }

      touchStartYRef.current = 0;
      touchStartXRef.current = 0;
    };

    const handleTouchCancel = (): void => {
      if (!mediaFullyExpandedRef.current && contactOffsetRef.current === 0) {
        if (targetProgressRef.current > 0.02) {
          targetProgressRef.current = 1;
          startAnimationLoop();
        }
      }
      isTouchDraggingRef.current = false;
      touchStartYRef.current = 0;
      touchStartXRef.current = 0;
    };

    const handleScroll = (): void => {
      if (window.scrollX !== 0) {
        document.documentElement.scrollLeft = 0;
        document.body.scrollLeft = 0;
      }
    };

    window.addEventListener("wheel", handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener("scroll", handleScroll as EventListener, {
      passive: true,
    });
    window.addEventListener(
      "touchstart",
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      "touchmove",
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      "touchend",
      handleTouchEnd as unknown as EventListener,
      { passive: true }
    );
    window.addEventListener(
      "touchcancel",
      handleTouchCancel as unknown as EventListener,
      { passive: true }
    );

    const handleScrollToHome = () => {
      animateContactOffset(0);
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
      targetProgressRef.current = 1;
      startAnimationLoop();

      const scrollContainer = windowScrollRef.current;
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }

      setTimeout(() => {
        document.documentElement.scrollLeft = 0;
        document.body.scrollLeft = 0;
        if (windowScrollRef.current) {
          windowScrollRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }, 350);
    };

    const handleExpandHero = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetId?: string }>;
      const targetId = customEvent.detail?.targetId;

      if (targetId === "contact") {
        targetProgressRef.current = 1;
        startAnimationLoop();
        animateContactOffset(typeof window !== "undefined" ? window.innerHeight : 800);
        return;
      }

      // Return track to 0 when opening any festival window section
      animateContactOffset(0);

      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
      targetProgressRef.current = 1;
      startAnimationLoop();

      if (!targetId || targetId === "home") {
        handleScrollToHome();
        return;
      }

      const scrollToSection = () => {
        document.documentElement.scrollLeft = 0;
        document.body.scrollLeft = 0;
        const container = windowScrollRef.current;
        if (!container) return;

        const el = document.getElementById(targetId);
        if (el) {
          let targetTop = 0;
          let curr: HTMLElement | null = el;
          while (curr && curr !== container) {
            targetTop += curr.offsetTop;
            curr = curr.offsetParent as HTMLElement | null;
          }

          if (curr !== container) {
            const containerRect = container.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            targetTop = container.scrollTop + (elRect.top - containerRect.top);
          }

          container.scrollTo({
            top: Math.max(0, targetTop),
            left: 0,
            behavior: "smooth",
          });
        }
      };

      if (currentProgressRef.current >= 0.85) {
        scrollToSection();
      }
      setTimeout(scrollToSection, 350);
    };

    const handleShowContact = () => {
      targetProgressRef.current = 1;
      startAnimationLoop();
      animateContactOffset(typeof window !== "undefined" ? window.innerHeight : 800);
    };

    const handleHideContact = () => {
      animateContactOffset(0);
    };

    const handleCollapseHero = () => {
      if (contactAnimRafRef.current) {
        cancelAnimationFrame(contactAnimRafRef.current);
        contactAnimRafRef.current = null;
      }
      contactOffsetRef.current = 0;
      const trackEl = document.getElementById("page-sliding-track");
      if (trackEl) {
        trackEl.style.transform = "translate3d(0, 0, 0)";
      }
      const rootEl = document.getElementById("anandotsava-root-container");
      if (rootEl) {
        rootEl.scrollTop = 0;
        rootEl.scrollLeft = 0;
      }
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
        document.documentElement.scrollLeft = 0;
        document.body.scrollLeft = 0;
        window.dispatchEvent(new CustomEvent("contact-offset-change", { detail: { offset: 0 } }));
        window.dispatchEvent(new CustomEvent("hide-contact-section"));
      }
      if (windowScrollRef.current) {
        windowScrollRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
      setMediaFullyExpanded(false);
      mediaFullyExpandedRef.current = false;
      targetProgressRef.current = 0;
      startAnimationLoop();
    };

    const handleToggleOrCollapseHero = () => {
      if (mediaFullyExpandedRef.current) {
        handleCollapseHero();
      } else {
        handleExpandHero(new CustomEvent("expand-hero-window", { detail: { targetId: "home" } }));
      }
    };

    window.addEventListener("show-contact-section", handleShowContact);
    window.addEventListener("hide-contact-section", handleHideContact);
    window.addEventListener("scroll-to-home", handleScrollToHome);
    window.addEventListener("expand-hero-window", handleExpandHero);
    window.addEventListener("collapse-hero-window", handleCollapseHero);
    window.addEventListener("toggle-or-collapse-hero", handleToggleOrCollapseHero);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (contactAnimRafRef.current) {
        cancelAnimationFrame(contactAnimRafRef.current);
        contactAnimRafRef.current = null;
      }
      window.removeEventListener(
        "wheel",
        handleWheel as unknown as EventListener
      );
      window.removeEventListener("scroll", handleScroll as EventListener);
      window.removeEventListener(
        "touchstart",
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        "touchmove",
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener(
        "touchend",
        handleTouchEnd as unknown as EventListener
      );
      window.removeEventListener(
        "touchcancel",
        handleTouchCancel as unknown as EventListener
      );
      window.removeEventListener("show-contact-section", handleShowContact);
      window.removeEventListener("hide-contact-section", handleHideContact);
      window.removeEventListener("scroll-to-home", handleScrollToHome);
      window.removeEventListener("expand-hero-window", handleExpandHero);
      window.removeEventListener("collapse-hero-window", handleCollapseHero);
      window.removeEventListener("toggle-or-collapse-hero", handleToggleOrCollapseHero);
    };
  }, []);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile, { passive: true });

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Hardware-accelerated GPU scale instead of layout-thrashing width/height
  const baseScale = isMobileState ? 0.38 : 0.28;
  const currentScale = baseScale + (1 - baseScale) * scrollProgress;
  const textTranslateX = scrollProgress * (isMobileState ? 160 : 130);
  const logoTranslateY = scrollProgress * (isMobileState ? 50 : 38);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div
      ref={sectionRef}
      id="hero-window-wrapper"
      className="relative w-full h-full overflow-hidden select-none"
      style={{
        overflowX: "hidden",
        maxWidth: "100vw",
        width: "100%",
        touchAction: mediaFullyExpanded ? "auto" : "pan-y",
      }}
    >
      <section
        onClick={!mediaFullyExpanded ? triggerExpand : undefined}
        className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden ${
          !mediaFullyExpanded ? "cursor-pointer" : ""
        }`}
        style={{
          overflowX: "hidden",
          maxWidth: "100vw",
          width: "100%",
          touchAction: mediaFullyExpanded ? "auto" : "pan-y",
        }}
      >
        {/* Background element: Heritage campus backdrop that stays with the hero window and scrolls up with it */}
        <div
          className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#0f172a] pointer-events-none"
          style={{
            transform: "translateZ(0)",
          }}
        >
          {bgElement ? (
            isValidElement(bgElement) ? (
              cloneElement(bgElement as ReactElement<{ paused?: boolean }>, {
                paused: scrollProgress >= 0.95,
              })
            ) : (
              bgElement
            )
          ) : bgImageSrc ? (
            <Image
              src={bgImageSrc}
              alt="Campus Heritage Background"
              fill
              sizes="100vw"
              className="w-full h-full object-cover object-center pointer-events-none select-none"
              priority
            />
          ) : null}
        </div>

        {/* Center Media Window: Stays fixed perfectly centralized; neatly framed inside heritage canvas */}
        <div
          className={`absolute z-10 top-1/2 left-1/2 overflow-hidden bg-[#bfe8fc] origin-center ${
            !mediaFullyExpanded ? "cursor-pointer hover:ring-blue-400" : ""
          }`}
          style={{
            transform: `translate3d(-50%, -50%, 0) scale(${currentScale})`,
            willChange: "transform",
            width: isMobileState ? "calc(100% - 2rem)" : "calc(100% - 7rem)",
            height: isMobileState ? "calc(100dvh - 5.5rem)" : "calc(100dvh - 7rem)",
            maxWidth: isMobileState ? "calc(100vw - 2rem)" : "calc(100vw - 7rem)",
            borderRadius: isMobileState ? "18px" : "24px",
            border: "2px solid rgba(255, 255, 255, 0.85)",
            boxShadow: "0 25px 80px -10px rgba(30, 58, 138, 0.35)",
            outline: "1px solid rgba(147, 197, 253, 0.6)",
            opacity: scrollProgress <= 0.02 ? 0 : Math.min((scrollProgress - 0.02) * 3, 1),
            pointerEvents: scrollProgress > 0.85 ? "auto" : "none",
            transition: scrollProgress <= 0.02 ? "opacity 0.2s ease" : "none",
          }}
        >
          {/* Scrollable Container Inside the Fixed Window */}
          <div
            ref={windowScrollRef}
            tabIndex={0}
            className={`w-full h-full ${
              mediaFullyExpanded ? "overflow-y-auto" : "overflow-hidden"
            } overflow-x-hidden window-scrollbar no-scrollbar outline-none`}
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "none",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              touchAction: mediaFullyExpanded ? "pan-y" : "none",
              willChange: "scroll-position",
            }}
          >
            {/* Pane 1: Hero Media (Skiper39 Animated Crowd & Logo) */}
            <div id="home" className="relative w-full h-[calc(100dvh-5.5rem)] sm:h-[calc(100dvh-6rem)] md:h-[calc(100dvh-6.5rem)] lg:h-[calc(100dvh-7rem)] min-h-[calc(100dvh-5.5rem)] sm:min-h-[calc(100dvh-6rem)] md:min-h-[calc(100dvh-6.5rem)] lg:min-h-[calc(100dvh-7rem)] shrink-0 overflow-hidden">
              {customMedia ? (
                <div className="relative w-full h-full">
                  {customMedia}
                </div>
              ) : mediaSrc ? (
                <div className="relative w-full h-full">
                  <Image
                    src={mediaSrc}
                    alt={title || "Media content"}
                    width={1280}
                    height={720}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ) : null}
            </div>

            {/* Pane 2: Events & Festival Arenas — Clean White Background */}
            {children && (
              <div className="w-full shrink-0 min-h-full bg-white flex flex-col justify-start">
                {children}
              </div>
            )}
          </div>
        </div>

        {/* Title & Date Section: Optimized with GPU translate3d layers and strict overflow clipping */}
        <div
          className={`flex items-center justify-center text-center w-full relative z-20 flex-col pointer-events-none select-none px-3 sm:px-4 overflow-hidden ${
            textBlend ? "mix-blend-difference" : "mix-blend-normal"
          }`}
          style={{ maxWidth: "100%", overflowX: "hidden" }}
        >
          <div
            className="flex items-center justify-center text-center flex-col w-full leading-none overflow-hidden"
            style={{ maxWidth: "100%", overflowX: "hidden" }}
          >
            <h1
              className="w-full text-center font-black tracking-tighter text-[11.5vw] sm:text-[12.5vw] md:text-[11vw] lg:text-[10vw] xl:text-[9.5vw] 2xl:text-[9vw] leading-[0.88] text-[#bfe8fc]"
              style={{
                transform: `translate3d(-${textTranslateX}vw, 0, 0)`,
                willChange: "transform",
                WebkitTextStroke: "clamp(2px, 0.4vw, 5px) #0f172a",
                paintOrder: "stroke fill",
                filter: "drop-shadow(0 4px 12px rgba(15, 23, 42, 0.6))",
              }}
            >
              {firstWord}
            </h1>
            <h1
              className="w-full text-center font-black tracking-tighter text-[11.5vw] sm:text-[12.5vw] md:text-[11vw] lg:text-[10vw] xl:text-[9.5vw] 2xl:text-[9vw] leading-[0.88] text-blue-700 mt-3 sm:mt-2"
              style={{
                transform: `translate3d(${textTranslateX}vw, 0, 0)`,
                willChange: "transform",
                WebkitTextStroke: "clamp(2px, 0.4vw, 5px) #0f172a",
                paintOrder: "stroke fill",
                filter: "drop-shadow(0 4px 12px rgba(15, 23, 42, 0.6))",
              }}
            >
              {restOfTitle}
            </h1>

            {/* College Crest Logo: Placed directly below the title, glides towards the bottom during expansion */}
            {subLogoSrc && (
              <div
                className="mt-5 sm:mt-2.5 md:mt-3 flex flex-col items-center justify-center pointer-events-none"
                style={{
                  transform: `translate3d(0, ${logoTranslateY}vh, 0)`,
                  opacity: Math.max(0, 1 - scrollProgress * 2.8),
                  willChange: "transform, opacity",
                }}
              >
                <div className="relative w-22 h-22 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-48 xl:h-48 aspect-[620/598] drop-shadow-[0_12px_28px_rgba(15,23,42,0.35)]">
                  <Image
                    src={subLogoSrc}
                    alt="Colvin Taluqdars' College Lucknow"
                    fill
                    sizes="(max-width: 640px) 90px, (max-width: 768px) 112px, (max-width: 1024px) 144px, 192px"
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Festival Dates on the Brick Pathway */}
            <div
              className="mt-6 sm:mt-3.5 md:mt-4 flex flex-col items-center justify-center pointer-events-none"
              style={{
                transform: `translate3d(0, ${logoTranslateY}vh, 0)`,
                opacity: Math.max(0, 1 - scrollProgress * 2.8),
                willChange: "transform, opacity",
              }}
            >
              <p
                className="text-center select-none font-sans"
                style={{
                  color: "#0a1d37",
                  fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
                  fontWeight: 500,
                  fontSize: "clamp(1rem, 2.5vw, 1.85rem)",
                  WebkitTextStroke: "1px #ffffff",
                  paintOrder: "stroke fill",
                  letterSpacing: "0.06em",
                  filter: "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.45))",
                }}
              >
                {date || "October - 15th, 16th, 17th."}
              </p>
            </div>
          </div>



          {(date || scrollToExpand) && (
            <div
              className="flex flex-col items-center justify-center text-center mt-4 sm:mt-6"
              style={{
                opacity: Math.max(0, 1 - scrollProgress * 3.5),
                willChange: "opacity",
              }}
            >
              {date && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-blue-200/90 shadow-sm backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <p className="text-xs sm:text-sm md:text-base font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-blue-950 uppercase">
                    {date}
                  </p>
                </div>
              )}
              {scrollToExpand && (
                <p className="text-[11px] sm:text-xs md:text-sm lg:text-base font-bold text-blue-950 text-center mt-2.5 sm:mt-3 tracking-wider drop-shadow-[0_1px_8px_rgba(255,255,255,0.9)] flex items-center justify-center gap-1.5">
                  <span>{scrollToExpand}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
