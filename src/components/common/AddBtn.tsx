// ************************ Ui Imports *************************
// => Ready To Use Components
import { Button } from "@/components/shadcn/button";

// => My Custom Components
import PopupHover from "./PopupHover";

// => Icons
import { Plus } from "lucide-react";

// ***************** My Custom Types & Variables *****************
// => My Custom Types & Interfaces
interface AddBtnProps {
  popup: string;
}

function AddBtn({ popup }: AddBtnProps) {
  return (
    <div className="add-btn relative group">
      <Button
        variant="outline"
        size="icon"
        type="button"
        className="bg-[#00e9ad29] hover:bg-main text-main hover:text-white border-none py-2.5 px-3 w-fit h-fit my-transition cursor-pointer"
      >
        <Plus className="my-transition" />
      </Button>

      <PopupHover title={popup} direction="top" />
    </div>
  );
}

export default AddBtn;
