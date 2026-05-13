// ************************ Ui Imports *************************
// => Ready To Use Components
import { FormControl, FormLabel } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface InputWithLabelProps {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  field: React.InputHTMLAttributes<HTMLInputElement>;
}

function InputWithLabel({
  label,
  type,
  name,
  placeholder,
  field,
}: InputWithLabelProps) {
  return (
    <div className="input-with-Label">
      <FormLabel
        className="font-medium text-light-text dark:text-dark-text mb-2"
        htmlFor={field.name}
      >
        {label}
      </FormLabel>

      <FormControl>
        <Input
          id={field.name}
          type={type}
          name={name}
          placeholder={placeholder}
          {...field}
        />
      </FormControl>
    </div>
  );
}

export default InputWithLabel;
