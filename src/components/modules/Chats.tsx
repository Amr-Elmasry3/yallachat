// ************************ Ui Imports *************************
// => My Custom Components
import ChatFriends from "../ui/chats/ChatFriends";
import { ErrorBoundary } from "../error_boundary/ErrorBoundary";

function ChatsModule() {
  return (
    <div className="chats-page max-sm:pb-20 p-4">
      <h1 className="text-heading3 font-semibold text-light-text dark:text-dark-text mb-5">
        Chats
      </h1>

      <div className="content flex flex-col divide-y divide-gray-light dark:divide-gray">
        <ErrorBoundary>
          <ChatFriends />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default ChatsModule;
