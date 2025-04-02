
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieHeaderProps {
  title: string;
}

const MovieHeader = ({ title }: MovieHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <Button 
        variant="ghost" 
        onClick={() => navigate('/movies')} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Movies
      </Button>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
    </>
  );
};

export default MovieHeader;
