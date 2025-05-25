
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({ checked, onChange }) => {
  return (
    <div className="mt-6 flex items-start space-x-2">
      <Checkbox 
        id="terms" 
        checked={checked}
        onCheckedChange={(checked) => onChange(checked === true)}
      />
      <div className="grid gap-1.5 leading-none">
        <Label 
          htmlFor="terms" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Eu concordo com os termos e condições de uso do serviço
        </Label>
        <p className="text-sm text-muted-foreground">
          Ao se cadastrar, você concorda com nossa política de privacidade e termos de uso.
        </p>
      </div>
    </div>
  );
};

export default ConsentCheckbox;
