"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn/form";

// => My Custom Components
import InputWithLabel from "./InputWithLabel";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface FormField<T extends FieldValues> {
  id: number;
  name: Path<T>;
  label: string;
  type: string;
  placeholder: string;
}
interface MyFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fields: FormField<T>[];
  onSubmit: () => void;
  children: React.ReactNode;
}

function MyForm<T extends FieldValues>({
  form,
  fields,
  onSubmit,
  children,
}: MyFormProps<T>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((item) => {
          return (
            <FormField
              key={item.id}
              control={form.control}
              name={item.name}
              render={({ field }) => (
                <FormItem>
                  <InputWithLabel
                    label={item.label}
                    type={item.type}
                    name={item.name}
                    placeholder={item.placeholder}
                    field={field}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        {/* Buttons And Links Or Other Inputs */}
        {children}
      </form>
    </Form>
  );
}

export default MyForm;
