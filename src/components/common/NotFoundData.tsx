// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface NotFoundDataProps {
  title: string;
}

function NotFoundData({ title }: NotFoundDataProps) {
  return (
    <div className="not-found-data mt-6 flex flex-col items-center">
      <Image
        src="/pictures/no_data.png"
        alt={`${title}_picture`}
        width={300}
        height={320}
        loading="lazy"
      />

      <p className="text-[15px] font-medium text-light-text dark:text-dark-text text-center capitalize mt-2">
        {title}
      </p>
    </div>
  );
}

export default NotFoundData;
