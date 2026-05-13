"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import { Textarea } from "@/components/shadcn/textarea";
import {
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormField,
} from "@/components/shadcn/form";

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
import { useUpdateInfo } from "@/hooks/user/useUpdateInfo";

// => Libs & Utils
import { updateInfoSchema } from "@/utils/validationSchemas";

// ***************** Types & Variables Imports *****************
// => Varaiables
import { updateInfoFields } from "@/Data";

function UpdateInfoForm() {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { isLoading, updateInfoFetchFunc } = useUpdateInfo();

  const form = useForm<z.infer<typeof updateInfoSchema>>({
    resolver: zodResolver(updateInfoSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      bio: "",
    },
  });

  // => Functions
  async function onSubmit(values: z.infer<typeof updateInfoSchema>) {
    await updateInfoFetchFunc({
      url: "api/user",
      values,
      form,
    });
  }

  return (
    <div>
      <MyForm
        form={form}
        fields={updateInfoFields}
        onSubmit={() => form.handleSubmit(onSubmit)()}
      >
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className="font-medium text-light-text mb-2"
                htmlFor="userBio"
              >
                Bio
              </FormLabel>

              <FormControl>
                <Textarea
                  id="userBio"
                  placeholder="Enter your bio..."
                  className="h-18 resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full mt-8">
          <MyButton
            type="submit"
            btnTitle="Update Info"
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

export default UpdateInfoForm;
