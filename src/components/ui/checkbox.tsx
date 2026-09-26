import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckedState = boolean | "indeterminate";

export interface CheckboxProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "defaultChecked"
> {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledChecked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] =
      React.useState<CheckedState>(defaultChecked);

    const checked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      props.onClick?.(e);
      if (e.defaultPrevented) return;

      const nextChecked = checked === true ? false : true;
      if (!isControlled) {
        setUncontrolledChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
    };

    const stateStr =
      checked === "indeterminate"
        ? "indeterminate"
        : checked
          ? "checked"
          : "unchecked";

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked === "indeterminate" ? "mixed" : checked}
        data-state={stateStr}
        disabled={disabled}
        ref={ref}
        onClick={handleClick}
        className={cn(
          "peer relative grid size-4 shrink-0 place-content-center rounded-sm border border-primary shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "bg-primary text-primary-foreground"
            : "bg-background text-transparent hover:bg-muted/50",
          className,
        )}
        {...props}
      >
        {checked === "indeterminate" ? (
          <Minus className="size-3 text-current stroke-[3]" />
        ) : checked ? (
          <Check className="size-3 text-current stroke-[3]" />
        ) : null}
      </button>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
