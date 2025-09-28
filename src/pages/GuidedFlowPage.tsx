import React from 'react';
import GuidedCareerFlow from '@/components/GuidedCareerFlow';
import { useNavigate } from 'react-router-dom';

const GuidedFlowPage: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return <GuidedCareerFlow onComplete={handleComplete} />;
};

export default GuidedFlowPage;