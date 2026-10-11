'use client';

import React, { useState, useMemo } from 'react';
import './pill-nav.css';

export interface PillNavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface PillNavProps {
  logo?: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

export const PillNav: React.FC<PillNavProps> = ({
  logo = '/images/anandotsava-logo-transparent.webp',
  logoAlt = 'Anandotsava Logo',
  items = [],
  activeHref = '#home',
  className = '',
  baseColor = '#0f172a',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#ffffff',
  pillTextColor,
  onMobileMenuClick,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedHref, setSelectedHref] = useState<string | null>(null);
  const [prevActiveHref, setPrevActiveHref] = useState(activeHref);

  if (activeHref !== prevActiveHref) {
    setPrevActiveHref(activeHref);
    setSelectedHref(null);
  }

  const currentActiveHref = selectedHref ?? activeHref ?? '#home';

  React.useEffect(() => {
    const handleShow = () => setSelectedHref('#contact');
    const handleHide = () => setSelectedHref(prev => (prev === '#contact' ? '#newsletter' : prev));

    window.addEventListener('show-contact-section', handleShow);
    window.addEventListener('hide-contact-section', handleHide);

    return () => {
      window.removeEventListener('show-contact-section', handleShow);
      window.removeEventListener('hide-contact-section', handleHide);
    };
  }, []);

  // Strictly deduplicate items by href to ensure zero React key collisions or duplicate pill rendering
  const uniqueItems = useMemo(() => {
    const seen = new Set<string>();
    return items.filter(item => {
      const key = item.href.toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [items]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    onMobileMenuClick?.();
  };

  const handleItemClick = (e: React.SyntheticEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    closeMobileMenu();

    setSelectedHref(href);

    if (typeof window !== 'undefined') {
      const targetId = href.replace(/^#/, '');

      if (targetId === 'contact') {
        window.dispatchEvent(new CustomEvent('show-contact-section'));
        return;
      }

      // If user is currently on contact section, return to hero window
      window.dispatchEvent(new CustomEvent('hide-contact-section'));

      if (!targetId || targetId === 'home') {
        window.dispatchEvent(new CustomEvent('scroll-to-home'));
        window.dispatchEvent(
          new CustomEvent('expand-hero-window', { detail: { targetId: 'home' } })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent('expand-hero-window', { detail: { targetId } })
        );
      }
    }
  };

  const handleLogoClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    closeMobileMenu();
    setSelectedHref('#home');

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hide-contact-section'));
      window.dispatchEvent(new CustomEvent('toggle-or-collapse-hero'));
    }
  };

  const cssVars = {
    ['--base' as string]: baseColor,
    ['--pill-bg' as string]: pillColor,
    ['--hover-text' as string]: hoveredPillTextColor,
    ['--pill-text' as string]: resolvedPillTextColor,
  } as React.CSSProperties;

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        {/* Anandotsava 2026 Spinning Crest Button */}
        <button
          type="button"
          className="pill-logo"
          aria-label={logoAlt}
          onClick={handleLogoClick}
          title="Toggle Festival Window"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={logoAlt} />
        </button>

        {/* Pill Bar (All devices: Desktop, Tablet, and Mobile) */}
        <div className="pill-nav-items desktop-only">
          <ul className="pill-list" role="menubar">
            {uniqueItems.map((item) => {
              const isActive = currentActiveHref === item.href;

              return (
                <li key={`nav-${item.href}`} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className={`pill${isActive ? ' is-active' : ''}`}
                    aria-label={item.ariaLabel || item.label}
                    onClick={e => handleItemClick(e, item.href)}
                  >
                    <span className="hover-circle" aria-hidden="true" />
                    <span className="pill-label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className="hamburger-line"
            style={{
              transform: isMobileMenuOpen ? 'rotate(45deg) translate(2px, 4px)' : 'none',
            }}
          />
          <span
            className="hamburger-line"
            style={{
              transform: isMobileMenuOpen ? 'rotate(-45deg) translate(2px, -4px)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile Popover Menu */}
      <div
        className={`mobile-menu-popover mobile-only ${isMobileMenuOpen ? 'is-open' : ''}`}
        style={cssVars}
      >
        <ul className="mobile-menu-list">
          {uniqueItems.map((item) => {
            const isActive = currentActiveHref === item.href;
            return (
              <li key={`mobile-${item.href}`}>
                <button
                  type="button"
                  className={`mobile-menu-btn${isActive ? ' is-active' : ''}`}
                  onClick={e => handleItemClick(e, item.href)}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
