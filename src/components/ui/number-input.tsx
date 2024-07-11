import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isPending?: boolean;
}

const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "number", ...props }, ref) => {
    const [value, setValue] = React.useState<number>(
      props.value ? Number(props.value) : 1,
    );

    const handleIncrement = () => {
      setValue((prevValue) => {
        const newValue = prevValue + 1;
        triggerChange(newValue);
        return newValue;
      });
    };

    const handleDecrement = () => {
      setValue((prevValue) => {
        const newValue = prevValue > 1 ? prevValue - 1 : 1;
        triggerChange(newValue);
        return newValue;
      });
    };

    const triggerChange = (newValue: number) => {
      if (props?.onChange) {
        const syntheticEvent = {
          target: { value: newValue.toString() },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }
    };

    return (
      <div className="flex h-9 items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
        <input
          type={type}
          className={cn(
            "hide-input-spinner flex w-full flex-1 border-none bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          value={value.toString()}
          min={1}
          ref={ref}
          readOnly
          {...props}
        />
        <Button
          variant="ghost"
          size="icon"
          type="button"
          disabled={props.disabled === true}
          onClick={handleIncrement}
        >
          <Plus className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          disabled={value === 1 || props.disabled === true}
          onClick={handleDecrement}
        >
          <Minus className="size-4" />
        </Button>
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
