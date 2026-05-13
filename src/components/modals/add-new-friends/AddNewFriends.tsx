"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import AddFriendsForm from "./AddFriendsForm";
import CloseIcon from "@/components/common/CloseIcon";
import MainHeading from "@/components/common/MainHeading";
import Modals from "@/components/layouts/Modals";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useContext } from "react";

// => Contexts
import { AddFriendsContext } from "@/contexts/AddFriendsContext";

function AddNewFriends() {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { isOpen, handleIsOpenFriends } = useContext(AddFriendsContext);

  return isOpen ? (
    <Modals>
      <MainHeading
        title={"Add Friends"}
        description={
          "Search and add new Friends to start chatting instantly. Connect with people you know and grow network."
        }
      />

      <AddFriendsForm />

      <CloseIcon handleClose={handleIsOpenFriends} />
    </Modals>
  ) : null;
}

export default AddNewFriends;
