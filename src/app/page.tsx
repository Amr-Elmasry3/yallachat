// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";
import Link from "next/link";

// => My Custom Components
import MyButton from "@/components/common/MyButton";
import BackgroundImg from "@/components/common/BackgroundImg";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import type { Metadata } from "next";

// **************** My Custom Types & Variables ****************
// => Variables
export const metadata: Metadata = {
  title: "YallaChat | Home",
  description: "YallaChat homepage, welcome your friends and start chatting",
};

function HomePage() {
  return (
    <div className="home-page relative z-0 bg-white dark:bg-dark-bg h-screen flex flex-col items-center justify-center text-center px-6">
      <Image
        src="/pictures/yallachat_icon.png"
        alt="yallachat_logo"
        width={200}
        height={200}
        loading="lazy"
      />

      <h1 className="text-5xl font-bold text-light-text dark:text-dark-text mt-3">
        YallaChat
      </h1>

      <p className="text-base text-light-description dark:text-dark-description max-w-150 mt-2 mb-6">
        Stay in touch width your friends quickly and securely. Chat instantly,
        share photos and videos, and make high-quality voice calls. All in one
        place-free and easy to use.
      </p>

      <Link href="/login">
        <MyButton type="button" btnTitle="Get Started" style="one" />
      </Link>

      <BackgroundImg
        src="https://doot-light.react.themesbrand.com/static/media/pattern-05.ffd181cdf9a08b200998.png"
        alt="login_register_background"
      />
    </div>
  );
}

export default HomePage;
