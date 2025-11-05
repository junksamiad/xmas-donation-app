"use client";
import React from "react";

import { cn } from "@/lib/utils";

export interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
  onClick?: () => void;
  style?: React.CSSProperties;
  title?: string;
}

export function Button({
  children,
  duration = 3000,
  rx = "50px",
  ry: _ry = "50px",
  className,
  containerClassName,
  borderClassName: _borderClassName,
  as: Component = "button",
  onClick,
  style,
  title,
  ...otherProps
}: MovingBorderProps) {
  return (
    <Component
      className={cn(
        "bg-transparent relative p-[3px] overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 group",
        containerClassName
      )}
      style={style}
      onClick={onClick}
      title={title}
      {...otherProps}
    >
      {/* Main button content */}
      <div
        className={cn(
          "relative flex items-center justify-center w-full h-full text-white font-black antialiased overflow-hidden",
          className
        )}
        style={{
          borderRadius: rx,
          background: 'linear-gradient(135deg, #1e7e34 0%, #28a745 25%, #20c997 50%, #28a745 75%, #1e7e34 100%)',
          border: '2px solid #ffc107',
          padding: '20px 40px',
          minWidth: '320px',
          fontSize: '24px',
          fontWeight: '900',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          backgroundSize: '200% 100%',
        }}
      >
        {children}

        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
            animation: 'shimmerSlide 3s ease-in-out infinite',
            transform: 'translateX(-100%)'
          }}
        />
      </div>

      {/* Subtle moving border effect */}
      <div
        className="absolute inset-0 p-[1px] pointer-events-none"
        style={{
          borderRadius: rx,
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255, 215, 0, 0.4) 90deg, rgba(255, 236, 139, 0.6) 180deg, rgba(255, 193, 7, 0.4) 270deg, transparent 360deg)`,
          animation: `movingBorder ${duration}ms linear infinite`,
        }}
      >
        <div
          className="w-full h-full bg-transparent"
          style={{
            borderRadius: `calc(${rx} - 1px)`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes movingBorder {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }


        @keyframes shimmerSlide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        /* Simple hover effects */
        :global(.group:hover) > div:first-child {
          box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important;
          filter: brightness(1.05);
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          :global(.group) > div:first-child {
            min-width: 280px !important;
            font-size: 20px !important;
            padding: 16px 32px !important;
          }
        }

        @media (max-width: 480px) {
          :global(.group) > div:first-child {
            min-width: 260px !important;
            font-size: 18px !important;
            padding: 14px 28px !important;
          }
        }
      `}</style>
    </Component>
  );
}

export default Button;