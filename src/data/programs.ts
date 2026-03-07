// Centralized mastery program data for the Arena platform

export type Trend = "improving" | "declining" | "stable";
export type SkillStatus = "critical" | "attention" | "healthy" | "stable";

export interface RecommendedSession {
  id: string;
  title: string;
}

export interface PastSession {
  title: string;
}

export interface Capability {
  capability_id: string;
  domain_id: string;
  capability_name: string;
  description: string;
  current_level: number;
  target_level: number;
  trend: Trend;
  recommended_sessions: RecommendedSession[];
  past_sessions: PastSession[];
}

export interface Domain {
  domain_id: string;
  domain_name: string;
  description: string;
  capabilities: Capability[];
}

export interface FocusSkill {
  id: string;
  name: string;
  domain: string;
  current_level: number;
  target_level: number;
  progress: number;
  status: "critical" | "attention";
  trend: Trend;
}

export interface FocusSession {
  id: string;
  title: string;
  description: string;
  relatedSkill: string;
}

export interface MasteryProgram {
  id: string;
  name: string;
  description: string;
  targetLearner: string;
  current_level: number;
  target_level: number;
  dimension_count: number;
  domains: Domain[];
  focusSkills: FocusSkill[];
  focusSessions: FocusSession[];
  insightText: string;
}

// ─── Strategic Leadership ───

const strategicLeadershipDomains: Domain[] = [
  {
    domain_id: "d1", domain_name: "Decision Making",
    description: "Structured reasoning and evidence-based judgment",
    capabilities: [
      { capability_id: "c1", domain_id: "d1", capability_name: "Evidence Evaluation", description: "Ability to support decisions with data and distinguish assumptions from evidence.", current_level: 1.8, target_level: 4.0, trend: "improving", recommended_sessions: [{ id: "conflicting-stakeholder-scenario", title: "Conflicting Stakeholder Scenario" }, { id: "executive-escalation-analysis", title: "Executive Escalation Analysis" }], past_sessions: [{ title: "Distributed Team Communication" }, { title: "Executive Escalation" }] },
      { capability_id: "c2", domain_id: "d1", capability_name: "Tradeoff Analysis", description: "Evaluating competing priorities and making balanced decisions under constraints.", current_level: 2.6, target_level: 4.0, trend: "stable", recommended_sessions: [{ id: "resource-allocation-challenge", title: "Resource Allocation Challenge" }], past_sessions: [{ title: "Identifying Tradeoffs" }, { title: "Stakeholder Conflict Scenario" }] },
      { capability_id: "c3", domain_id: "d1", capability_name: "Risk Framing", description: "Identifying, assessing, and communicating risk to inform strategic choices.", current_level: 2.0, target_level: 4.0, trend: "improving", recommended_sessions: [{ id: "probability-estimation-drill", title: "Probability Estimation Drill" }], past_sessions: [{ title: "Risk Identification" }] },
      { capability_id: "c4", domain_id: "d1", capability_name: "Strategic Prioritization", description: "Aligning competing demands with strategic objectives to maximize impact.", current_level: 3.2, target_level: 4.5, trend: "improving", recommended_sessions: [{ id: "portfolio-balancing", title: "Portfolio Balancing" }], past_sessions: [{ title: "Urgency vs Importance" }, { title: "MoSCoW Method" }] },
      { capability_id: "c5", domain_id: "d1", capability_name: "Data-Driven Judgment", description: "Using quantitative and qualitative data to ground decisions and reduce bias.", current_level: 1.4, target_level: 4.0, trend: "declining", recommended_sessions: [{ id: "reading-dashboards", title: "Reading Dashboards" }, { id: "bias-in-data", title: "Bias in Data" }], past_sessions: [] },
    ],
  },
  {
    domain_id: "d2", domain_name: "Stakeholder Leadership",
    description: "Influence, alignment, and managing complex stakeholder dynamics",
    capabilities: [
      { capability_id: "c6", domain_id: "d2", capability_name: "Stakeholder Mapping", description: "Identifying key stakeholders, their interests, and influence on outcomes.", current_level: 3.0, target_level: 4.5, trend: "stable", recommended_sessions: [{ id: "coalition-building", title: "Coalition Building" }], past_sessions: [{ title: "Mapping Stakeholders" }, { title: "Interest Analysis" }] },
      { capability_id: "c7", domain_id: "d2", capability_name: "Conflict Resolution", description: "Navigating disagreements and finding constructive paths forward.", current_level: 2.2, target_level: 4.0, trend: "stable", recommended_sessions: [], past_sessions: [] },
      { capability_id: "c8", domain_id: "d2", capability_name: "Executive Communication", description: "Presenting ideas clearly and persuasively to senior leaders.", current_level: 2.8, target_level: 4.5, trend: "improving", recommended_sessions: [], past_sessions: [] },
    ],
  },
  {
    domain_id: "d3", domain_name: "Organizational Thinking",
    description: "Systems perspective and cross-functional awareness",
    capabilities: [
      { capability_id: "c9", domain_id: "d3", capability_name: "Systems Thinking", description: "Understanding interdependencies and second-order effects across the organization.", current_level: 2.1, target_level: 4.0, trend: "stable", recommended_sessions: [], past_sessions: [] },
      { capability_id: "c10", domain_id: "d3", capability_name: "Cross-Functional Alignment", description: "Building shared understanding and coordinated action across teams.", current_level: 2.5, target_level: 4.0, trend: "improving", recommended_sessions: [], past_sessions: [] },
      { capability_id: "c11", domain_id: "d3", capability_name: "Change Navigation", description: "Leading through uncertainty and helping teams adapt to shifting contexts.", current_level: 1.9, target_level: 3.5, trend: "declining", recommended_sessions: [], past_sessions: [] },
    ],
  },
  {
    domain_id: "d4", domain_name: "Communication Leadership",
    description: "Clarity, persuasion, and adaptive messaging",
    capabilities: [
      { capability_id: "c12", domain_id: "d4", capability_name: "Adaptive Messaging", description: "Tailoring communication style and content to different audiences and contexts.", current_level: 3.4, target_level: 4.5, trend: "improving", recommended_sessions: [], past_sessions: [] },
      { capability_id: "c13", domain_id: "d4", capability_name: "Narrative Framing", description: "Structuring compelling narratives that drive alignment and action.", current_level: 2.7, target_level: 4.0, trend: "stable", recommended_sessions: [], past_sessions: [] },
    ],
  },
  {
    domain_id: "d5", domain_name: "Strategic Framing",
    description: "Vision articulation and strategic context setting",
    capabilities: [
      { capability_id: "c14", domain_id: "d5", capability_name: "Vision Articulation", description: "Crafting and communicating a clear, inspiring vision that guides strategic direction.", current_level: 2.0, target_level: 4.0, trend: "stable", recommended_sessions: [], past_sessions: [] },
      { capability_id: "c15", domain_id: "d5", capability_name: "Context Setting", description: "Establishing the strategic landscape so teams can make informed decisions independently.", current_level: 2.3, target_level: 4.0, trend: "declining", recommended_sessions: [], past_sessions: [] },
    ],
  },
];

