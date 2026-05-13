// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";

// => My Custom Components
import Logo from "@/components/common/Logo";
import BackgroundImg from "@/components/common/BackgroundImg";

function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative bg-linear-to-l from-dark-main dark:from-gray-dark to-main dark:to-gray-dark min-h-screen max-xs:p-3.5 p-5 flex max-sm:flex-col max-sm:gap-7">
      <div className="relative flex-1">
        <Logo />

        <Image
          src="/pictures/login_register_image.png"
          alt="login_register_image"
          width={800}
          height={800}
          className="max-lg:hidden block translate-y-full"
          loading="lazy"
        />
      </div>

      <div className="relative z-0 max-sm:w-full w-[75%] bg-white dark:bg-dark-bg p-6 pt-12 rounded-14 flex flex-col items-center shadow-one">
        <BackgroundImg
          src="https://doot-light.react.themesbrand.com/static/media/pattern-05.ffd181cdf9a08b200998.png"
          alt="login_register_background"
        />

        <div className="cover max-sm:w-full w-[65%]">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
