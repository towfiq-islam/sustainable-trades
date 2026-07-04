import React from "react";
import { cn } from "@/lib/utils";

type ParagraphProps = {
  text: string;
  className?: string;
};

const Paragraph = ({
  text,
  className,
  ...props
}: ParagraphProps) => {
  return (
    <p
      className={cn("default-design", className)}
      {...props}
    >
      {text}
    </p>
  );
};

export default Paragraph;
