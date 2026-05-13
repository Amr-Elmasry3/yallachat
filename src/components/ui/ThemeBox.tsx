"use client";

// ************************ Ui Imports *************************
// => Icons
import { BiMoon } from "react-icons/bi";
import { BiSun } from "react-icons/bi";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useContext } from "react";

// => Contexts
import { ThemeContext } from "@/contexts/ThemeContext";

function ThemeBox() {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { mode, handleNewMode } = useContext(ThemeContext);

  return (
    <div className="theme-box max-sm:w-[20%] max-sm:mt-0 mt-30 max-sm:flex max-sm:justify-end">
      {mode === "light" ? (
        <BiMoon
          className={`text-[28px] text-gray ${mode === "light" ? "block" : "hidden"} cursor-pointer`}
          onClick={() => {
            handleNewMode("dark");
          }}
        />
      ) : (
        <BiSun
          className={`text-[28px] text-gray ${mode === "dark" ? "block" : "hidden"} cursor-pointer`}
          onClick={() => {
            handleNewMode("light");
          }}
        />
      )}
    </div>
  );
}

export default ThemeBox;
