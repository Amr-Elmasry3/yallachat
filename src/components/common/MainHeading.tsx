// ***************** My Custom Types & Variables *****************
// => Types & Interfaces
interface MainHeadingProps {
  title: string;
  description: string;
}

function MainHeading({ title, description }: MainHeadingProps) {
  return (
    <div className="main-heading flex flex-col items-center text-center mb-10">
      <h1 className="title text-heading3 font-semibold text-light-text dark:text-dark-text mb-2">
        {title}
      </h1>

      <p className="descripton text-light-description dark:text-dark-description max-sm:max-w-[85%]  max-w-[70%]">
        {description}
      </p>
    </div>
  );
}

export default MainHeading;
