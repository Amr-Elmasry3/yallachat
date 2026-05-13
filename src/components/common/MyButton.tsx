// ************************ Ui Imports *************************
// => Ready To Use Components
import { Button } from "../shadcn/button";

// ***************** My Custom Types & Variables *****************
// => Types & Interfaces
interface MyButtonProps {
  type: "submit" | "reset" | "button";
  btnTitle: string;
  style: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}
type BtnStylies = {
  [key: string]: {
    background: string;
    bgHover: string;
    color: string;
    colorHover: string;
  };
};

// => Varaiables
const btnStylies: BtnStylies = {
  one: {
    background: "from-main to-dark-main",
    bgHover: "hover:from-dark-main hover:to-main",
    color: "text-white",
    colorHover: "",
  },
  danger: {
    background: "from-danger to-red",
    bgHover: "hover:from-red hover:to-danger",
    color: "text-white",
    colorHover: "",
  },
};

function MyButton({
  type,
  btnTitle,
  style,
  children,
  isLoading,
}: MyButtonProps) {
  return (
    <Button
      className={`bg-linear-to-l ${btnStylies[style].background} ${btnStylies[style].bgHover} ${btnStylies[style].color} py-2 px-4 w-full my-transition cursor-pointer`}
      type={type}
      disabled={isLoading || false}
    >
      {btnTitle} {children}
    </Button>
  );
}

export default MyButton;
