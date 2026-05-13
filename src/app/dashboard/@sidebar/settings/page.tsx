// ************************ Ui Imports *************************
// => My Custom Components
import SettingsModule from "@/components/modules/Settings";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import type { Metadata } from "next";

// **************** My Custom Types & Variables ****************
// => Variables
export const metadata: Metadata = {
  title: "YallaChat | Settings",
  description: "Adjust your account settings, privacy, and notifications.",
};

function SettingsPage() {
  return <SettingsModule />;
}

export default SettingsPage;