// ─── Algebra Foundations ───

const algebraDomains: Domain[] = [
  {
    domain_id: "al1", domain_name: "Algebraic Reasoning",
    description: "Building logical chains from definitions to conclusions",
    capabilities: [
      { capability_id: "ac1", domain_id: "al1", capability_name: "Variable Manipulation", description: "Working confidently with variables, expressions, and substitution.", current_level: 2.8, target_level: 4.0, trend: "improving", recommended_sessions: [{ id: "variable-practice", title: "Variable Practice Lab" }], past_sessions: [{ title: "Intro to Variables" }] },
      { capability_id: "ac2", domain_id: "al1", capability_name: "Logical Deduction", description: "Drawing valid conclusions step by step from given information.", current_level: 2.0, target_level: 4.0, trend: "stable", recommended_sessions: [{ id: "logic-chains", title: "Logic Chains" }], past_sessions: [] },
    ],
  },
  {
    domain_id: "al2", domain_name: "Equation Solving",
    description: "Strategies for isolating unknowns and verifying solutions",
    capabilities: [
      { capability_id: "ac3", domain_id: "al2", capability_name: "Solving Linear Equations", description: "Solving one- and two-step equations with confidence and checking answers.", current_level: 2.5, target_level: 4.0, trend: "improving", recommended_sessions: [{ id: "linear-eq-challenge", title: "Linear Equation Challenge" }], past_sessions: [{ title: "One-Step Equations" }] },
      { capability_id: "ac4", domain_id: "al2", capability_name: "Checking Solution Validity", description: "Substituting solutions back to verify correctness.", current_level: 1.8, target_level: 3.5, trend: "stable", recommended_sessions: [{ id: "solution-check-drill", title: "Solution Check Drill" }], past_sessions: [] },
      { capability_id: "ac5", domain_id: "al2", capability_name: "Multi-Step Equations", description: "Handling equations requiring distribution, combining like terms, and multiple operations.", current_level: 1.4, target_level: 4.0, trend: "declining", recommended_sessions: [{ id: "multi-step-practice", title: "Multi-Step Practice" }], past_sessions: [] },
    ],
  },
  {
    domain_id: "al3", domain_name: "Pattern Recognition",
    description: "Identifying structure and regularity in mathematical contexts",
    capabilities: [
      { capability_id: "ac6", domain_id: "al3", capability_name: "Recognizing Patterns in Sequences", description: "Spotting arithmetic and geometric patterns in number sequences.", current_level: 3.0, target_level: 4.0, trend: "improving", recommended_sessions: [{ id: "pattern-puzzle", title: "Pattern Recognition Puzzle" }], past_sessions: [{ title: "Arithmetic Sequences" }] },
      { capability_id: "ac7", domain_id: "al3", capability_name: "Function Tables", description: "Reading and completing input-output tables for linear functions.", current_level: 2.2, target_level: 3.5, trend: "stable", recommended_sessions: [], past_sessions: [] },
    ],
  },
  {
    domain_id: "al4", domain_name: "Mathematical Communication",
    description: "Expressing mathematical reasoning clearly",
    capabilities: [
      { capability_id: "ac8", domain_id: "al4", capability_name: "Translating Word Problems", description: "Converting real-world scenarios into algebraic equations.", current_level: 1.5, target_level: 4.0, trend: "declining", recommended_sessions: [{ id: "word-problem-scenario", title: "Word Problem Reasoning Scenario" }], past_sessions: [] },
      { capability_id: "ac9", domain_id: "al4", capability_name: "Showing Work", description: "Writing clear, step-by-step solutions others can follow.", current_level: 2.0, target_level: 3.5, trend: "stable", recommended_sessions: [], past_sessions: [] },
    ],
  },
  {
    domain_id: "al5", domain_name: "Problem Decomposition",
    description: "Breaking complex problems into manageable parts",
    capabilities: [
      { capability_id: "ac10", domain_id: "al5", capability_name: "Equation Setup", description: "Identifying knowns, unknowns, and relationships before solving.", current_level: 1.6, target_level: 4.0, trend: "declining", recommended_sessions: [{ id: "setup-lab", title: "Equation Setup Lab" }], past_sessions: [] },
      { capability_id: "ac11", domain_id: "al5", capability_name: "Sub-Problem Identification", description: "Recognizing when a problem can be split into smaller solvable parts.", current_level: 2.4, target_level: 3.5, trend: "improving", recommended_sessions: [], past_sessions: [{ title: "Decomposition Intro" }] },
    ],
  },
];

