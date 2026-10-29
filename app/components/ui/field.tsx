import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
>(({ className, hasError, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={hasError || undefined}
    className={cn(
      "border-blush bg-paper text-prune placeholder:text-prune/40 h-14 w-full rounded-full border-2 px-5 text-[16px] font-semibold transition-colors outline-none placeholder:font-medium",
      "focus:border-orange",
      hasError && "border-framboise",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }
>(({ className, hasError, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={hasError || undefined}
    className={cn(
      "border-blush bg-paper text-prune placeholder:text-prune/40 focus:border-orange min-h-28 w-full resize-y rounded-[1.75rem] border-2 px-5 py-4 text-[16px] font-medium transition-colors outline-none",
      hasError && "border-framboise",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-prune text-[15px] font-extrabold", className)} {...props}>
      {children}
    </label>
  );
}

export function FieldError({ id, children }: { id?: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-framboise-dark mt-2 pl-2 text-sm font-bold">
      {children}
    </p>
  );
}

export function Checkbox({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "border-prune bg-paper checked:border-orange checked:bg-orange size-5 shrink-0 cursor-pointer appearance-none rounded-md border-2 transition-colors",
        "checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M20 6 9 17l-5-5%22/></svg>')] checked:bg-center checked:bg-no-repeat",
        className,
      )}
      {...props}
    />
  );
}
