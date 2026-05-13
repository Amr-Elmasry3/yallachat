"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";

// => My Custom Components
import MyDropdown from "../../common/MyDropdown";
import CameraIcon from "./CameraIcon";

// => Icons
import { BiSolidUser } from "react-icons/bi";

// ***************** Types & Variables Imports *****************
// => Varaiables
import { profileDropdwonMenu } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface EditInfoProps {
  srcImg: string;
  name: string;
  bio: string;
}

function EditInfo({ srcImg, name, bio }: EditInfoProps) {
  return (
    <div className="main-personal relative flex flex-col items-center bg-gray-light dark:bg-gray-dark border border-solid border-gray-300 dark:border-gray rounded-lg px-3 py-6 mb-8">
      <div className="account-img relative w-20 h-20 outline-4 outline-solid outline-gray-300 rounded-circle">
        {srcImg ? (
          <Image
            src={srcImg}
            alt="account_picture"
            width={80}
            height={80}
            loading="lazy"
            className="w-full h-full rounded-circle"
          />
        ) : (
          <div className="bg-white dark:bg-gray-dark w-full h-full rounded-circle overflow-hidden">
            <BiSolidUser className="relative z-0 -bottom-3 left-[50%] translate-x-[-50%] text-[80px] text-gray-300" />
          </div>
        )}

        <CameraIcon />
      </div>

      <div className="text-center">
        <h2 className="mt-4 mb-1 text-[18px] font-medium text-light-text dark:text-dark-text capitalize">
          {name}
        </h2>

        {bio ? (
          <p className="text-[15px] text-light-description dark:text-dark-description">
            {bio}
          </p>
        ) : (
          ""
        )}
      </div>

      <div className="absolute top-0 right-0">
        <MyDropdown side="bottom" align="center" list={profileDropdwonMenu} />
      </div>
    </div>
  );
}

export default EditInfo;
