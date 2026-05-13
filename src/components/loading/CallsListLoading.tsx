// ************************ Ui Imports *************************
// => Ready To Use Components
import { Skeleton } from "../shadcn/skeleton";

function CallsListLoading() {
  return (
    <ul className="flex flex-col divide-y divide-gray-light dark:divide-gray">
      {Array.from({ length: 7 }).map((_, index) => {
        return (
          <li className="py-4 flex items-center gap-2" key={index}>
            <Skeleton className="h-9 w-9 rounded-full" />

            <div className="flex-1 flex flex-col gap-1">
              <Skeleton className="h-4 w-[80%] rounded-8" />

              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-2 rounded-lg" />

                <Skeleton className="h-3 w-17 rounded-lg" />

                <Skeleton className="h-3 w-14 rounded-lg" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-8 rounded-lg" />

              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default CallsListLoading;
