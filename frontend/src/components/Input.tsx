import React from 'react';

interface InputProps {
  label: string;
  name?: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  type?: string;
  as?: 'input' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  showPassword?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;  // ✅ Add this

  onPasswordToggle?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  as = 'input',
  options,
  placeholder,
  onBlur,
  className,
  disabled,
  showPassword,
  onPasswordToggle,
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {as === 'input' ? (
      <div className="relative">
        <input
          name={name}
          type={showPassword && type === 'password' ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onBlur={onBlur}  // ✅ Pass to native input

          disabled={disabled}
          className={`w-full pr-12 pl-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 ${
            error 
              ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100' 
              : 'border-gray-200 hover:border-gray-300 bg-white'
          } ${className || ''}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={onPasswordToggle}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            )}
          </button>
        )}
      </div>
    ) : (
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 ${
          error 
            ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        } ${className || ''}`}
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default Input;
