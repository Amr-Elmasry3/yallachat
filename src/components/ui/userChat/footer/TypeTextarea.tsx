"use client";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { cn } from "@/lib/utils";

// => Libraries
import TextareaAutosize from "react-textarea-autosize";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface TypeTextareaProps {
  value: string;
  handleOnChange: (value: string) => void;
}

function TypeTextarea({ value, handleOnChange }: TypeTextareaProps) {
  return (
    <TextareaAutosize
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      )}
      placeholder="Type your message..."
      value={value}
      minRows={1}
      maxRows={4}
      onChange={(eve) => {
        handleOnChange(eve.target.value);
      }}
    />
  );
}

export default TypeTextarea;