// ─── Calculus I Mastery ───

const calculusDomains: Domain[] = [
  {
    domain_id: "cl1", domain_name: "Limit Reasoning",
    description: "Understanding continuity and the foundation of calculus",
    capabilities: [
      { capability_id: "cc1", domain_id: "cl1", capability_name: "Understanding Limits", description: "Evaluating limits graphically, numerically, and algebraically.", current_level: 2.8, target_level: 4.0, trend: "improving", recommended_sessions: [{ id: "limit-evaluation", title: "Limit Evaluation Lab" }], past_sessions: [{ title: "Intro to Limits" }, { title: "Squeeze Theorem" }] },
      { capability_id: "cc2", domain_id: "cl1", capability_name: "Continuity Analysis", description: "Determining where functions are continuous and classifying discontinuities.", current_level: 2.2, target_level: 3.5, trend: "stable", recommended_sessions: [], past_sessions: [{ title: "Types of Discontinuity" }] },
    ],
  },
  {
    domain_id: "cl2", domain_name: "Derivative Application",
    description: "Rules, techniques, and real-world applications of derivatives",
    capabilities: [
      { capability_id: "cc3", domain_id: "cl2", capability_name: "Chain Rule Application", description: "Differentiating composite functions using the chain rule fluently.", current_level: 1.5, target_level: 4.0, trend: "declining", recommended_sessions: [{ id: "chain-rule-scenario", title: "Chain Rule Scenario" }, { id: "nested-functions", title: "Nested Functions Drill" }], past_sessions: [] },
      { capability_id: "cc4", domain_id: "cl2", capability_name: "Optimization Problems", description: "Using derivatives to find maxima and minima in applied contexts.", current_level: 1.2, target_level: 4.0, trend: "declining", recommended_sessions: [{ id: "optimization-challenge", title: "Optimization Challenge" }], past_sessions: [] },
      { capability_id: "cc5", domain_id: "cl2", capability_name: "Interpreting Derivative Graphs", description: "Reading f'(x) graphs to infer behavior of f(x).", current_level: 2.0, target_level: 3.5, trend: "improving", recommended_sessions: [{ id: "derivative-interpretation", title: "Derivative Interpretation Exercise" }], past_sessions: [{ title: "Graph Reading Basics" }] },
      { capability_id: "cc6", domain_id: "cl2", capability_name: "Implicit Differentiation", description: "Differentiating equations not solved for y.", current_level: 1.8, target_level: 3.5, trend: "stable", recommended_sessions: [], past_sessions: [] },
    ],
  },
  {
    domain_id: "cl3", domain_name: "Integration Thinking",
    description: "Accumulation, area, and antiderivative reasoning",
    capabilities: [
      { capability_id: "cc7", domain_id: "cl3", capability_name: "Basic Antiderivatives", description: "Finding antiderivatives using power rule and basic techniques.", current_level: 2.5, target_level: 4.0, trend: "improving", recommended_sessions: [], past_sessions: [{ title: "Antiderivative Practice" }] },
      { capability_id: "cc8", domain_id: "cl3", capability_name: "Area Under Curves", description: "Computing definite integrals and interpreting them as accumulated area.", current_level: 1.9, target_level: 3.5, trend: "stable", recommended_sessions: [{ id: "riemann-sums", title: "Riemann Sums Exploration" }], past_sessions: [] },
    ],
  },
  {
    domain_id: "cl4", domain_name: "Mathematical Proof",
    description: "Constructing rigorous arguments and justifications",
    capabilities: [
      { capability_id: "cc9", domain_id: "cl4", capability_name: "Epsilon-Delta Arguments", description: "Writing formal limit proofs using epsilon-delta definitions.", current_level: 1.0, target_level: 3.0, trend: "stable", recommended_sessions: [{ id: "epsilon-delta-lab", title: "Epsilon-Delta Lab" }], past_sessions: [] },
      { capability_id: "cc10", domain_id: "cl4", capability_name: "Proof by Contradiction", description: "Using indirect reasoning to establish mathematical facts.", current_level: 1.6, target_level: 3.0, trend: "improving", recommended_sessions: [], past_sessions: [] },
    ],
  },
  {
    domain_id: "cl5", domain_name: "Problem Modeling",
    description: "Translating real-world situations into calculus frameworks",
    capabilities: [
      { capability_id: "cc11", domain_id: "cl5", capability_name: "Related Rates", description: "Setting up and solving problems where multiple quantities change over time.", current_level: 1.3, target_level: 3.5, trend: "declining", recommended_sessions: [{ id: "related-rates-sim", title: "Related Rates Simulation" }], past_sessions: [] },
      { capability_id: "cc12", domain_id: "cl5", capability_name: "Modeling with Functions", description: "Choosing appropriate function models for real-world data.", current_level: 2.1, target_level: 3.5, trend: "stable", recommended_sessions: [], past_sessions: [{ title: "Curve Fitting Intro" }] },
    ],
  },
];

