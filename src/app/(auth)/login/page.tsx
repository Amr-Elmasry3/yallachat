// ************************ Ui Imports *************************
// => My Custom Components
import MainHeading from "@/components/common/MainHeading";
import LoginForm from "@/components/ui/auth/LoginForm";
import AuthQuestion from "@/components/ui/auth/AuthQuestion";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import type { Metadata } from "next";

// **************** My Custom Types & Variables ****************
// => Variables
export const metadata: Metadata = {
  title: "YallaChat | Login",
  description: "Log in to YallaChat to connect with your friends",
};

function Login() {
  return (
    <div className="login-page flex flex-col items-center">
      <MainHeading
        title={"YallaChat - Welcome Back!"}
        description={
          "Login to continue your journey in more enjouable communication."
        }
      />

      <div className="login-form max-xxs:w-full max-sm:w-[70%] max-lg:w-[85%] w-[70%]">
        <LoginForm />

        <AuthQuestion
          title="Don't have an account ?"
          href="/register"
          linkTitle="register"
        />

        <p className="text-caption text-light-description dark:text-dark-description flex items-center justify-center text-center mt-12 ">
          © 2026 YallaChat. Created with 💙 by 3MR
        </p>
      </div>
    </div>
  );
}

export default Login;
