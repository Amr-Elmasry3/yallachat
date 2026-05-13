// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";

// ***************** My Custom Types & Variables *****************
// => Types & Interfaces
interface BackgroundImageProps {
  src: string;
  alt: string;
}

function BackgroundImg({ src, alt }: BackgroundImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={100}
      height={100}
      loading="lazy"
      className="absolute z-[-1] w-full h-full top-0 left-0"
    />
  );
}

export default BackgroundImg;
