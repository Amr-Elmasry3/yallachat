"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import CloseIcon from "@/components/common/CloseIcon";
import UpdateInfoForm from "./UpdateInfoForm";
import MainHeading from "@/components/common/MainHeading";
import Modals from "@/components/layouts/Modals";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useContext } from "react";

// => Contexts
import { UpdateInfoContext } from "@/contexts/UpdateInfoContext";

function UpdateInfo() {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { isOpen, handleIsOpen } = useContext(UpdateInfoContext);

  return isOpen ? (
    <Modals>
      <CloseIcon handleClose={handleIsOpen} />

      <MainHeading
        title={"Update Profile | Manage Your Account Information"}
        description={
          "Update your personal information, contact details. Keep your profile current for better experience."
        }
      />

      <div className="update-info-form">
        <UpdateInfoForm />
      </div>
    </Modals>
  ) : null;
}

export default UpdateInfo;
