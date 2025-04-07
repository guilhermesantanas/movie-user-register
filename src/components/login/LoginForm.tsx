
import React from 'react';
import { User, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { Checkbox } from '@/components/ui/checkbox';

interface LoginFormProps {
  identifier: string;
  setIdentifier: (identifier: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (checked: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm = ({
  identifier,
  setIdentifier,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  isSubmitting,
  onSubmit
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <InputField
        label="Email ou Nome de Usuário"
        id="identifier"
        name="identifier"
        type="text"
        placeholder="Digite seu email ou nome de usuário"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
        icon={<User size={18} />}
      />
      
      <InputField
        label="Senha"
        id="password"
        name="password"
        type="password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        icon={<Lock size={18} />}
      />
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="rememberMe" 
          checked={rememberMe} 
          onCheckedChange={(checked) => setRememberMe(checked === true)}
        />
        <label 
          htmlFor="rememberMe" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Manter-me conectado
        </label>
      </div>
      
      <div className="mt-6">
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
          icon={<LogIn size={18} />}
        >
          Entrar
        </Button>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          Não tem uma conta? <a href="/register-user" className="text-primary hover:underline">Registre-se aqui</a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
