import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, TrendingUp, Sparkles } from "lucide-react";
import { useLearner } from "@/contexts/LearnerContext";

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to your AI coaching space",
    description: "This is where you grow. Think of it as a patient, smart coach that meets you where you are — no judgment, no grades.",
  },
  {
    icon: MessageCircle,
    title: "How it works",
    description: "You'll have conversations with an AI coach. It asks questions, you think through your answers. With each session, your thinking gets sharper.",
    illustration: true,
  },
  {
    icon: TrendingUp,
    title: "Ready to begin?",
    description: "Your first session takes about 15 minutes. There are no wrong answers — just honest thinking.",
    cta: true,
  },
];

export const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { setHasCompletedSession } = useLearner();
  const current = steps[step];
  const Icon = current.icon;

  const handleStart = () => {
    setHasCompletedSession(true);
    navigate("/arena-session");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-8 h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center"
            >
              <Icon className="h-10 w-10 text-primary" />
            </motion.div>

            <h1 className="text-2xl font-display font-bold text-foreground mb-3">
              {current.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              {current.description}
            </p>

            {current.illustration && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-border bg-card p-5 mb-8 text-left"
              >
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="rounded-xl bg-muted px-4 py-2.5">
                      <p className="text-sm text-foreground">"What assumptions are you making about this situation?"</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="rounded-xl bg-primary px-4 py-2.5">
                      <p className="text-sm text-primary-foreground">"I think the main issue is..."</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="rounded-xl bg-muted px-4 py-2.5">
                      <p className="text-sm text-foreground">"Good start. What evidence supports that?"</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/40" : "w-4 bg-muted"
                  }`}
                />
              ))}
            </div>

            {current.cta ? (
              <Button onClick={handleStart} size="lg" className="w-full text-base">
                Start Your First Session <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button onClick={() => setStep(step + 1)} variant="outline" size="lg" className="w-full text-base">
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            {step === 2 && (
              <button
                onClick={() => { setHasCompletedSession(true); navigate("/"); }}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip to dashboard →
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
