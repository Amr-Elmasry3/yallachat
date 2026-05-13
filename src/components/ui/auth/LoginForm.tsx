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
import { useLogin } from "@/hooks/auth/useLogin";

// => Libs & Utils
import { loginSchema } from "@/utils/validationSchemas";

// ***************** Types & Variables Imports *****************
// => Varaiables
import { loginFields } from "@/Data";

function LoginForm() {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { isLoading, loginFetchFunc } = useLogin();

  // [1] Define My Form.
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Functions
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await loginFetchFunc({
      url: "api/auth/login",
      values: values,
      redirectUrl: "/dashboard/chats",
      form,
    });
  }

  return (
    <div>
      <MyForm
        form={form}
        fields={loginFields}
        onSubmit={() => form.handleSubmit(onSubmit)()}
      >
        <div className="w-full mt-8">
          <MyButton
            type="submit"
            btnTitle="Login"
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

export default LoginForm;
