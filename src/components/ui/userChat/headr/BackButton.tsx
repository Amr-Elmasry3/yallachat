"use client";

// ************************ Ui Imports *************************
// => Icons
import { BiChevronLeft } from "react-icons/bi";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRouter } from "next/navigation";

function BackButton() {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const router = useRouter();

  // => Functions
  const handleOnClick = (): void => {
    router.back();
  };

  return (
    <div
      className="back-button cursor-pointer min-w-8 h-8 bg-main hover:bg-dark-main hidden max-sm:flex items-center justify-center rounded-8"
      onClick={handleOnClick}
    >
      <BiChevronLeft className="text-heading3 text-white" />
    </div>
  );
}

export default BackButton;
