
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Calendar, Clock, Tag, Users, ArrowLeft, Info, Star, Globe, User } from 'lucide-react';
import { toast } from 'sonner';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import SelectField from '@/components/SelectField';
import Button from '@/components/Button';

const MovieRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredBy, setRegisteredBy] = useState('');
  
  useEffect(() => {
    // Get the username from localStorage
    const username = localStorage.getItem('username');
    if (username) {
      setRegisteredBy(username);
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const movieData = {
      title: formData.get('title'),
      releaseDate: formData.get('releaseDate'),
      duration: formData.get('duration'),
      genre: formData.get('genre'),
      rating: formData.get('rating'),
      director: formData.get('director'),
      imdbRating: formData.get('imdbRating'),
      synopsis: formData.get('synopsis'),
      language: formData.get('language'),
      posterUrl: formData.get('posterUrl'),
      registeredBy
    };
    
    // Simulate form submission - in a real app, you'd save to a database
    setTimeout(() => {
      // Save to localStorage for demo purposes
      const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
      savedMovies.push(movieData);
      localStorage.setItem('movies', JSON.stringify(savedMovies));
      
      setIsSubmitting(false);
      toast.success('Movie registered successfully!');
      navigate('/movies');
    }, 1500);
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-6">
        <div className="w-full max-w-md mx-auto">
          <Button 
            variant="outline" 
            className="mb-6" 
            onClick={() => navigate('/')}
            icon={<ArrowLeft size={16} />}
          >
            Back to Home
          </Button>
          
          <AppHeader 
            title="Movie Registration" 
            subtitle="Add a new movie to the database"
          />
          
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <InputField
                label="Movie Title"
                id="title"
                name="title"
                placeholder="Enter the movie title"
                required
                icon={<Film size={18} />}
              />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Release Date"
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  required
                  icon={<Calendar size={18} />}
                />
                
                <InputField
                  label="Duration (minutes)"
                  id="duration"
                  name="duration"
                  type="number"
                  placeholder="120"
                  required
                  icon={<Clock size={18} />}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectField
                  label="Genre"
                  id="genre"
                  name="genre"
                  options={[
                    { value: "action", label: "Action" },
                    { value: "comedy", label: "Comedy" },
                    { value: "drama", label: "Drama" },
                    { value: "horror", label: "Horror" },
                    { value: "sci-fi", label: "Science Fiction" },
                    { value: "fantasy", label: "Fantasy" },
                    { value: "thriller", label: "Thriller" },
                    { value: "romance", label: "Romance" },
                    { value: "documentary", label: "Documentary" }
                  ]}
                  required
                  icon={<Tag size={18} />}
                />
                
                <SelectField
                  label="Rating"
                  id="rating"
                  name="rating"
                  options={[
                    { value: "G", label: "G - General Audiences" },
                    { value: "PG", label: "PG - Parental Guidance Suggested" },
                    { value: "PG-13", label: "PG-13 - Parents Strongly Cautioned" },
                    { value: "R", label: "R - Restricted" },
                    { value: "NC-17", label: "NC-17 - Adults Only" }
                  ]}
                  required
                  icon={<Users size={18} />}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Director"
                  id="director"
                  name="director"
                  placeholder="Enter director's name"
                  required
                  icon={<Users size={18} />}
                />
                
                <InputField
                  label="IMDB Rating"
                  id="imdbRating"
                  name="imdbRating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="7.5"
                  icon={<Star size={18} />}
                />
              </div>
              
              <TextareaField
                label="Synopsis"
                id="synopsis"
                name="synopsis"
                placeholder="Enter a brief description of the movie"
                required
                className="min-h-[120px]"
              />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Language"
                  id="language"
                  name="language"
                  placeholder="Enter movie language"
                  icon={<Globe size={18} />}
                />
                
                <InputField
                  label="Poster URL"
                  id="posterUrl"
                  name="posterUrl"
                  type="url"
                  placeholder="https://example.com/poster.jpg"
                  icon={<Info size={18} />}
                />
              </div>
              
              <InputField
                label="Registered By"
                id="registeredBy"
                name="registeredBy"
                value={registeredBy}
                readOnly
                className="bg-gray-50"
                icon={<User size={18} />}
              />
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  isLoading={isSubmitting}
                >
                  Register Movie
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MovieRegistration;
