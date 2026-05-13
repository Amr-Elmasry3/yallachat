"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import AddBtn from "../../common/AddBtn";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useContext } from "react";

// => Contexts
import { AddFriendsContext } from "@/contexts/AddFriendsContext";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ChatsHeadingProps {
  title: string;
  popup: string;
  typeModal: "friends" | "groups";
}

function ChatsHeading({ title, popup, typeModal }: ChatsHeadingProps) {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { handleIsOpenFriends } = useContext(AddFriendsContext);

  // => Functions
  const handleClickIcon = () => {
    switch (typeModal) {
      case "friends":
        handleIsOpenFriends();
        break;

      default:
        break;
    }
  };

  return (
    <div className="chats-heading flex items-center justify-between gap-2">
      <span className="title text-button text-light-description dark:text-dark-description">
        {title}
      </span>

      <div onClick={handleClickIcon}>
        <AddBtn popup={popup} />
      </div>
    </div>
  );
}

export default ChatsHeading;
