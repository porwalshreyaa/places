import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export function Input({ label, error, icon, rightElement, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-sans font-bold tracking-wider text-stone-500 uppercase mb-2">
          {label}
        </label>
      )}
      <div className="relative rounded-lg">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-10' : 'px-4'} ${rightElement ? 'pr-10' : 'pr-4'} py-3 bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:bg-white focus:ring-1 focus:ring-stone-800 focus:border-stone-800 outline-none transition-all font-sans text-sm ${
            error ? 'border-rose-500 ring-1 ring-rose-500' : ''
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}
