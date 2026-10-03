import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = {
  label: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ label, children, ...props }: IconButtonProps) {
  return (
    <button className="icon-button" aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}
