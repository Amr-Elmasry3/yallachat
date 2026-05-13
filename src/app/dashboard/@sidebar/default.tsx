// ************************ Ui Imports *************************
// => My Custom Components
import ChatsModule from "@/components/modules/Chats";
import ContactsModule from "@/components/modules/Contacts";
import CallsModule from "@/components/modules/Calls";
import SettingsModule from "@/components/modules/Settings";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { headers } from "next/headers";

async function Default() {
  const headersList = await headers();

  const pathname = headersList.get("x-pathname");

  const segment = pathname?.split("/")[2];

  switch (segment) {
    case "chats":
      return <ChatsModule />;
    case "contacts":
      return <ContactsModule />;
    case "calls":
      return <CallsModule />;
    case "settings":
      return <SettingsModule />;
    default:
      return (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <p className="text-dark-main text-center">
            You can control what appears here by selecting from the menu. blaa
            blaa
          </p>
        </div>
      );
  }
}

export default Default;
