// ************************ Ui Imports *************************
// => My Custom Components
import ChatsModule from "@/components/modules/Chats";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import type { Metadata } from "next";

// **************** My Custom Types & Variables ****************
// => Variables
export const metadata: Metadata = {
  title: "YallaChat | Chats",
  description: "All your past and new conversations in one place",
};

function ChatsPage() {
  return <ChatsModule />;
}

export default ChatsPage;
