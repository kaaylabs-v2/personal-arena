import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipForward, SkipBack, Volume2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Scenario {
  title: string;
  description: string;
}

interface CoursePreviewPlayerProps {
  open: boolean;
  onClose: () => void;
  course: {
    name: string;
    description: string;
    dimensions: { name: string; weight: number }[];
    scenarios: { title: string; description: string }[];
    targetLevel: number;
    estimatedHours: number;
  };
}

/* ── Slide definitions ── */
interface Slide {
  id: string;
  duration: number; // ms
  render: (course: CoursePreviewPlayerProps["course"]) => React.ReactNode;
}

const slides: Slide[] = [
  {
    id: "intro",
    duration: 4000,
    render: (c) => (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-20 w-20 rounded-3xl bg-primary/15 flex items-center justify-center"
        >
          <span className="text-3xl">🎯</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-3xl md:text-4xl font-display font-bold text-foreground max-w-xl"
        >
          {c.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="text-base text-muted-foreground max-w-lg leading-relaxed"
        >
          {c.description}
        </motion.p>
      </div>
    ),
  },
  {
    id: "stats",
    duration: 3500,
    render: (c) => (
      <div className="flex flex-col items-center justify-center h-full px-8 space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-display font-semibold text-foreground"
        >
          What you'll achieve
        </motion.h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { label: "Target Mastery", value: `Level ${c.targetLevel}`, icon: "📈" },
            { label: "Estimated Time", value: `${c.estimatedHours} hours`, icon: "⏱" },
            { label: "Practice Scenarios", value: `${c.scenarios.length} sessions`, icon: "💬" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="flex flex-col items-center text-center space-y-2"
            >
              <span className="text-3xl">{stat.icon}</span>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "dimensions",
    duration: 4500,
    render: (c) => (
      <div className="flex flex-col items-center justify-center h-full px-8 space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-display font-semibold text-foreground"
        >
          Skills you'll develop
        </motion.h2>
        <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
          {c.dimensions.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className="rounded-xl border border-border bg-card p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-card-foreground">{d.name}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {d.weight}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.weight}%` }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-primary/60"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "scenarios",
    duration: 5000,
    render: (c) => (
      <div className="flex flex-col items-center justify-center h-full px-8 space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-display font-semibold text-foreground"
        >
          Practice scenarios
        </motion.h2>
        <div className="space-y-3 max-w-lg w-full">
          {c.scenarios.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.18 }}
              className="rounded-xl border border-border bg-card p-4 flex items-start gap-3"
            >
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm font-bold text-accent-foreground">{i + 1}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "demo",
    duration: 6000,
    render: (c) => {
      const messages = [
        { role: "ai", text: `Welcome to "${c.scenarios[0]?.title ?? "your scenario"}." You're stepping into the role. I'll set the scene — you respond as you would in real life.`, delay: 0.3 },
        { role: "ai", text: "Your team just discovered a critical data breach. The press is asking questions, and the board wants answers within the hour. How do you begin?", delay: 1.2 },
        { role: "user", text: "I'd start by assembling the crisis response team and getting a clear picture of what data was compromised before making any public statements.", delay: 2.5 },
        { role: "ai", text: "Strong instinct to gather facts first. Let's go deeper — your CTO says the breach is worse than initially thought. What's your next move?", delay: 3.8 },
      ];

      return (
        <div className="flex flex-col items-center justify-center h-full px-8 space-y-5">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            Live Session Preview
          </motion.h2>
          <div className="max-w-lg w-full space-y-3">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: m.delay, duration: 0.5 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    id: "outro",
    duration: 3500,
    render: (c) => (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl"
        >
          ✨
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-display font-bold text-foreground"
        >
          Ready to begin?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-muted-foreground max-w-sm"
        >
          {c.scenarios.length} practice scenarios · {c.dimensions.length} skill dimensions · AI-powered coaching
        </motion.p>
      </div>
    ),
  },
];

export function CoursePreviewPlayer({ open, onClose, course }: CoursePreviewPlayerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const totalSlides = slides.length;
  const slide = slides[currentSlide];

  // Auto-advance
  useEffect(() => {
    if (!open || !playing) return;
    setProgress(0);

    const duration = slide.duration;
    const tick = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += tick;
      setProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed >= duration) {
        clearInterval(interval);
        if (currentSlide < totalSlides - 1) {
          setCurrentSlide((p) => p + 1);
        } else {
          setPlaying(false);
        }
      }
    }, tick);

    return () => clearInterval(interval);
  }, [open, playing, currentSlide, slide, totalSlides]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setCurrentSlide(0);
      setPlaying(true);
      setProgress(0);
    }
  }, [open]);

  const goTo = useCallback((idx: number) => {
    setCurrentSlide(Math.max(0, Math.min(idx, totalSlides - 1)));
    setPlaying(true);
  }, [totalSlides]);

  if (!open) return null;

  // Total progress across all slides
  const totalProgress = ((currentSlide + progress / 100) / totalSlides) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium">
              Course Preview
            </span>
            <span className="text-[10px] text-muted-foreground/50">
              {currentSlide + 1} / {totalSlides}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-5 shrink-0">
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 0.15, ease: "linear" }}
            />
          </div>
          {/* Slide markers */}
          <div className="flex gap-1 mt-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < currentSlide
                    ? "bg-primary/40"
                    : i === currentSlide
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Slide content */}
        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {slide.render(course)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 px-5 py-4 shrink-0">
          <button
            onClick={() => goTo(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={() => setPlaying(!playing)}
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          <button
            onClick={() => goTo(currentSlide + 1)}
            disabled={currentSlide >= totalSlides - 1}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
