import React, { ReactNode, ElementType } from "react";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
};

export const Container = <T extends ElementType = "div">({
  as,
  children,
  className = "",
}: ContainerProps<T>) => {
  const Component = as || "div";
  return (
    <Component className={`w-full max-w-[1248px] p-4 mx-auto ${className}`}>
      {children}
    </Component>
  );
};
