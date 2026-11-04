import type { ComponentProps, ElementType } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IconInputProps extends ComponentProps<"input"> {
  icon?: ElementType;
}

/** Kit Input with a trailing decorative icon. */
function IconInput({ icon: Icon, className, ...props }: IconInputProps) {
  return (
    <div className="relative flex items-center">
      <Input className={cn("h-11 pr-11", className)} {...props} />
      {Icon && <Icon aria-hidden className="pointer-events-none absolute right-4 text-sm text-muted-foreground" />}
    </div>
  );
}

export { IconInput };
