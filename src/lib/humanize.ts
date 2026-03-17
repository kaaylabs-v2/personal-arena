// Convert numeric mastery levels to human-friendly labels
export function humanLevel(level: number): string {
  if (level >= 4.0) return "Strong";
  if (level >= 3.0) return "Getting comfortable";
  if (level >= 2.0) return "Building up";
  return "Getting started";
}

// Convert percentage to a friendly progress label
export function humanProgress(current: number, target: number): string {
  const pct = Math.round(((current - 1) / (target - 1)) * 100);
  if (pct >= 90) return "Almost there!";
  if (pct >= 70) return "Making great progress";
  if (pct >= 40) return "Building momentum";
  if (pct >= 20) return "Getting started";
  return "Just beginning";
}

// Convert status/trend jargon to plain language
export function humanStatus(status: string): string {
  const map: Record<string, string> = {
    critical: "Needs work",
    attention: "Could use practice",
    healthy: "Going well",
    stable: "Steady",
    declining: "Could use more practice",
    improving: "Getting better",
    proficient: "Going well",
  };
  return map[status.toLowerCase()] || status;
}

// Convert session stage names to friendly language
export function humanStage(stage: string): string {
  const map: Record<string, string> = {
    clarify: "Let's explore the topic",
    challenge: "Let's test your thinking",
    evidence: "Walk me through your reasoning",
    alternative: "What else could work?",
    reflect: "Let's look back at your growth",
  };
  return map[stage.toLowerCase()] || stage;
}

// Friendly stage short names for pills
export function humanStagePill(stage: string): string {
  const map: Record<string, string> = {
    clarify: "Explore",
    challenge: "Challenge",
    evidence: "Reasoning",
    alternative: "Alternatives",
    reflect: "Reflect",
  };
  return map[stage.toLowerCase()] || stage;
}
