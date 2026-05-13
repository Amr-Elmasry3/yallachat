// ************************ Ui Imports *************************
// => My Custom Components
import SideMenuLinks from "../ui/SideMenuLinks";
import ThemeBox from "../ui/ThemeBox";
import Logo from "../common/Logo";

function SideMenu() {
  return (
    <div className="max-sm:fixed max-sm:z-20 relative max-sm:bottom-0 max-sm:min-w-full min-w-20 max-sm:h-14 h-full max-sm:px-5 max-sm:py-0 py-4 bg-gray-dark flex max-sm:flex-row flex-col items-center">
      <div className="max-sm:hidden block">
        <Logo />
      </div>

      <SideMenuLinks />

      <ThemeBox />
    </div>
  );
}

export default SideMenu;
