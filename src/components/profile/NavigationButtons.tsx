'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  canSubmit: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  canProceed,
  canSubmit,
  isSubmitting,
  onBack,
  onNext
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="flex gap-2">
        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="min-w-[200px]"
          >
            {isSubmitting ? 'Updating...' : 'Complete Profile'}
          </Button>
        )}
      </div>
    </div>
  );
}
