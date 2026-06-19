"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref" | "children"> {
  href?: undefined;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
}

type AnimatedButtonProps = ButtonAsButton | ButtonAsLink;

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-tight transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "text-white shadow-[0_10px_40px_-8px_rgba(124,58,237,0.7)] hover:shadow-[0_14px_50px_-6px_rgba(124,58,237,0.85)]",
  secondary: "text-white/90 glass border border-white/12 hover:border-white/25",
  ghost: "text-white/70 hover:text-white",
};

export default function AnimatedButton(props: AnimatedButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    href,
    className = "",
  } = props;

  const ref = useRef<HTMLElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Pointer-tracking glow for the primary button.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radial = useMotionTemplate`radial-gradient(120px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.28), transparent 70%)`;

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 0.9;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y, size }]);
    window.setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    if (href === undefined) {
      (props as ButtonAsButton).onClick?.(
        e as React.MouseEvent<HTMLButtonElement>,
      );
    }
  };

  const motionProps = {
    onMouseMove: handleMove,
    onClick: handleClick,
    whileHover: { scale: 1.035 },
    whileTap: { scale: 0.965 },
    transition: { type: "spring" as const, stiffness: 400, damping: 22 },
    className: `${base} ${sizes[size]} ${variants[variant]} ${className}`,
  };

  const inner = (
    <>
      {variant === "primary" && (
        <>
          <span className="absolute inset-0 bg-[linear-gradient(110deg,#7c3aed,#6d28d9_35%,#4f46e5_60%,#0ea5e9)] bg-[length:200%_auto] transition-[background-position] duration-700 group-hover:bg-[position:100%_0]" />
          <motion.span
            style={{ background: radial }}
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
        </>
      )}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ opacity: 0.45, scale: 0 }}
          animate={{ opacity: 0, scale: 2.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          className="pointer-events-none absolute rounded-full bg-white/40"
        />
      ))}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </>
  );

  if (href !== undefined) {
    const { target, rel } = props as ButtonAsLink;
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }

  const {
    type = "button",
    disabled,
    onClick: _onClick,
    ...rest
  } = props as ButtonAsButton;
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      {...motionProps}
      {...(rest as Record<string, unknown>)}
    >
      {inner}
    </motion.button>
  );
}
