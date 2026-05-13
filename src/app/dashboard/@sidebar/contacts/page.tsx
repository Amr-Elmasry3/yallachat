// ************************ Ui Imports *************************
// => My Custom Components
import ContactsModule from "@/components/modules/Contacts";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import type { Metadata } from "next";

// **************** My Custom Types & Variables ****************
// => Variables
export const metadata: Metadata = {
  title: "YallaChat | Contacts",
  description: "Your friends and contacts list on YallaChat",
};

function ContactsPage() {
  return <ContactsModule />;
}

export default ContactsPage;
