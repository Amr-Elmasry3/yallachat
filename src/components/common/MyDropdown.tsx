"use client";
import React from "react";

// ************************ Ui Imports *************************
// => Ready To Use Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/shadcn/dropdown-menu";
import { Button } from "../shadcn/button";

// => Icons
import { BiDotsVerticalRounded } from "react-icons/bi";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useDialog } from "@/hooks/useDialog";
import { useNonDialog } from "@/hooks/useNonDialog";

// ***************** Types & Variables Imports *****************
// => Varaiables
import { MyDropdownMenu } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface MyDropdownProps {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  list: MyDropdownMenu[];
}

function MyDropdown({ side, align, list }: MyDropdownProps) {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { handleDialog } = useDialog();
  const { handleNonDialog } = useNonDialog();

  // => Functions
  const handleClickItem = (item: MyDropdownMenu) => {
    if (item.dialog && item.dialogConfig) {
      handleDialog(item.dialogConfig, item.sectionConfig, item.payload);
    } else if (!item.dialog) {
      handleNonDialog(item.sectionConfig, item.payload);
    }
  };

  return (
    <div className="my-dropdown">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            className="border-none bg-transparent hover:bg-transparent p-0 cursor-pointer"
          >
            <BiDotsVerticalRounded className="text-caption text-dark-main" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side={side}
          align={align}
          className="border-none dark:bg-gray-dark!"
        >
          <DropdownMenuGroup>
            {list.map((item) => {
              return (
                <React.Fragment key={item.id}>
                  {item.varient === "destructive" ? (
                    <DropdownMenuSeparator className="dark:bg-gray" />
                  ) : (
                    ""
                  )}

                  <DropdownMenuItem
                    variant={item.varient}
                    className={` ${item.varient === "default" ? "text-light-description dark:text-dark-description hover:text-light-description! dark:hover:text-dark-text! dark:hover:bg-[#dfdfdf14]" : ""}  py-2 flex items-center justify-between cursor-pointer`}
                    onClick={() => {
                      handleClickItem(item);
                    }}
                  >
                    <span className="text-caption capitalize">
                      {item.title}
                    </span>

                    {item.icon}
                  </DropdownMenuItem>
                </React.Fragment>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default MyDropdown;
