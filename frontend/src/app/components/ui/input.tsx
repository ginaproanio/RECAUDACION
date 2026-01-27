import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-xs font-bold uppercase text-slate-500">{label}</label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-3 py-2 rounded-sm border border-slate-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none text-sm transition-all",
          error && "border-red-600 bg-red-50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';

export { Input };
