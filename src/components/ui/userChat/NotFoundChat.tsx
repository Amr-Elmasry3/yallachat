// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";

function NotFoundChat() {
  return (
    <div className="not-found-chat w-full h-full flex flex-col items-center justify-center text-center">
      <Image
        src="/pictures/yallachat_icon.png"
        alt="yallachat_icon"
        width={120}
        height={120}
        loading="lazy"
      />

      <h2 className="text-heading3 font-medium text-light-text dark:text-dark-text mt-4 mb-2">
        Welcome To Yalla Chat App
      </h2>

      <p className="text-light-description dark:text-dark-text max-w-[75%]">
        Start chatting with your family or friends now by selecting any
        conversation you want from the chats or the contacts section.
      </p>
    </div>
  );
}

export default NotFoundChat;
