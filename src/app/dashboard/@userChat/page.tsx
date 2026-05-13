// ************************ Ui Imports *************************
// => My Custom Components
import UserChatModule from "@/components/modules/UserChat";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import type { Metadata } from "next";

// **************** My Custom Types & Variables ****************
// => Variables
export const metadata: Metadata = {
  title: "YallaChat | Conversation",
  description: "Chat with your friend in this conversation",
};

function UserChatPage() {
  return <UserChatModule />;
}

export default UserChatPage;
