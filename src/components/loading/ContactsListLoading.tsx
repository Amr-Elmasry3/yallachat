// ************************ Ui Imports *************************
// => Ready To Use Components
import { Skeleton } from "../shadcn/skeleton";

function ContactsListLoading() {
  return (
    <ul className="contacts-list-loading flex flex-col mt-3 pb-3 divide-y divide-gray-light dark:divide-gray">
      {Array.from({ length: 4 }).map((_, index) => {
        return (
          <li className="flex flex-col gap-2 py-4" key={index}>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-4 rounded-full" />

              <Skeleton className="flex-1 h-0.5 w-full rouned-lg" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />

              <Skeleton className="flex-1 h-4 rounded-8" />

              <div className="flex flex-col gap-0.5">
                <Skeleton className="h-0.5 w-0.5 rounded-full" />

                <Skeleton className="h-0.5 w-0.5 rounded-full" />

                <Skeleton className="h-0.5 w-0.5 rounded-full" />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default ContactsListLoading;
