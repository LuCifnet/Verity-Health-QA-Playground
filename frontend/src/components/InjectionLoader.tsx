import React from 'react'

export interface InjectionLoaderProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export function InjectionLoader({ className = 'text-white', size = 'sm' }: InjectionLoaderProps) {
  const sizeClasses: Record<string, string> = {
    xs: 'h-3.5 w-3.5',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  const dimensionClass = sizeClasses[size] || 'h-4 w-4'

  return (
    <span
      data-testid="injection-loader"
      className={`inline-flex items-center justify-center ${dimensionClass} ${className} shrink-0`}
      aria-label="Loading"
      role="status"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full overflow-visible animate-syringe-pulse"
      >
        {/* Needle Shaft */}
        <path
          d="M17.5 6.5L21.5 2.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Needle Collar / Hub */}
        <path
          d="M15.5 5.5L18.5 8.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Main Syringe Barrel (Body) */}
        <rect
          x="7.5"
          y="7"
          width="5"
          height="10"
          rx="1"
          transform="rotate(-45 7.5 7)"
          stroke="currentColor"
          strokeWidth="1.75"
          fill="currentColor"
          fillOpacity="0.15"
        />

        {/* Measurement Tick Lines */}
        <path
          d="M12.5 9.5L14 11M10.5 11.5L12 13M8.5 13.5L10 15"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Dynamic Fluid inside Syringe */}
        <g className="animate-syringe-fluid">
          <rect
            x="8.5"
            y="7.8"
            width="3.2"
            height="7.5"
            rx="0.5"
            transform="rotate(-45 8.5 7.8)"
            fill="currentColor"
            fillOpacity="0.75"
          />
        </g>

        {/* Moving Plunger Stem and Thumb Push */}
        <g className="animate-syringe-plunger">
          {/* Plunger Shaft */}
          <path
            d="M8 16L4 20"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Thumb Rest Flange */}
          <path
            d="M2.5 18.5L5.5 21.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* Pulsing Droplet coming out of needle tip */}
        <circle
          cx="22.5"
          cy="1.5"
          r="1.25"
          fill="currentColor"
          className="animate-syringe-drip"
        />
      </svg>
    </span>
  )
}
