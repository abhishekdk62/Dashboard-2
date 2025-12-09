import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger'|'ghost';
  loading?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";  

  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;  
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  className = '',
  type = 'button',
  disabled = false,    
}) => {
  const base = 'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl active:scale-95',
    secondary: 'bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-200 hover:border-blue-300 shadow-sm',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl active:scale-95',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-200',  // ← ADD THIS

  };

  const isDisabled = loading || disabled;  // ✅ Combine both states

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${base} ${variants[variant]} ${
        isDisabled ? 'opacity-75 cursor-not-allowed' : ''
      } ${className}`}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
