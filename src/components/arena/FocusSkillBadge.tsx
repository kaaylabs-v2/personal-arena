import { Target } from "lucide-react";

interface FocusSkillBadgeProps {
  skill: string;
}

export const FocusSkillBadge = ({ skill }: FocusSkillBadgeProps) => (
  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
    <Target className="h-3 w-3" />
    Focus Skill: {skill}
  </div>
);
