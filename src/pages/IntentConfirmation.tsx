import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from "lucide-react";
import { Layout } from "@/components/Layout";

const IntentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { intent } = (location.state as { intent?: string }) || {};

  return (
    <Layout pageTitle="Intent">
      <div className="max-w-xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-6">
            <Target className="h-5 w-5 text-accent-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">You want to master</p>
          <h1 className="text-2xl font-display font-bold text-foreground mb-8">
            {intent || "Your chosen objective"}
          </h1>
          <div className="rounded-xl border border-border bg-card p-5 text-left mb-8">
            <p className="text-sm text-muted-foreground">
              Arena will now assess your current baseline to generate a personalized mastery program tailored to your needs.
            </p>
          </div>
          <Button onClick={() => navigate("/assessment")} className="w-full">
            Start Baseline Assessment <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default IntentConfirmation;