// ─── Insurance Sales Mastery ───

const insuranceSalesDomains: Domain[] = [
  {
    domain_id: "is1", domain_name: "Customer Needs Analysis",
    description: "Understanding client situations and coverage requirements",
    capabilities: [
      { capability_id: "ic1", domain_id: "is1", capability_name: "Life Stage Assessment", description: "Evaluating client life circumstances to recommend appropriate coverage.", current_level: 2.5, target_level: 4.0, trend: "improving", recommended_sessions: [{ id: "life-stage-sim", title: "Life Stage Assessment Sim" }], past_sessions: [{ title: "Needs Discovery" }] },
      { capability_id: "ic2", domain_id: "is1", capability_name: "Risk Profiling", description: "Identifying and quantifying client risk exposure.", current_level: 2.0, target_level: 4.0, trend: "stable", recommended_sessions: [{ id: "risk-profile-drill", title: "Risk Profiling Drill" }], past_sessions: [] },
      { capability_id: "ic3", domain_id: "is1", capability_name: "Coverage Gap Identification", description: "Spotting areas where a client's current coverage is insufficient.", current_level: 1.8, target_level: 3.5, trend: "declining", recommended_sessions: [{ id: "gap-analysis-scenario", title: "Coverage Gap Scenario" }], past_sessions: [] },
    ],
  },
  {
    domain_id: "is2", domain_name: "Value Framing",
    description: "Articulating the value of insurance products clearly",
    capabilities: [
      { capability_id: "ic4", domain_id: "is2", capability_name: "Policy Structuring", description: "Designing coverage packages aligned with client needs and budget.", current_level: 2.2, target_level: 4.0, trend: "improving", recommended_sessions: [{ id: "policy-recommendation", title: "Policy Recommendation Scenario" }], past_sessions: [{ title: "Product Knowledge" }] },
      { capability_id: "ic5", domain_id: "is2", capability_name: "Risk Communication", description: "Explaining risk in relatable terms that motivate action.", current_level: 1.6, target_level: 3.5, trend: "declining", recommended_sessions: [{ id: "risk-storytelling", title: "Risk Storytelling" }], past_sessions: [] },
      { capability_id: "ic6", domain_id: "is2", capability_name: "ROI Framing", description: "Positioning insurance premiums as investments in financial security.", current_level: 2.8, target_level: 4.0, trend: "stable", recommended_sessions: [], past_sessions: [{ title: "Value Positioning" }] },
    ],
  },
  {
    domain_id: "is3", domain_name: "Objection Handling",
    description: "Responding to client hesitation with empathy and evidence",
    capabilities: [
      { capability_id: "ic7", domain_id: "is3", capability_name: "Handling Price Objections", description: "Reframing cost concerns by highlighting value and consequences of being uninsured.", current_level: 1.4, target_level: 4.0, trend: "declining", recommended_sessions: [{ id: "customer-objection-sim", title: "Customer Objection Simulation" }, { id: "price-reframe", title: "Price Reframe Practice" }], past_sessions: [] },
      { capability_id: "ic8", domain_id: "is3", capability_name: "Trust Objections", description: "Addressing skepticism about insurance companies and policies.", current_level: 2.0, target_level: 3.5, trend: "improving", recommended_sessions: [], past_sessions: [{ title: "Building Trust" }] },
    ],
  },
  {
    domain_id: "is4", domain_name: "Trust Building",
    description: "Establishing credibility and long-term client relationships",
    capabilities: [
      { capability_id: "ic9", domain_id: "is4", capability_name: "Ethical Sales Communication", description: "Maintaining transparency and integrity throughout the sales process.", current_level: 3.2, target_level: 4.0, trend: "stable", recommended_sessions: [], past_sessions: [{ title: "Ethics Workshop" }, { title: "Transparent Selling" }] },
      { capability_id: "ic10", domain_id: "is4", capability_name: "Follow-Up Strategy", description: "Maintaining engagement through structured, value-driven follow-ups.", current_level: 2.4, target_level: 3.5, trend: "improving", recommended_sessions: [{ id: "follow-up-cadence", title: "Follow-Up Cadence Sim" }], past_sessions: [] },
    ],
  },
  {
    domain_id: "is5", domain_name: "Compliance Awareness",
    description: "Regulatory knowledge and ethical selling standards",
    capabilities: [
      { capability_id: "ic11", domain_id: "is5", capability_name: "Regulatory Compliance", description: "Understanding and adhering to insurance regulations and disclosure requirements.", current_level: 2.6, target_level: 4.0, trend: "stable", recommended_sessions: [{ id: "compliance-risk-scenario", title: "Compliance Risk Scenario" }], past_sessions: [{ title: "Regulation Basics" }] },
      { capability_id: "ic12", domain_id: "is5", capability_name: "Documentation Standards", description: "Maintaining proper records and disclosures for every client interaction.", current_level: 3.0, target_level: 4.0, trend: "improving", recommended_sessions: [], past_sessions: [{ title: "Audit Prep" }] },
    ],
  },
];

