import { ButtonHTMLAttributes, InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-3 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-color-4 text-color-8 hover:bg-color-5 active:bg-color-1 shadow-md hover:shadow-sm',
      secondary: 'bg-color-3 text-color-8 hover:bg-color-1 active:bg-color-1',
      outline: 'border-2 border-color-4 text-color-4 hover:bg-color-4 hover:text-color-8 active:bg-color-1 active:text-color-8',
      ghost: 'text-color-2 hover:bg-color-6 hover:text-color-1 active:bg-color-6',
      danger: 'bg-red-600 text-color-8 hover:bg-red-700 active:bg-red-800',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs gap-2',
      md: 'px-6 py-3 text-sm gap-2',
      lg: 'px-8 py-4 text-base gap-3',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-color-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 text-sm bg-color-8 border-2 rounded-sm transition-all duration-150 text-color-1 placeholder:text-color-2/50 focus:border-color-3 focus:ring-2 focus:ring-color-3/20 ${error ? 'border-color-4' : 'border-color-6'} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && <p id={`${inputId}-error`} className="text-xs text-color-4" role="alert">{error}</p>}
        {helperText && !error && <p id={`${inputId}-helper`} className="text-xs text-color-2">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-color-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 text-sm bg-color-8 border-2 rounded-sm transition-all duration-150 text-color-1 placeholder:text-color-2/50 focus:border-color-3 focus:ring-2 focus:ring-color-3/20 resize-y min-h-[100px] ${error ? 'border-color-4' : 'border-color-6'} ${className}`}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-xs text-color-4" role="alert">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Badge Component
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-color-6 text-color-1',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Card Component
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      className={`bg-color-8 rounded-sm border border-color-6 shadow-md ${hover ? 'hover:shadow-sm hover:-translate-y-1 cursor-pointer' : ''} transition-all duration-300 ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-color-1/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-color-8 rounded-sm shadow-sm p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-xl font-bold text-color-1">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-color-6 transition-colors duration-150 text-color-2"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({ label, options, error, className = '', id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-color-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-4 py-3 text-sm bg-color-8 border-2 rounded-sm transition-all duration-150 text-color-1 focus:border-color-3 focus:ring-2 focus:ring-color-3/20 appearance-none ${error ? 'border-color-4' : 'border-color-6'} ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-color-4" role="alert">{error}</p>}
    </div>
  );
}
