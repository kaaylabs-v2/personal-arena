import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const JoinArena = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
          <span className="text-primary-foreground font-display font-bold text-xl">A</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Join Arena</h1>
        <div className="rounded-xl border border-border bg-card p-6 mt-6 text-left space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Organization</p>
            <p className="text-sm font-medium text-card-foreground">Acme Corp</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Invitation</p>
            <p className="text-sm text-card-foreground">
              You've been invited to develop your leadership capabilities through Arena's mastery program.
            </p>
          </div>
        </div>
        <Button onClick={() => navigate("/")} className="w-full mt-6">
          <CheckCircle className="mr-2 h-4 w-4" /> Join Arena
        </Button>
      </motion.div>
    </div>
  );
};

export default JoinArena;
