import React, { useMemo, useState, useEffect } from "react";

export default function StarryBackground({ children }) {
    // Decide star count based on screen width (fewer on mobile for perf)
    const [starCount, setStarCount] = useState(
        typeof window !== "undefined" && window.innerWidth < 750 ? 30 : 50
    );

    useEffect(() => {
        function onResize() {
            setStarCount(window.innerWidth < 750 ? 30 : 50);
        }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Generate randomized star descriptors once per starCount change
    const stars = useMemo(() => {
        const arr = [];
        for (let i = 0; i < starCount; i++) {
            const tailLength = (Math.random() * (7.5 - 5) + 5).toFixed(2);
            const topOffset = (Math.random() * 100).toFixed(2) + "%";
            // Duration between 6s and 12s
            const durationVal = Math.random() * (12 - 6) + 6;
            const duration = durationVal.toFixed(2) + "s";

            // Random negative delay between -duration and 0
            // This ensures stars are already "mid-fall" when the page loads
            const delay = (-Math.random() * durationVal).toFixed(2) + "s";

            const tailHeightPx = 2;
            const width = (parseFloat(tailLength) / 6).toFixed(3) + "em";
            arr.push({
                id: i,
                tailLength: `${tailLength}em`,
                topOffset,
                duration,
                delay,
                tailHeight: `${tailHeightPx}px`,
                width,
            });
        }
        return arr;
    }, [starCount]);

    return (
        <>
            <style>{`
        /* Container layout - full viewport and centered content */
        .starry-root {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 120%;
          transform: rotate(-45deg);
          pointer-events: none;
          z-index: 0;
        }

        .star {
          position: absolute;
          top: var(--top-offset, 50%);
          left: 0;
          width: var(--star-tail-length, 6em);
          height: var(--star-tail-height, 2px);
          color: #f6f6ff;
          background: linear-gradient(45deg, currentColor, transparent);
          border-radius: 50%;
          filter: drop-shadow(0 0 6px currentColor);
          transform: translate3d(104em, 0, 0);
          animation:
            fall var(--fall-duration, 9s) var(--fall-delay, 0s) linear infinite,
            tail-fade var(--fall-duration, 9s) var(--fall-delay, 0s) ease-out infinite;
        }

        @media screen and (max-width: 750px) {
          .star {
            animation: fall var(--fall-duration, 9s) var(--fall-delay, 0s) linear infinite;
          }
        }

        .star::before, .star::after {
          position: absolute;
          content: '';
          top: 0;
          left: calc(var(--star-width, 1em) / -2);
          width: var(--star-width, 1em);
          height: 100%;
          background: linear-gradient(45deg, transparent, currentColor, transparent);
          border-radius: inherit;
          animation: blink 2s linear infinite;
        }
        .star::before { transform: rotate(45deg); }
        .star::after  { transform: rotate(-45deg); }

        @keyframes fall {
          to {
            transform: translate3d(-30em, 0, 0);
          }
        }

        @keyframes tail-fade {
          0%, 50% {
            width: var(--star-tail-length);
            opacity: 1;
          }
          70%, 80% {
            width: 0;
            opacity: 0.4;
          }
          100% {
            width: 0;
            opacity: 0;
          }
        }

        @keyframes blink {
          50% { opacity: 0.6; }
        }

        .starry-content {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .star-overlay {
          position: fixed;
          inset: 0;
          z-index: 1;
          background: linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.55) 100%);
          pointer-events: none;
        }
      `}</style>

            <div className="starry-root">
                <div className="stars" aria-hidden="true">
                    {stars.map((s) => (
                        <div
                            key={s.id}
                            className="star"
                            style={
                                ({
                                    ["--top-offset"]: s.topOffset,
                                    ["--star-tail-length"]: s.tailLength,
                                    ["--fall-duration"]: s.duration,
                                    ["--fall-delay"]: s.delay,
                                    ["--star-tail-height"]: s.tailHeight,
                                    ["--star-width"]: s.width,
                                })
                            }
                        />
                    ))}
                </div>

                <div className="star-overlay" />
                <div className="starry-content">
                    {children}
                </div>
            </div>
        </>
    );
}
