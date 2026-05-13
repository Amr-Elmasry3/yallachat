// ************************ Ui Imports *************************
// => Icons
import { GrAttachment } from "react-icons/gr";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface AnotherFilesTypeProps {
  fileName: string;
  fileSize: number;
}

function AnotherFilesType({ fileName, fileSize }: AnotherFilesTypeProps) {
  // ******************* Inside The Component  *******************
  // => Functions
  const formatFileSize = (bytes: number, decimals: number = 2): string => {
    if (!bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;

    const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="w-full flex items-center gap-4 border border-solid border-dark-main px-4 py-2 rounded-8">
      <div className="w-9 h-9 rounded-circle bg-main flex items-center justify-center">
        <GrAttachment className="text-[18px] text-light-text" />
      </div>

      <div className="info flex flex-col gap-1.5">
        <p className="file-name text-[17px] font-medium text-light-text dark:text-dark-text">
          {fileName}
        </p>

        <span className="size text-[13px] text-light-description dark:text-dark-description">
          {formatFileSize(fileSize)}
        </span>
      </div>
    </div>
  );
}

export default AnotherFilesType;
