import type { ComponentPropsWithoutRef } from "react";

export function GlassPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={["glass-panel", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
