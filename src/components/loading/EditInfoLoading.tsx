// ************************ Ui Imports *************************
// => Ready To Use Components
import { Skeleton } from "../shadcn/skeleton";

function EditInfoLoading() {
  return (
    <div className="edit-info-loading relative flex flex-col items-center bg-gray-light dark:bg-gray-dark border border-solid border-gray-300 dark:border-gray rounded-lg px-3 py-6 mb-8">
      <Skeleton className="h-25 w-25 rounded-full" />

      <Skeleton className="h-6 w-28 rounded-8 mt-5 mb-2" />

      <Skeleton className="h-4 w-full rounded-8" />
    </div>
  );
}

export default EditInfoLoading;
