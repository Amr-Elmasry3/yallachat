// ************************ Ui Imports *************************
// => Ready To Use Components
import Link from "next/link";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface AuthQuestionProps {
  title: string;
  href: string;
  linkTitle: string;
}

function AuthQuestion({ title, href, linkTitle }: AuthQuestionProps) {
  return (
    <div className="auth-question flex items-center justify-center gap-2 text-center mt-3">
      <p className="text-button text-light-description dark:text-dark-description">
        {title}
      </p>

      <Link
        href={href}
        className="font-medium text-main hover:text-dark-main capitalize underline my-transition"
      >
        {linkTitle}
      </Link>
    </div>
  );
}

export default AuthQuestion;
