import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SectionReadIndicator = ({ isVisible = false }) => {
  return (
    <span className="inline-flex items-center">
      <CheckCircle2 className="h-4 w-4 text-gray-500/50 ml-2" />
    </span>
  );
};

export default SectionReadIndicator;
