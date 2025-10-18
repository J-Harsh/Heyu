"use client";
import React, { useEffect, useRef, useState } from "react";

export interface ScrollStackCard {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  content?: React.ReactNode;
}

interface ScrollStackProps {
  cards: ScrollStackCard[];
  backgroundColor?: string;
  cardHeight?: string;
  animationDuration?: string;
  sectionHeightMultiplier?: number;
  intersectionThreshold?: number;
  className?: string;
}


const ScrollStack: React.FC<ScrollStackProps> = ({
  cards,
  backgroundColor = "bg-background", // Changed default to "bg-background"
  cardHeight = "60vh",
  animationDuration = "0.5s",
  sectionHeightMultiplier = 3,
  intersectionThreshold = 0.1,
  className = "",
}) => {
  const scrollableSectionRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ticking = useRef(false);
  const cardCount = Math.min(cards.length, 5);

  const cardStyle = {
    height: cardHeight,
    maxHeight: "600px",
    borderRadius: "12px",
    transition: `transform ${animationDuration} cubic-bezier(0.19, 1, 0.22, 1), opacity ${animationDuration} cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.3s ease`,
    willChange: "transform, opacity",
  };

  useEffect(() => {
    // Check if section is centered in the actual window viewport
    const checkIfCentered = () => {
      if (!scrollableSectionRef.current) return false;

      const rect = scrollableSectionRef.current.getBoundingClientRect();
      const windowCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;

      // Element is centered if its center is within 30% of viewport center
      const distanceFromCenter = Math.abs(elementCenter - windowCenter);
      return distanceFromCenter < window.innerHeight * 0.3;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const centered = checkIfCentered();
        setIsIntersecting(entry.isIntersecting && centered);
      },
      { threshold: [0, 0.1, 0.3, 0.5, 0.7, 1], rootMargin: "-10% 0px -10% 0px" }
    );

    if (scrollableSectionRef.current) {
      observer.observe(scrollableSectionRef.current);
    }

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          if (!sectionRef.current || !cardsContainerRef.current) return;

          const sectionRect = sectionRef.current.getBoundingClientRect();
          const parentRect = scrollableSectionRef.current?.getBoundingClientRect();
          const viewportHeight = parentRect?.height ?? window.innerHeight;

          const sectionTop = sectionRect.top - (parentRect?.top ?? 0);
          const sectionHeight = sectionRef.current.offsetHeight;
          const scrollableDistance = sectionHeight - viewportHeight;

          // If section is not centered, show first card
          if (!checkIfCentered()) {
            setActiveCardIndex(0);
            ticking.current = false;
            return;
          }

          let progress = 0;
          if (sectionTop <= 0 && Math.abs(sectionTop) <= scrollableDistance) {
            progress = Math.abs(sectionTop) / scrollableDistance;
          } else if (sectionTop <= 0) {
            progress = 1;
          }

          let newActiveIndex = 0;
          const progressPerCard = 1 / cardCount;
          for (let i = 0; i < cardCount; i++) {
            if (progress >= progressPerCard * (i + 1)) {
              newActiveIndex = i + 1;
            }
          }

          setActiveCardIndex(Math.min(newActiveIndex, cardCount - 1));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    // Listen to both internal scroll and window scroll
    const scrollElement = scrollableSectionRef.current;
    scrollElement?.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      scrollElement?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      if (scrollElement) observer.unobserve(scrollElement);
    };
  }, [cardCount, sectionHeightMultiplier, intersectionThreshold]);

  const getCardTransform = (index: number) => {
    // Always show at least the first card, or show cards based on active index
    const isVisible = (isIntersecting && activeCardIndex >= index) || (index === 0);
    const scale = 0.92 + index * 0.04;
    let translateY = "80px";

    if (isVisible) {
      translateY = `${60 - index * 20}px`;
    }

    return {
      transform: `translateY(${translateY}) scale(${scale})`,
      opacity: isVisible ? (index === 0 ? 0.95 : 1) : 0,
      zIndex: 10 + index * 10,
      pointerEvents: isVisible ? "auto" : "none",
    };
  };

  return (
    <section
      ref={scrollableSectionRef}
      className="relative max-h-screen w-full lg:w-[100%] overflow-y-scroll 
      scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300"
    >
      <div
        ref={sectionRef}
        className={`relative ${className}`}
        style={{ height: `${sectionHeightMultiplier * 85}vh` }}
      >
        <div
          className={`sticky top-0 w-full flex items-center 
            justify-center overflow-hidden ${backgroundColor}`}
          style={{
            height: `calc(${cardHeight} + 120px)`,
            minHeight: '600px',
            maxHeight: '90vh'
          }}
        >
          <div className="container px-4 lg:px-6 mx-auto h-full flex flex-col justify-center py-12">
            <div
              ref={cardsContainerRef}
              className="relative w-full max-w-5xl mx-auto flex-shrink-0"
              style={{ height: cardHeight }}
            >
              {cards.slice(0, 5).map((card, index) => {
                const cardTransform = getCardTransform(index);


                return (
                  <div
                    key={index}
                    className={`absolute z-50 overflow-hidden group
                      transition-all duration-300 shadow-lg hover:shadow-2xl`}
                    style={{
                      ...cardStyle,
                      top: 0,
                      left: "50%",
                      transform: `translateX(-50%) ${cardTransform.transform}`,
                      width: "100%",
                      maxWidth: "100%",
                      opacity: cardTransform.opacity,
                      zIndex: cardTransform.zIndex,
                      pointerEvents:
                        cardTransform.pointerEvents as React.CSSProperties["pointerEvents"],
                    }}
                  >
                    {/* Enhanced background with green gradient */}
                    <div className="absolute inset-0 z-0 bg-card rounded-[12px]">
                      {/* Green gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-60" />
                      {/* Green accent border */}
                      <div className="absolute inset-0 rounded-[12px] ring-1 ring-primary/20 ring-inset" />
                      {/* Green glow effect */}
                      <div className="absolute -inset-[1px] rounded-[12px] bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                    </div>

                    {/* Green accent bar */}
                    <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-primary via-primary/80 to-primary/40 rounded-r-full" />

                    <div className="relative z-10 p-8 sm:p-10 md:p-12 h-full flex items-center">
                      {card.content ? (
                        card.content
                      ) : (
                        <div className="max-w-2xl">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-card-foreground leading-tight mb-4 tracking-tight">
                            {card.title}
                          </h3>
                          {card.subtitle && (
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                              {card.subtitle}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollStack;
