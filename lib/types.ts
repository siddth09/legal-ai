// Shared TypeScript interfaces used by API routes and client components.
// Eliminates all `as any` casts across the codebase.

export interface Party {
  name: string;
  role: string;
}

export interface KeyDate {
  label: string;
  date: string;
}

export type RiskLevel = "high" | "medium" | "low" | "neutral";
export type Significance = "high" | "medium" | "low";
export type ChangeType = "added" | "removed" | "modified";
export type OverallRisk = "higher" | "lower" | "similar";
export type Confidence = "high" | "medium" | "low";
export type FavoredParty = "A" | "B" | "neutral";

export interface Clause {
  title: string;
  plainEnglish: string;
  originalText: string;
  risk: RiskLevel;
  riskExplanation: string;
}

export interface Obligations {
  party1: string[];
  party2: string[];
}

export interface AnalysisData {
  documentType: string;
  summary: string;
  parties: Party[];
  keyDates: KeyDate[];
  clauses: Clause[];
  obligations: Obligations;
  redFlags: string[];
  lawyerQuestions: string[];
  checklist: string[];
}

export interface Change {
  type: ChangeType;
  section: string;
  documentA: string | null;
  documentB: string | null;
  plainEnglish: string;
  significance: Significance;
  favoredParty: FavoredParty;
}

export interface ComparisonData {
  summary: string;
  overallRisk: OverallRisk;
  overallRiskExplanation: string;
  changes: Change[];
  recommendations: string[];
}

export interface QAAnswer {
  answer: string;
  relevantText: string | null;
  confidence: Confidence;
  disclaimer: string;
  followUpQuestions: string[];
}

export interface AnalyzeApiResponse {
  success: true;
  analysis: AnalysisData;
  documentText: string;
}

export interface CompareApiResponse {
  success: true;
  comparison: ComparisonData;
}

export interface QAApiResponse {
  success: true;
  answer: QAAnswer;
}

export interface ApiError {
  error: string;
}
