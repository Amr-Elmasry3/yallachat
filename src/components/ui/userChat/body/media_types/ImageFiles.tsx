// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ImageFilesProps {
  src: string;
  alt: string;
}

function ImageFiles({ src, alt = "image-message" }: ImageFilesProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={180}
      height={110}
      loading="lazy"
      className="rounded-8 w-full h-full"
    />
  );
}

export default ImageFiles;
