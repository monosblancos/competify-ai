import { useState } from 'react';
import { CandidateMatchingForm } from './CandidateMatchingForm';
import { CandidateResults } from './CandidateResults';
import type { MatchingResponse } from '@/services/candidateMatchingService';

export const CandidateMatchingDashboard = () => {
  const [results, setResults] = useState<MatchingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Encuentra Talento Certificado
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Conecta con profesionales certificados que cumplan exactamente con tus necesidades
          </p>
        </div>

        <CandidateMatchingForm 
          onResults={setResults} 
          onLoading={setLoading}
        />

        {(results || loading) && (
          <CandidateResults 
            results={results!} 
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};