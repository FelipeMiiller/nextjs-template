import * as React from 'react';

export function ReactLogo({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      data-testid="react-logo-svg"
      className={`animate-spin-slow-5s ${className}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="8" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="3" fill="none">
        <ellipse rx="24" ry="10" cx="32" cy="32" />
        <ellipse rx="24" ry="10" cx="32" cy="32" transform="rotate(60 32 32)" />
        <ellipse rx="24" ry="10" cx="32" cy="32" transform="rotate(120 32 32)" />
      </g>
    </svg>
  );
}
