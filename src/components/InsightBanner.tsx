import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface InsightBannerProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const InsightBanner = ({ title = "Insight", children, className = "" }: InsightBannerProps) => (
  <motion.div
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3 flex items-start gap-3 ${className}`}
  >
    <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-0.5">{title}</p>
      <div className="text-xs text-muted-foreground leading-relaxed">{children}</div>
    </div>
  </motion.div>
);
