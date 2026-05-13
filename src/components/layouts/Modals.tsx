// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ModalsProps {
  children: React.ReactNode;
}

function Modals({ children }: ModalsProps) {
  return (
    <div
      className={`overlay bg-[#00000078] fixed z-20 w-full h-full top-0 left-0 flex items-center justify-center`}
    >
      <div className="relative max-xs:w-[96%] w-140 max-h-[96%] bg-white dark:bg-gray-dark shadow-two rounded-14 p-6 overflow-scroll my-scrollbar">
        {children}
      </div>
    </div>
  );
}

export default Modals;
