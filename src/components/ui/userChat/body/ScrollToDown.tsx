"use client";

// ************************ Ui Imports *************************
// => Icons
import { BiChevronDown } from "react-icons/bi";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ScrollToDownProps {
  count: number;
  onClick?: () => void;
}

function ScrollToDown({ count, onClick }: ScrollToDownProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="sticky z-40 bottom-3 left-[50%] translate-x-[-50%] bg-white dark:bg-dark-bg w-8 min-h-8 rounded-full flex items-center justify-center cursor-pointer shadow-two"
    >
      <BiChevronDown className="text-heading3 text-light-text dark:text-dark-text" />

      {count ? (
        <span className="count absolute bg-main w-4 h-4 rounded-full text-[10px] flex items-center justify-center -top-2.5 left-[50%] translate-x-[-50%]">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export default ScrollToDown;
