// ************************ Ui Imports *************************
// => Ready To Use Components
import { Skeleton } from "../shadcn/skeleton";

function ChatHeadrLoading() {
  return (
    <div className="chat-headr-loading flex-1 flex items-center gap-2">
      <Skeleton className="h-9 w-9 rounded-full" />

      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4.5 w-28 rouned-8" />

        <Skeleton className="h-3 w-16 rouned-8" />
      </div>
    </div>
  );
}

export default ChatHeadrLoading;
