import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-extrabold whitespace-nowrap transition-all duration-200 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-orange text-prune hover:bg-sun hover:-translate-y-0.5 shadow-[0_2px_0_rgba(74,15,46,0.08)]",
        raspberry: "bg-framboise text-white hover:bg-framboise-deep hover:-translate-y-0.5",
        prune: "bg-prune text-cream hover:bg-framboise-deep hover:-translate-y-0.5",
        butter: "bg-butter text-prune hover:bg-sun hover:-translate-y-0.5",
        outline: "border-2 border-prune bg-transparent text-prune hover:bg-prune hover:text-cream",
        outlineLight:
          "border-2 border-cream/80 bg-transparent text-cream hover:bg-cream hover:text-framboise-dark",
        ghost: "bg-transparent text-prune hover:bg-blush/70",
        link: "bg-transparent text-prune underline decoration-2 underline-offset-4 hover:text-framboise-dark p-0 h-auto",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";
