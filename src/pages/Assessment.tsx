import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Layout } from "@/components/Layout";

const questions = [
  {
    id: 1,
    type: "scenario",
    prompt: "Your team is split on a critical product decision. Half want to prioritize speed, half want quality. As the leader, how do you approach this?",
  },
  {
    id: 2,
    type: "decision",
    prompt: "You have data suggesting a current strategy is underperforming, but your stakeholders are emotionally invested. What's your next move?",
  },
  {
    id: 3,
    type: "explanation",
    prompt: "Describe a time you changed your mind about something important at work. What caused the shift and what was the outcome?",
  },
  {
    id: 4,
    type: "scenario",
    prompt: "A direct report consistently delivers good work but avoids collaboration. How do you address this without demotivating them?",
  },
  {
    id: 5,
    type: "open",
    prompt: "What does 'mastery' in your chosen objective look like to you? Describe the ideal future state.",
  },
];

const Assessment = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const progress = ((current + 1) / questions.length) * 100;
  const question = questions[current];

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  return (
    <Layout pageTitle="Assessment">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">
            Question {current + 1} of {questions.length}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>~15 min</span>
          </div>
        </div>

        <Progress value={progress} className="mb-10 h-1.5" />

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <span className="inline-block text-xs font-medium uppercase tracking-wider text-primary mb-3 px-2.5 py-1 rounded-full bg-accent">
              {question.type}
            </span>
            <h2 className="text-xl font-display font-semibold text-foreground mb-6 leading-relaxed">
              {question.prompt}
            </h2>
            <Textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Share your thinking..."
              className="min-h-[160px] resize-none bg-card border-border"
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {current < questions.length - 1 ? (
            <Button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={!answers[question.id]?.trim()}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/mastery-plan")}
              disabled={!answers[question.id]?.trim()}
            >
              Generate My Mastery Plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Assessment;
