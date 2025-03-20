
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Calendar, MapPin, ArrowLeft, UserCheck, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import SelectField from '@/components/SelectField';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      dob: formData.get('dob'),
      userType: formData.get('userType'),
      city: formData.get('city'),
      country: formData.get('country')
    };
    
    // Simulate form submission - in a real app, you'd save to a database
    setTimeout(() => {
      // Save to localStorage for demo purposes
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      savedUsers.push(userData);
      localStorage.setItem('users', JSON.stringify(savedUsers));
      
      setIsSubmitting(false);
      toast.success('User registered successfully!');
      
      // Automatically log in the new user
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', userData.name as string);
      
      navigate('/');
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
            title="Cinema Management" 
            subtitle="register account"
          />
          
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Full Name"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  icon={<User size={18} />}
                />
                
                <InputField
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  icon={<Mail size={18} />}
                />
                
                <InputField
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  icon={<Smartphone size={18} />}
                />
                
                <InputField
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  required
                  icon={<Lock size={18} />}
                />
                
                <InputField
                  label="Date of Birth"
                  id="dob"
                  name="dob"
                  type="date"
                  icon={<Calendar size={18} />}
                />
                
                <SelectField
                  label="User Type"
                  id="userType"
                  name="userType"
                  options={[
                    { value: "customer", label: "Customer" },
                    { value: "admin", label: "Administrator" },
                    { value: "staff", label: "Staff Member" }
                  ]}
                  required
                  icon={<UserCheck size={18} />}
                />
                
                <InputField
                  label="City"
                  id="city"
                  name="city"
                  placeholder="Enter your city"
                  icon={<MapPin size={18} />}
                />
                
                <SelectField
                  label="Country"
                  id="country"
                  name="country"
                  options={[
                    { value: "us", label: "United States" },
                    { value: "ca", label: "Canada" },
                    { value: "mx", label: "Mexico" },
                    { value: "br", label: "Brazil" },
                    { value: "fr", label: "France" },
                    { value: "uk", label: "United Kingdom" },
                    { value: "de", label: "Germany" },
                    { value: "jp", label: "Japan" },
                    { value: "au", label: "Australia" }
                  ]}
                  icon={<MapPin size={18} />}
                />
              </div>
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  isLoading={isSubmitting}
                >
                  Register User
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserRegistration;
