// ************************ Ui Imports *************************
// => My Custom Components
import RegisterForm from "@/components/ui/auth/RegisterForm";
import MainHeading from "@/components/common/MainHeading";
import AuthQuestion from "@/components/ui/auth/AuthQuestion";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import type { Metadata } from "next";

// **************** My Custom Types & Variables ****************
// => Variables
export const metadata: Metadata = {
  title: "YallaChat | Register",
  description: "Sign up for YallaChat to start chatting with your friends",
};

function Register() {
  return (
    <div className="register-page flex flex-col items-center">
      <MainHeading
        title={"Join YallaChat Community"}
        description={
          "Register now for free and start a unique communication journey with friends and family."
        }
      />

      <div className="register-form max-xxs:w-full max-sm:w-[70%] max-lg:w-[85%] w-[70%]">
        <RegisterForm />

        <AuthQuestion
          title="Already have an account ?"
          href="/login"
          linkTitle="login"
        />

        <p className="text-caption text-light-description dark:text-dark-description flex items-center justify-center text-center mt-12 ">
          © 2026 YallaChat. Created with 💙 by 3MR
        </p>
      </div>
    </div>
  );
}

export default Register;
