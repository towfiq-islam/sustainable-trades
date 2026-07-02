import React from "react";
import { cn } from "@/lib/utils";

type HeadingProps = {
  text: string;
  className?: string;
  Variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

const Heading: React.FC<HeadingProps> = ({
  text,
  className,
  Variant = "h3",
  ...props
}) => {
  const Tag = Variant;
  return (
    <Tag
      className={cn("text-black text-2xl font-bold", className)}
      {...props}
    >
      {text}
    </Tag>
  );
};

export default Heading;