// ─── Programs ───

export const programs: MasteryProgram[] = [
  {
    id: "p1", name: "Strategic Leadership",
    description: "Capability development across 5 dimensions",
    targetLearner: "Professionals and managers",
    current_level: 3.1, target_level: 4.0, dimension_count: 5,
    domains: strategicLeadershipDomains,
    focusSkills: [
      { id: "c5", name: "Data-Driven Judgment", domain: "Decision Making", current_level: 1.4, target_level: 4.0, progress: 35, status: "critical", trend: "declining" },
      { id: "c1", name: "Evidence Evaluation", domain: "Decision Making", current_level: 1.8, target_level: 4.0, progress: 45, status: "attention", trend: "improving" },
      { id: "c15", name: "Context Setting", domain: "Strategic Framing", current_level: 2.3, target_level: 4.0, progress: 58, status: "attention", trend: "declining" },
    ],
    focusSessions: [
      { id: "reading-dashboards", title: "Reading Dashboards", description: "Interpret data dashboards to identify patterns and draw evidence-based conclusions.", relatedSkill: "Data-Driven Judgment" },
      { id: "conflicting-stakeholder-scenario", title: "Conflicting Stakeholder Scenario", description: "Navigate competing priorities and support decisions with structured evidence.", relatedSkill: "Evidence Evaluation" },
      { id: "bias-in-data", title: "Bias in Data", description: "Identify cognitive biases in data interpretation and build judgment discipline.", relatedSkill: "Data-Driven Judgment" },
    ],
    insightText: "Your <strong>Data-Driven Judgment</strong> is declining — prioritize dashboard interpretation sessions this week. <strong>Evidence Evaluation</strong> is improving but still below threshold.",
  },
  {
    id: "p-algebra", name: "Algebra Foundations",
    description: "Core algebra skills for middle and high school students",
    targetLearner: "Middle or high school students",
    current_level: 2.1, target_level: 4.0, dimension_count: 5,
    domains: algebraDomains,
    focusSkills: [
      { id: "ac8", name: "Translating Word Problems", domain: "Mathematical Communication", current_level: 1.5, target_level: 4.0, progress: 38, status: "critical", trend: "declining" },
      { id: "ac10", name: "Equation Setup", domain: "Problem Decomposition", current_level: 1.6, target_level: 4.0, progress: 40, status: "critical", trend: "declining" },
      { id: "ac5", name: "Multi-Step Equations", domain: "Equation Solving", current_level: 1.4, target_level: 4.0, progress: 35, status: "critical", trend: "declining" },
    ],
    focusSessions: [
      { id: "word-problem-scenario", title: "Word Problem Reasoning Scenario", description: "Convert real-world situations into algebraic equations and solve them step by step.", relatedSkill: "Translating Word Problems" },
      { id: "linear-eq-challenge", title: "Linear Equation Challenge", description: "Practice isolating variables and checking your solutions systematically.", relatedSkill: "Solving Linear Equations" },
      { id: "pattern-puzzle", title: "Pattern Recognition Puzzle", description: "Find the rule behind number sequences and predict the next terms.", relatedSkill: "Recognizing Patterns in Sequences" },
    ],
    insightText: "Your <strong>Word Problem Translation</strong> is declining — practice converting scenarios into equations. <strong>Equation Setup</strong> also needs attention before moving to multi-step problems.",
  },
  {
    id: "p-calculus", name: "Calculus I Mastery",
    description: "Derivatives, integrals, and mathematical reasoning",
    targetLearner: "Undergraduate students",
    current_level: 1.8, target_level: 3.5, dimension_count: 5,
    domains: calculusDomains,
    focusSkills: [
      { id: "cc3", name: "Chain Rule Application", domain: "Derivative Application", current_level: 1.5, target_level: 4.0, progress: 38, status: "critical", trend: "declining" },
      { id: "cc4", name: "Optimization Problems", domain: "Derivative Application", current_level: 1.2, target_level: 4.0, progress: 30, status: "critical", trend: "declining" },
      { id: "cc11", name: "Related Rates", domain: "Problem Modeling", current_level: 1.3, target_level: 3.5, progress: 37, status: "critical", trend: "declining" },
    ],
    focusSessions: [
      { id: "chain-rule-scenario", title: "Chain Rule Scenario", description: "Work through composite function differentiation with guided reasoning steps.", relatedSkill: "Chain Rule Application" },
      { id: "optimization-challenge", title: "Optimization Challenge", description: "Apply derivatives to find optimal solutions in real-world contexts.", relatedSkill: "Optimization Problems" },
      { id: "derivative-interpretation", title: "Derivative Interpretation Exercise", description: "Read f'(x) graphs and reason about the behavior of the original function.", relatedSkill: "Interpreting Derivative Graphs" },
    ],
    insightText: "Your <strong>Chain Rule</strong> and <strong>Optimization</strong> skills are critical gaps — focus on derivative application scenarios. <strong>Related Rates</strong> needs structured practice.",
  },
  {
    id: "p-insurance", name: "Insurance Sales Mastery",
    description: "Sales effectiveness and compliance for insurance teams",
    targetLearner: "Corporate sales teams",
    current_level: 2.2, target_level: 4.0, dimension_count: 5,
    domains: insuranceSalesDomains,
    focusSkills: [
      { id: "ic7", name: "Handling Price Objections", domain: "Objection Handling", current_level: 1.4, target_level: 4.0, progress: 35, status: "critical", trend: "declining" },
      { id: "ic5", name: "Risk Communication", domain: "Value Framing", current_level: 1.6, target_level: 3.5, progress: 46, status: "attention", trend: "declining" },
      { id: "ic3", name: "Coverage Gap Identification", domain: "Customer Needs Analysis", current_level: 1.8, target_level: 3.5, progress: 51, status: "attention", trend: "declining" },
    ],
    focusSessions: [
      { id: "customer-objection-sim", title: "Customer Objection Simulation", description: "Practice handling common client pushback scenarios with empathy and evidence.", relatedSkill: "Handling Price Objections" },
      { id: "policy-recommendation", title: "Policy Recommendation Scenario", description: "Design coverage packages tailored to different client profiles.", relatedSkill: "Policy Structuring" },
      { id: "compliance-risk-scenario", title: "Compliance Risk Scenario", description: "Navigate ethically complex situations while maintaining regulatory compliance.", relatedSkill: "Regulatory Compliance" },
    ],
    insightText: "Your <strong>Handling Price Objections</strong> is a critical gap — practice reframing cost concerns. <strong>Risk Communication</strong> needs attention to effectively convey coverage value.",
  },
];

