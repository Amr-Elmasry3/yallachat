// ************************ Ui Imports *************************
// => Ready To Use Components
import { Skeleton } from "../shadcn/skeleton";

function FriendsListLoading() {
  return (
    <ul className="flex flex-col mt-3 pb-3 divide-y divide-gray-light dark:divide-gray">
      {Array.from({ length: 4 }).map((_, index) => {
        return (
          <li
            className="friends-list-loading flex items-center gap-2 py-3"
            key={index}
          >
            <Skeleton className="h-9 w-9 rounded-full" />

            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-[80%] rounded-8" />

              <Skeleton className="h-3 w-full rounded-8" />
            </div>

            <Skeleton className="h-3 w-6 rounded-lg" />
          </li>
        );
      })}
    </ul>
  );
}

export default FriendsListLoading;
