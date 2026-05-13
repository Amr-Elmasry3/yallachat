// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";

// => My Custom Components
import MyButton from "../common/MyButton";

// => Icons
import { MdRefresh } from "react-icons/md";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { chooseErrorImage } from "@/utils/chooseErrorImage";

function ErrorFallback() {
  return (
    <div className="flex flex-col items-center text-center mt-3">
      <Image
        src={chooseErrorImage()}
        alt="error_boundary_image"
        width={300}
        height={300}
        loading="lazy"
      />

      <h3 className="text-red mt-3">Something Went Wrong</h3>

      <p className="text-caption text-light-text dark:text-dark-text">
        An unexpected error occured. Please refresh the page.
      </p>

      <div
        className="mt-4"
        onClick={() => {
          window.location.reload();
        }}
      >
        <MyButton type="button" btnTitle="Refresh" style="one">
          <MdRefresh />
        </MyButton>
      </div>
    </div>
  );
}

export default ErrorFallback;