// ─── Helpers ───

export const GAP_THRESHOLD = 50;
export const CRITICAL_THRESHOLD = 40;

export function getDomainProgress(domain: Domain): number {
  const caps = domain.capabilities;
  if (caps.length === 0) return 0;
  return Math.round(caps.reduce((sum, c) => sum + (c.current_level / c.target_level) * 100, 0) / caps.length);
}

export function getDomainLevel(domain: Domain): number {
  const caps = domain.capabilities;
  if (caps.length === 0) return 0;
  return +(caps.reduce((s, c) => s + c.current_level, 0) / caps.length).toFixed(1);
}

export function getCapabilityProgress(cap: Capability): number {
  return Math.round((cap.current_level / cap.target_level) * 100);
}

export function getSkillStatus(progress: number, trend: Trend): SkillStatus {
  if (progress < CRITICAL_THRESHOLD) return "critical";
  if (progress < GAP_THRESHOLD) return "attention";
  if (trend === "improving" || progress >= 70) return "healthy";
  return "stable";
}

export function getStatusBadge(status: SkillStatus) {
  switch (status) {
    case "critical": return { label: "Critical Gap", cls: "bg-destructive/15 text-destructive border-destructive/20" };
    case "attention": return { label: "Needs Attention", cls: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20" };
    case "healthy": return { label: "Healthy", cls: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/20" };
    case "stable": return { label: "Stable", cls: "bg-muted text-muted-foreground border-border" };
  }
}

export function getIndicatorColor(status: SkillStatus): string {
  switch (status) {
    case "critical": return "bg-destructive";
    case "attention": return "bg-[hsl(var(--warning))]";
    case "healthy": return "bg-[hsl(var(--success))]";
    case "stable": return "bg-muted-foreground/30";
  }
}

// ─── Learner Profiles ───

export interface LearnerProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  enrolledProgramIds: string[];
}

export const learners: LearnerProfile[] = [
  { id: "l1", name: "Emma", role: "School Student", avatar: "E", enrolledProgramIds: ["p-algebra"] },
  { id: "l2", name: "Ravi", role: "College Student", avatar: "R", enrolledProgramIds: ["p-calculus"] },
  { id: "l3", name: "Maria", role: "Product Manager", avatar: "M", enrolledProgramIds: ["p1"] },
  { id: "l4", name: "David", role: "Sales Associate", avatar: "D", enrolledProgramIds: ["p-insurance"] },
];

export const defaultLearner = learners[2]; // Maria as default
