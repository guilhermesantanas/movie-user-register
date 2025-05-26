
import React from 'react';
import Button from '@/components/Button';
import ConsentCheckbox from '@/components/registration/ConsentCheckbox';

interface SubmitSectionProps {
  userConsent: boolean;
  onConsentChange: (checked: boolean) => void;
  isSubmitting: boolean;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({ 
  userConsent, 
  onConsentChange, 
  isSubmitting 
}) => {
  return (
    <>
      <ConsentCheckbox
        checked={userConsent}
        onChange={onConsentChange}
      />
      
      <div className="mt-6">
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
        >
          Register User
        </Button>
      </div>
    </>
  );
};

export default SubmitSection;
