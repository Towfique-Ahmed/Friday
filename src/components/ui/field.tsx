import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold text-ink-600">
      {children}
    </label>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClasses, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClasses, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={cn(fieldClasses, className)} {...props}>
      {children}
    </select>
  );
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}
