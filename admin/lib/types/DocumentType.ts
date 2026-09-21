export type DocumentType = {
  kind: string;
  name: string;
  description: string;
  summary: string;
  structureHints: string[];
  requiredFields: string[];
  validationRules: string[];
  validationNotes: string;
  sampleKeywords: string[];
};