// ************************ Ui Imports *************************
// => Ready To Use Components
import { Spinner } from "../shadcn/spinner";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface MySpinnerProps {
  isLoading: boolean;
}

function MySpinner({ isLoading }: MySpinnerProps) {
  return (
    <Spinner className={`${isLoading ? "block" : "hidden"} my-transition`} />
  );
}

export default MySpinner;
