// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { UserInfo } from "@/lib/types";

// => Varaiables
import { personalInfo, personalInfoIcons } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface PersonalInfoProps {
  data: UserInfo;
}
type UserInfoKey = "username" | "email" | "phone_number";

function PersonalInfo({ data }: PersonalInfoProps) {
  return (
    <ul className="personal-info flex flex-col bg-gray-light dark:bg-gray-dark border border-solid border-gray-300 dark:border-gray divide-y divide-gray-300 dark:divide-gray rounded-lg">
      {personalInfo.map((item) => {
        return (
          <li
            key={item.id}
            className="flex items-center justify-between px-3 py-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-caption text-light-description dark:text-dark-description capitalize">
                your {item.title}
              </span>

              <p className="text-[15px] font-semibold text-light-text dark:text-dark-text">
                {data[item.value as UserInfoKey]}
              </p>
            </div>

            {personalInfoIcons[item.title]}
          </li>
        );
      })}
    </ul>
  );
}

export default PersonalInfo;
