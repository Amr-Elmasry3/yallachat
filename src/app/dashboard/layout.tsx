// *********************** Logic Imports ***********************
// => My Custom Hooks
import SideMenu from "@/components/layouts/SideMenu";
import MyAlertDialog from "@/components/layouts/MyAlertDialog";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  userChat: React.ReactNode;
}

function DashboardLayout({
  children,
  sidebar,
  userChat,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen flex">
      <SideMenu />

      {/* Mobile View */}
      <div className="mobile w-full max-sm:block hidden dark:bg-dark-bg overflow-scroll my-scrollbar">
        {children}
      </div>

      {/* Desktop View */}
      <div className="desktop w-full h-full max-sm:hidden flex">
        <div className="sidebar max-sm:min-w-full min-w-[320px] bg-white dark:bg-dark-bg max-sm:pb-18 p-4 max-h-full overflow-scroll my-scrollbar">
          {sidebar}
        </div>

        <div className="user-chat w-full">{userChat}</div>
      </div>

      <MyAlertDialog />
    </div>
  );
}

export default DashboardLayout;
