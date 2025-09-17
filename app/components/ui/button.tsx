import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gradient';
  size?: 'sm' | 'default' | 'lg' | 'xl';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group active:scale-95";
    
    const variantStyles = {
      primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl border border-primary-700/20 focus:ring-primary-500",
      secondary: "bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 focus:ring-gray-500",
      danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl border border-red-600/20 focus:ring-red-500",
      ghost: "hover:bg-gray-100 text-gray-600 hover:text-gray-800 border border-transparent hover:border-gray-200 focus:ring-gray-500",
      gradient: "bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl border-0 focus:ring-primary-500"
    };

    const sizeStyles = {
      sm: "h-9 px-4 text-sm rounded-lg",
      default: "h-11 px-6 text-sm rounded-xl",
      lg: "h-12 px-8 text-base rounded-xl",
      xl: "h-16 px-10 text-lg rounded-2xl",
    };

    return (
      <button
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };