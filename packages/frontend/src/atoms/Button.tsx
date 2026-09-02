import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-serif font-bold tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-70';
  
  const variants = {
    primary: 'bg-stone-800 hover:bg-stone-700 text-white py-3.5 shadow-md',
    secondary: 'bg-stone-100 hover:bg-stone-200 text-stone-800 py-3.5 border border-stone-200',
    ghost: 'text-stone-500 hover:text-brand-500 py-2'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
