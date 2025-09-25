export interface MatchingCriteria {
  requiredStandards?: string[];
  location?: string;
  experience?: string[];
  educationLevel?: string;
  objectives?: string;
  availableForRemote?: boolean;
  salaryRange?: {
    min: number;
    max: number;
  };
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  educationLevel: string;
  objectives: string;
  experiences: any[];
  certifications: string[];
  completionRate: number;
  matchScore: number;
  matchReasons: string[];
}

export interface MatchingResponse {
  candidates: CandidateProfile[];
  totalMatches: number;
  searchCriteria: MatchingCriteria;
}

export interface CompanySearchRequest {
  companyName?: string;
  contactEmail?: string;
  position?: string;
  criteria: MatchingCriteria;
  urgent?: boolean;
  notes?: string;
}