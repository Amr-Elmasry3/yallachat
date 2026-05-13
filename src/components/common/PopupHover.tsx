// ***************** Types & Variables Imports *****************
// => Varaiables
import { popupDirections } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface PopupHoverProps {
  title: string;
  direction: "top" | "right" | "bottom" | "left";
}

function PopupHover({ title, direction }: PopupHoverProps) {
  // ******************* Inside The Component  *******************
  // => Variables
  const directionConfig = popupDirections[direction];

  if (!directionConfig) {
    return null;
  }

  return (
    <div
      className={`popup-hover absolute opacity-0 group-hover:opacity-100 z-1 ${directionConfig.box} bg-black dark:bg-white rounded-[4px] my-transition`}
    >
      <span className="title block text-smallCaption text-white dark:text-gray-dark text-nowrap capitalize py-2 px-2">
        {title}
      </span>

      <span
        className={`arrow absolute ${directionConfig.arrow} border-6 border-solid border-transparent`}
      ></span>
    </div>
  );
}

export default PopupHover;
