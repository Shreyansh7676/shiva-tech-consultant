import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../carousel.css';

const SWIPE_THRESHOLD = 40;
// Keep in sync with the .xc-carousel__track transition in carousel.css.
const SLIDE_DURATION = 700;
const SNAP_DELAY = SLIDE_DURATION + 20;

function CarouselItem({ className = '', children, ...rest }) {
  return <div className={`xc-carousel__item ${className}`.trim()} {...rest}>{children}</div>;
}

function CarouselCaption({ className = '', children, ...rest }) {
  return <div className={`xc-carousel__caption ${className}`.trim()} {...rest}>{children}</div>;
}

function Carousel({
  children,
  className = '',
  interval = 5000,
  controls = true,
  indicators = true,
  pauseOnHover = true,
  keyboard = true,
  defaultActiveIndex = 0,
  onSelect,
  ...rest
}) {
  const { 'aria-label': ariaLabel = 'Image carousel', ...domProps } = rest;
  const slides = useMemo(() => React.Children.toArray(children), [children]);
  const count = slides.length;
  const loop = count > 1;
  const offset = loop ? 1 : 0;

  const initialIndex = Math.min(Math.max(defaultActiveIndex, 0), Math.max(count - 1, 0));
  const [position, setPosition] = useState(offset + initialIndex);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const touchStartX = useRef(null);
  const reportedIndex = useRef(initialIndex);

  // A clone of the last slide is prepended and a clone of the first slide is
  // appended, so the track always has somewhere to go. Once a clone is on
  // screen it is swapped for the identical real slide without any transition.
  const rendered = useMemo(() => {
    const entries = slides.map((slide, realIndex) => ({ slide, realIndex, clone: false }));
    if (!loop) return entries;
    return [
      { slide: slides[count - 1], realIndex: count - 1, clone: true },
      ...entries,
      { slide: slides[0], realIndex: 0, clone: true }
    ];
  }, [slides, count, loop]);

  const realIndex = !loop
    ? position
    : position === 0
      ? count - 1
      : position === count + 1
        ? 0
        : position - 1;

  const next = useCallback(() => {
    if (!loop) return;
    setAnimate(true);
    setPosition((current) => Math.min(current + 1, count + 1));
  }, [loop, count]);

  const prev = useCallback(() => {
    if (!loop) return;
    setAnimate(true);
    setPosition((current) => Math.max(current - 1, 0));
  }, [loop]);

  const goTo = useCallback((index) => {
    if (count === 0) return;
    setAnimate(true);
    setPosition(offset + Math.min(Math.max(index, 0), count - 1));
  }, [count, offset]);

  // Swap the on-screen edge clone for the identical real slide, instantly.
  useEffect(() => {
    if (!loop) return undefined;
    if (position !== 0 && position !== count + 1) return undefined;
    const timer = setTimeout(() => {
      setAnimate(false);
      setPosition(position === 0 ? count : 1);
    }, SNAP_DELAY);
    return () => clearTimeout(timer);
  }, [position, count, loop]);

  // Restore the slide transition after a snap.
  useEffect(() => {
    if (animate) return undefined;
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  useEffect(() => {
    const handleVisibility = () => setOnScreen(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (!interval || paused || !onScreen || !loop) return undefined;
    const timer = setTimeout(next, interval);
    return () => clearTimeout(timer);
  }, [interval, paused, onScreen, loop, next, position]);

  useEffect(() => {
    if (!onSelect || reportedIndex.current === realIndex) return;
    reportedIndex.current = realIndex;
    onSelect(realIndex);
  }, [onSelect, realIndex]);

  const handleKeyDown = (event) => {
    if (!keyboard) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current == null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) next();
    else prev();
  };

  return (
    <div
      className={`xc-carousel ${className}`.trim()}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      {...domProps}
    >
      <div className="xc-carousel__viewport">
        <div
          className="xc-carousel__track"
          style={{
            transform: `translateX(-${position * 100}%)`,
            transition: animate ? undefined : 'none'
          }}
        >
          {rendered.map((entry, index) => React.cloneElement(entry.slide, {
            key: entry.clone ? `xc-clone-${entry.realIndex}` : `xc-slide-${index}`,
            'aria-hidden': entry.clone || entry.realIndex !== realIndex,
            className: `${entry.slide.props.className || ''}${!entry.clone && entry.realIndex === realIndex ? ' is-active' : ''}`.trim()
          }))}
        </div>
      </div>

      {controls && loop && (
        <>
          <button type="button" className="xc-carousel__control xc-carousel__control--prev" aria-label="Previous slide" onClick={prev}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button type="button" className="xc-carousel__control xc-carousel__control--next" aria-label="Next slide" onClick={next}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {indicators && loop && (
        <div className="xc-carousel__indicators">
          {slides.map((slide, index) => (
            <button
              key={index}
              type="button"
              className={`xc-carousel__indicator${index === realIndex ? ' is-active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === realIndex}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

Carousel.Item = CarouselItem;
Carousel.Caption = CarouselCaption;

export default Carousel;
