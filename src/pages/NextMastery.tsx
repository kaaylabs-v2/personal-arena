import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";

const NextMastery = () => {
  const navigate = useNavigate();

  return (
    <Layout pageTitle="Next Mastery">
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-3">
            What would you like to master next?
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Your growth doesn't stop here. Choose your next mastery journey.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Start Another Mastery Journey <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NextMastery;
