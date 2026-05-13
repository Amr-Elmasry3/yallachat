// ************************ Ui Imports *************************
// => My Custom Components
import CallsModule from "@/components/modules/Calls";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import type { Metadata } from "next";

// **************** My Custom Types & Variables ****************
// => Variables
export const metadata: Metadata = {
  title: "YallaChat | Calls",
  description: "Call log (outgoing, incoming, and missed calls)",
};

function CallsPage() {
  return <CallsModule />;
}

export default CallsPage;
