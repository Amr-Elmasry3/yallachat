"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import MyForm from "../../common/MyForm";
import MyButton from "../../common/MyButton";
import MySpinner from "@/components/common/MySpinner";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// => My Custom Hooks
import { useRegister } from "@/hooks/auth/useRegister";

// => Libs & Utils
import { registerSchema } from "@/utils/validationSchemas";

// ***************** Types & Variables Imports *****************
// => Varaiables
import { registerFields } from "@/Data";

function RegisterForm() {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { isLoading, registerFetchFunc } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  // Functions
  async function onSubmit(values: z.infer<typeof registerSchema>) {
    await registerFetchFunc({
      url: "api/auth/register",
      values: {
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone,
      },
      redirectUrl: "/login",
      form,
    });
  }

  return (
    <div>
      <MyForm
        form={form}
        fields={registerFields}
        onSubmit={() => form.handleSubmit(onSubmit)()}
      >
        <div className="w-full mt-8">
          <MyButton
            type="submit"
            btnTitle="Register"
            style="one"
            isLoading={isLoading}
          >
            <MySpinner isLoading={isLoading} />
          </MyButton>
        </div>
      </MyForm>
    </div>
  );
}

export default RegisterForm;
