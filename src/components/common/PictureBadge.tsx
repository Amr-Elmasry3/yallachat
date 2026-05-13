// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { nameAbbreviation } from "@/utils/nameAbbreviation";
import { randomBackground } from "@/utils/randomBackground";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface PictureBadgeProps {
  name: string;
  srcImg?: string | null;
  width?: number;
  height?: number;
}

function PictureBadge({ name, srcImg, width, height }: PictureBadgeProps) {
  return (
    <div
      className={`picture-badge ${!srcImg && name ? randomBackground(name) : ""} ${width && height ? `w-${width} h-${height}` : "w-9 h-9"} rounded-circle`}
    >
      {srcImg ? (
        <Image
          src={srcImg}
          alt="account_picture"
          width={width && height ? width * 4 : 36}
          height={width && height ? height * 4 : 36}
          loading="lazy"
          className="w-full h-full rounded-circle"
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center text-smallCaption text-white">
          {!srcImg && name ? nameAbbreviation(name) : null}
        </span>
      )}
    </div>
  );
}

export default PictureBadge;
