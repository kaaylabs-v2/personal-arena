import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ScrollHintsProps {
  children: ReactNode;
  className?: string;
}

export function ScrollHints({ children, className = "" }: ScrollHintsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 20);
    setCanScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 20);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  return (
    <div className="relative flex-1 min-h-0">
      {/* Up hint */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 pointer-events-none flex flex-col items-center transition-opacity duration-300 ${
          canScrollUp ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="pt-1">
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground animate-bounce" />
        </div>
        <div className="h-6 w-full bg-gradient-to-b from-surface to-transparent" />
      </div>

      <div
        ref={scrollRef}
        className={`h-full overflow-auto scrollbar-none ${className}`}
      >
        {children}
      </div>

      {/* Down hint */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 pointer-events-none flex flex-col items-center transition-opacity duration-300 ${
          canScrollDown ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="h-6 w-full bg-gradient-to-t from-surface to-transparent" />
        <div className="pb-1">
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground animate-bounce" />
        </div>
      </div>
    </div>
  );
}
