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
import { useAddFriend } from "@/hooks/friends/useAddFriend";

// => Libs & Utils
import { addFriendsSchema } from "@/utils/validationSchemas";

// ***************** Types & Variables Imports *****************
// => Varaiables
import { addfriendsFields } from "@/Data";

function AddFriendsForm() {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { isLoading, addFriendFetchFunc } = useAddFriend();

  const form = useForm<z.infer<typeof addFriendsSchema>>({
    resolver: zodResolver(addFriendsSchema),
    defaultValues: {
      friendName: "",
      friendPhone: "",
    },
  });

  // => Functions
  async function onSubmit(values: z.infer<typeof addFriendsSchema>) {
    await addFriendFetchFunc({
      url: "api/friends",
      values,
      form,
    });
  }

  return (
    <div>
      <MyForm
        form={form}
        fields={addfriendsFields}
        onSubmit={() => form.handleSubmit(onSubmit)()}
      >
        <div className="w-full mt-8">
          <MyButton
            type="submit"
            btnTitle="Add Friend"
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

export default AddFriendsForm;
