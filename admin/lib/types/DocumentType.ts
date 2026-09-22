export type DocumentType = {
  id: string;
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