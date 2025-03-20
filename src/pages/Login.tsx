
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

// Admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple login validation
    setTimeout(() => {
      // First check if it's the admin
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Store login state in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userType', 'admin');
        
        toast.success('Login successful as Admin!');
        navigate('/movies');
        setIsSubmitting(false);
        return;
      }
      
      // If not admin, check registered users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        (u.name === username || u.email === username) && u.password === password
      );
      
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user.name);
        localStorage.setItem('userType', user.userType);
        
        toast.success('Login successful!');
        navigate('/movies');
      } else {
        toast.error('Invalid credentials');
      }
      
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
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
            subtitle="login"
          />
          
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <InputField
                label="Username or Email"
                id="username"
                name="username"
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                icon={<User size={18} />}
              />
              
              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock size={18} />}
              />
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  isLoading={isSubmitting}
                  icon={<LogIn size={18} />}
                >
                  Login
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account? <a href="/register-user" className="text-primary hover:underline">Register here</a>
                </p>
                
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Admin credentials: admin / admin123
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
