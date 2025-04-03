
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieHeaderProps {
  title: string;
  subtitle?: string;
  backButtonText?: string;
  backTo?: string;
}

const MovieHeader = ({ 
  title, 
  subtitle, 
  backButtonText = "Back to Movies", 
  backTo = '/movies' 
}: MovieHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-2 mb-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(backTo)} 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> {backButtonText}
      </Button>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default MovieHeader;
