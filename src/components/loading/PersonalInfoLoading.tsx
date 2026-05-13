// ************************ Ui Imports *************************
// => Ready To Use Components
import { Skeleton } from "../shadcn/skeleton";

function PersonalInfoLoading() {
  return (
    <ul className="personal-info-loading flex flex-col bg-gray-light dark:bg-gray-dark border border-solid border-gray-300 dark:border-gray divide-y divide-gray-300 dark:divide-gray rounded-lg">
      {Array.from({ length: 3 }).map((_, index) => {
        return (
          <li className="flex items-center gap-2 px-3 py-4" key={index}>
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-[60%] rounded-8" />

              <Skeleton className="h-5 w-[90%] rounded-8" />
            </div>

            <Skeleton className="h-7 w-7 rounded-full" />
          </li>
        );
      })}
    </ul>
  );
}

export default PersonalInfoLoading;
