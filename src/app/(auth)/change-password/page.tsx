// ************************ Ui Imports *************************
// => My Custom Components
import MainHeading from "@/components/common/MainHeading";
import ChangePasswordForm from "@/components/ui/auth/ChangePasswordForm";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import type { Metadata } from "next";

// **************** My Custom Types & Variables ****************
// => Variables
export const metadata: Metadata = {
  title: "YallaChat | Change Password",
  description: "Change your YallaChat account password",
};

function ChangePasswordPage() {
  return (
    <div className="change-password-page flex flex-col items-center">
      <MainHeading
        title={"Change Password | Secure Your Account"}
        description={
          "Update your account password to enhance security. Create a strong, unique password to protect your personal information and data."
        }
      />

      <div className="change-password-form max-xxs:w-full max-sm:w-[70%] max-lg:w-[85%] w-[70%]">
        <ChangePasswordForm />

        <p className="text-caption text-light-description dark:text-dark-description flex items-center justify-center text-center mt-12 ">
          © 2026 YallaChat. Created with 💙 by 3MR
        </p>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
