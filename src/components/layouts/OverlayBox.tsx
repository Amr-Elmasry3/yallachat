// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface OverlayBoxProps {
  children: React.ReactNode;
}

function OverlayBox({ children }: OverlayBoxProps) {
  return (
    <div className="overlay-box fixed z-100 inset-0 w-full h-full bg-[#000000ba] flex items-center justify-center">
      {children}
    </div>
  );
}

export default OverlayBox;
