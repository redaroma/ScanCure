export enum SafetyRating {
  Safe = 'Safe',
  Caution = 'Caution',
  Unsafe = 'Unsafe',
  Unknown = 'Unknown'
}

export interface AlternativeProduct {
  productName: string;
  reason: string;
}

export interface IngredientSafety {
  name: string;
  safety: SafetyRating;
  explanation: string;
  alternatives?: AlternativeProduct[];
}

export interface AnalysisResult {
  overallSafety: SafetyRating;
  summary: string;
  ingredients: IngredientSafety[];
}

export enum AppState {
    SCAN,
    RESULTS,
    HISTORY
}

export interface Scan {
    id: number;
    image: string;
    result: AnalysisResult;
}