import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SectionReadIndicator = ({ isVisible = false, className = '' }) => {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <CheckCircle2 
        className={`h-4 w-4 ml-2 transition-colors duration-300 ${
          isVisible ? 'text-green-400' : 'text-gray-500/50'
        }`}
      />
    </span>
  );
};

export default SectionReadIndicator;
