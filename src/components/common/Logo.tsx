// ************************ Ui Imports *************************
// => Ready To Use Components
import Image from "next/image";

function Logo() {
  return (
    <Image
      src="/pictures/yallachat_logo.png"
      alt="yallachat_logo"
      width={90}
      height={90}
      loading="lazy"
    />
  );
}

export default Logo;
