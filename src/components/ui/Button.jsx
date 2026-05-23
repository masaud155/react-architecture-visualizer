import { cloneElement, isValidElement } from 'react';
import { cn } from './utils.js';

export function Button({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow',
    secondary: 'bg-white/[0.08] text-foreground hover:bg-white/[0.12] border border-white/10',
    ghost: 'hover:bg-white/[0.08] text-muted-foreground hover:text-foreground',
    danger: 'bg-danger/[0.15] text-rose-200 hover:bg-danger/[0.22] border border-danger/30',
  };
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    icon: 'h-9 w-9 p-0',
  };

  const buttonClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: cn(buttonClassName, children.props.className),
      ...props,
    });
  }

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
}
