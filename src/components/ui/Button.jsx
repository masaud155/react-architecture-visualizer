import { cloneElement, isValidElement } from 'react';
import { cn } from './utils.js';

export function Button({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }) {
  const variants = {
    primary: 'border border-primary/40 bg-primary text-primary-foreground shadow-[0_10px_28px_rgb(20_184_166/.18)] hover:bg-primary/90',
    secondary: 'border border-white/10 bg-white/[0.065] text-slate-200 shadow-[inset_0_1px_0_rgb(255_255_255/.06)] hover:border-white/[0.18] hover:bg-white/[0.105]',
    ghost: 'text-muted-foreground hover:bg-white/[0.08] hover:text-foreground',
    danger: 'border border-danger/30 bg-danger/[0.15] text-rose-200 hover:bg-danger/[0.22]',
  };
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    icon: 'h-9 w-9 p-0',
  };

  const buttonClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-50',
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
    <button type="button" className={buttonClassName} {...props}>
      {children}
    </button>
  );
}
