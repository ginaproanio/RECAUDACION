import React from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-xs font-bold uppercase text-slate-500">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2 rounded-sm border border-slate-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none text-sm bg-white",
          error && "border-red-600 bg-red-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
);
