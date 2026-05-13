"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import Link from "next/link";

// => My Custom Components
import PopupHover from "../common/PopupHover";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ***************** Types & Variables Imports *****************
import { sideMenuLinks, SideLinks } from "@/Data";

function SideMenuLinks() {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [menuLinksState, setMenuLinksState] =
    useState<SideLinks[]>(sideMenuLinks);
  const hasInitialized = useRef(false);

  // => Use Hooks
  const pathname = usePathname();

  // => Functions
  const handleMenuLinks = (
    id: number | undefined,
    title: string = "no-link",
  ): void => {
    setMenuLinksState((prev) =>
      prev.map((item) => ({
        ...item,
        active: item.id === id || title.includes(item.linkTitle.toLowerCase()),
      })),
    );
  };

  // => Use Effects
  useEffect(() => {
    if (hasInitialized.current) return;

    const handleLinksAfterReload = () => {
      handleMenuLinks(undefined, pathname);

      hasInitialized.current = true;
    };

    handleLinksAfterReload();
  }, [pathname]);

  return (
    <div className="side-menu-links flex max-sm:flex-row flex-col items-center gap-4 max-sm:mt-0 mt-12 max-sm:w-[80%] w-full">
      {menuLinksState.map((link) => {
        return (
          <Link
            href={`/dashboard${link.href}`}
            key={link.id}
            className={`relative group w-full flex justify-center max-sm:py-4 max-sm:my-0 my-5 ${link.active ? "text-main" : "text-gray"} my-transition`}
            onClick={() => {
              handleMenuLinks(link.id);
            }}
          >
            {link.icon}

            <span
              className={`shap ${link.active ? "black" : "hidden"} absolute max-sm:top-0.5 max-sm:right-auto right-0 max-sm:w-full w-1 max-sm:h-1 h-full bg-main my-transition`}
            ></span>

            <div className="max-sm:hidden">
              <PopupHover title={link.linkTitle} direction={"right"} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default SideMenuLinks;
