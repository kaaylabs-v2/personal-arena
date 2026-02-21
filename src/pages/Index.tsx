import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/Layout";

const subjects = [
  "Leadership",
  "Product Management",
  "AI Strategy",
  "Data Analysis",
  "Communication",
  "Negotiation",
  "Decision Making",
];

const exampleObjectives = [
  "Lead distributed teams",
  "Make data-driven decisions",
  "Resolve stakeholder conflicts",
  "Present strategy effectively",
];

const HomePage = () => {
  const navigate = useNavigate();
  const [objective, setObjective] = useState("");
  const [subject, setSubject] = useState("");
  const [specificChoice, setSpecificChoice] = useState<"general" | "specific" | null>(null);
  const [specificText, setSpecificText] = useState("");

  const handleObjectiveContinue = () => {
    if (objective.trim()) {
      navigate("/intent", { state: { intent: objective, type: "objective" } });
    }
  };

  const handleSubjectContinue = () => {
    const intent = specificChoice === "specific" && specificText.trim()
      ? `${subject}: ${specificText}`
      : `General mastery in ${subject}`;
    navigate("/intent", { state: { intent, type: "subject" } });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-muted-foreground text-sm mb-1">Good afternoon,</p>
          <h1 className="text-3xl font-display font-bold text-foreground mb-10">
            What would you like to master?
          </h1>

          <Tabs defaultValue="objective" className="w-full">
            <TabsList className="mb-8 bg-surface">
              <TabsTrigger value="objective" className="data-[state=active]:bg-card">Objective</TabsTrigger>
              <TabsTrigger value="subject" className="data-[state=active]:bg-card">Subject</TabsTrigger>
            </TabsList>

            <TabsContent value="objective">
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  What would you like to be able to do better?
                </p>
                <Textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="e.g., Lead distributed teams effectively..."
                  className="min-h-[100px] resize-none bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
                <div className="flex flex-wrap gap-2">
                  {exampleObjectives.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setObjective(ex)}
                      className="text-xs px-3 py-1.5 rounded-full bg-surface text-surface-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleObjectiveContinue}
                  disabled={!objective.trim()}
                  className="w-full"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="subject">
              <div className="space-y-5">
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Choose a subject area" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {subject && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Would you like to master something specific in this topic?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSpecificChoice("general")}
                        className={`flex-1 p-3 rounded-lg border text-sm transition-colors ${
                          specificChoice === "general"
                            ? "border-primary bg-accent text-accent-foreground"
                            : "border-border bg-card text-card-foreground hover:bg-surface"
                        }`}
                      >
                        General mastery
                      </button>
                      <button
                        onClick={() => setSpecificChoice("specific")}
                        className={`flex-1 p-3 rounded-lg border text-sm transition-colors ${
                          specificChoice === "specific"
                            ? "border-primary bg-accent text-accent-foreground"
                            : "border-border bg-card text-card-foreground hover:bg-surface"
                        }`}
                      >
                        Something specific
                      </button>
                    </div>

                    {specificChoice === "specific" && (
                      <Textarea
                        value={specificText}
                        onChange={(e) => setSpecificText(e.target.value)}
                        placeholder="Describe what you'd like to focus on..."
                        className="min-h-[80px] resize-none bg-card"
                      />
                    )}

                    <Button
                      onClick={handleSubjectContinue}
                      disabled={!specificChoice || (specificChoice === "specific" && !specificText.trim())}
                      className="w-full"
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default HomePage;
