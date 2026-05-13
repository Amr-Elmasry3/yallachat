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
import { useChangePassword } from "@/hooks/auth/useChangePassword";

// => Libs & Utils
import { changePasswordSchema } from "@/utils/validationSchemas";

// ***************** Types & Variables Imports *****************
// => Varaiables
import { changePasswordFields } from "@/Data";

function ChangePasswordForm() {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { isLoading, changePasswordFetchFunc } = useChangePassword();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Functions
  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    await changePasswordFetchFunc({
      url: "api/auth/change-password",
      values: values,
      form,
    });
  }

  return (
    <div>
      <MyForm
        form={form}
        fields={changePasswordFields}
        onSubmit={() => form.handleSubmit(onSubmit)()}
      >
        <div className="w-full mt-8">
          <MyButton
            type="submit"
            btnTitle="Change Password"
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

export default ChangePasswordForm;
