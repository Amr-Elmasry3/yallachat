"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import NotFoundChat from "../ui/userChat/NotFoundChat";
import FoundChat from "../ui/userChat/FoundChat";
import BackgroundImg from "../common/BackgroundImg";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useParams } from "next/navigation";

function UserChatModule() {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const params = useParams();

  return (
    <div className="user-chat relative z-0 w-full h-full bg-gray-light dark:bg-gray-dark flex flex-col">
      {!params.id ? <NotFoundChat /> : <FoundChat conversationId={params.id} />}
      <BackgroundImg
        src="https://doot-light.react.themesbrand.com/static/media/pattern-05.ffd181cdf9a08b200998.png"
        alt="user_chat_background"
      />
    </div>
  );
}

export default UserChatModule;
