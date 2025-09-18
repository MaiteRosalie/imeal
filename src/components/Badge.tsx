import React, { ReactNode, ElementType } from "react";

type BadgeProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
};

export const Badge = <T extends ElementType = "div">({
  as,
  children,
  className = "",
}: BadgeProps<T>) => {
  const Component = as || "span";
  return (
    <Component
      className={`text-xs font-semibold px-3 py-1 rounded-full ${className}`}
    >
      {children}
    </Component>
  );
};
