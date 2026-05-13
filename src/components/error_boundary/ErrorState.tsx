// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { chooseErrorImage } from "@/utils/chooseErrorImage";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ErrorStateProps {
  status: number;
}
interface ErrorApiStatus {
  [key: number]: {
    title: string;
    description: string;
  };
}

// => Variables
const errorApiStatus: ErrorApiStatus = {
  400: {
    title: "Invalid Request",
    description:
      "The request could not be processed. Please check your information and try again.",
  },
  401: {
    title: "Session Expired",
    description: "Your session has expired. Please log in again to continue.",
  },
  403: {
    title: "Access Denied",
    description: "You don't have permission to perform this action.",
  },
  404: {
    title: "Serever Not Found",
    description:
      "The request service is not available. Please try again later.",
  },
  500: {
    title: "Server Error",
    description: "Something went wrong on our end. Please try again later.",
  },
  503: {
    title: "Service Unavailable",
    description:
      "The service is temporarily unavailable. Please try again in a few minutes.",
  },
};

function ErrorState({ status }: ErrorStateProps) {
  return (
    <div className="error-state flex flex-col items-center text-center mt-3">
      <Image
        src={chooseErrorImage(status)}
        alt={`erorr_${status}_image`}
        width={300}
        height={300}
        loading="lazy"
      />

      <h3 className="text-red mt-3">
        {errorApiStatus[status].title || "Something Went Wrong"}
      </h3>

      <p className="text-caption text-light-text dark:text-dark-text">
        {errorApiStatus[status].description || "An unexpected error occured."}
      </p>
    </div>
  );
}

export default ErrorState;
