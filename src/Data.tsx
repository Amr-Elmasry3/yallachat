// ------ This Is Part For Icons ------
// Import React Icons
import { BiConversation } from "react-icons/bi";
import { BiSolidUserDetail } from "react-icons/bi";
import { BiPhoneCall } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { BiPencil } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import { BiLockOpen } from "react-icons/bi";
import { BiCopy } from "react-icons/bi";
import { BiShare } from "react-icons/bi";
import { BiDownload } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";
import { BiEnvelope } from "react-icons/bi";
import { BiPhone } from "react-icons/bi";

// Import Types
import { Friend, Message } from "./lib/types";

// ------ This Is Part For Types ------
// [1]=> Auth Types
type Fields = {
  id: number;
  type: string;
  label: string;
  placeholder: string;
};
type RegisterFields = Fields & {
  name: "username" | "email" | "phone" | "password";
};
type LoginFields = Fields & {
  name: "email" | "password";
};
type ChangePassswordFields = Fields & {
  name: "currentPassword" | "newPassword" | "confirmNewPassword";
};

// [2]=> Dialog Types
import { DialogInfo, SectionConfig } from "./lib/types";

// [3]=> Dashboard Types
export type SideLinks = {
  id: number;
  icon: React.ReactNode;
  linkTitle: string;
  href: string;
  active: boolean;
};
type PopupDirections = {
  [key: string]: {
    box: string;
    arrow: string;
  };
};
export type Payload = Friend | Message; // => Frined(Contacts) | Message(Chat);
export interface MyDropdownMenu {
  id: number;
  title: string;
  varient: "default" | "destructive";
  icon: React.ReactNode;
  dialog: boolean;
  sectionConfig: SectionConfig;
  dialogConfig?: DialogInfo;
  payload?: Payload;
}
/* ----- Personal Info ------ */
export type MyPersonalInfo = {
  id: number;
  title: string;
  value: string;
};
export type PersonalInfoIcons = {
  [key: string]: React.ReactNode;
};
type UpdateInfoFields = Fields & {
  name: "username" | "email" | "phone" | "bio";
};
/* ----- Chats [Add New Friends] ------ */
type AddFriendsFields = Fields & {
  name: "friendName" | "friendPhone";
};

// ------ This Is Part For Variables ------
// [1]=> Auth Variables
/* ----- Register Fields ------ */
export const registerFields: RegisterFields[] = [
  {
    id: 1,
    type: "text",
    name: "username",
    label: "Username",
    placeholder: "Enter your name",
  },
  {
    id: 2,
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    id: 3,
    type: "text",
    name: "phone",
    label: "Phone",
    placeholder: "Enter your phone",
  },
  {
    id: 4,
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
  },
];
/* ----- Login Fields ------ */
export const loginFields: LoginFields[] = [
  {
    id: 1,
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    id: 2,
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
  },
];
/* ----- Change Password Fields ------ */
export const changePasswordFields: ChangePassswordFields[] = [
  {
    id: 1,
    type: "password",
    name: "currentPassword",
    label: "Current Password",
    placeholder: "Enter current password",
  },
  {
    id: 2,
    type: "password",
    name: "newPassword",
    label: "New Password",
    placeholder: "Enter new password",
  },
  {
    id: 3,
    type: "password",
    name: "confirmNewPassword",
    label: "Confirm New Password",
    placeholder: "Enter confirm new password",
  },
];

// [2]=> Dashboard Variables
/* ----- Side Menu Links ------ */
export const sideMenuLinks: SideLinks[] = [
  {
    id: 1,
    icon: <BiConversation className="text-[28px]" />,
    linkTitle: "Chats",
    href: "/chats",
    active: true,
  },
  {
    id: 2,
    icon: <BiSolidUserDetail className="text-[28px]" />,
    linkTitle: "Contacts",
    href: "/contacts",
    active: false,
  },
  {
    id: 3,
    icon: <BiPhoneCall className="text-[28px]" />,
    linkTitle: "Calls",
    href: "/calls",
    active: false,
  },
  {
    id: 4,
    icon: <BiCog className="text-[28px]" />,
    linkTitle: "Settings",
    href: "/settings",
    active: false,
  },
];
/* ----- Popup Hover Directions ------ */
export const popupDirections: PopupDirections = {
  top: {
    box: "top-0 translate-y-[-100%] left-[50%] translate-x-[-50%]",
    arrow:
      "bottom-[1px] translate-y-[100%] border-t-black dark:border-t-gray-light left-[50%] translate-x-[-50%]",
  },
  right: {
    box: "right-0 translate-x-[100%] top-[50%] translate-y-[-50%]",
    arrow:
      "left-[1px] translate-x-[-100%] border-r-black dark:border-r-gray-light top-[50%] translate-y-[-50%]",
  },
  bottom: {
    box: "bottom-0 translate-y-[100%] left-[50%] translate-x-[-50%]",
    arrow:
      "top-[1px] translate-y-[-100%] border-b-black dark:border-b-gray-light left-[50%] translate-x-[-50%]",
  },
  left: {
    box: "left-0 translate-x-[-100%] top-[50%] translate-y-[-50%]",
    arrow:
      "right-[1px] translate-x-[100%] border-l-black dark:border-l-gray-lighttop-[50%] translate-y-[-50%]",
  },
};
/* ----- Profile Dropdwon Menu ------ */
export const profileDropdwonMenu: MyDropdownMenu[] = [
  {
    id: 1,
    title: "update info",
    varient: "default",
    icon: <BiPencil className="text-caption" />,
    dialog: false,
    sectionConfig: {
      name: "profile",
      funcName: "updateInfoFunc",
    },
  },
  {
    id: 2,
    title: "change password",
    varient: "default",
    icon: <BiLockOpen className="text-caption" />,
    dialog: false,
    sectionConfig: {
      name: "profile",
      funcName: "changePasswordFunc",
    },
  },
  {
    id: 3,
    title: "logout",
    varient: "destructive",
    icon: <BiLogOut className="text-caption" />,
    dialog: true,
    sectionConfig: {
      name: "profile",
      funcName: "logoutFunc",
    },
    dialogConfig: {
      title: "Log out?",
      description:
        "Are you sure you want to log out? You'll need to log in again to use the app.",
      cancelBtn: "Cancel",
      okBtn: "Logout",
    },
  },
];
/* ----- Contacts Dropdwon Menu ------ */
export const contactsDropdwonMenu: MyDropdownMenu[] = [
  {
    id: 1,
    title: "chat",
    varient: "default",
    icon: <BiPencil className="text-caption" />,
    dialog: false,
    sectionConfig: {
      name: "contacts",
      funcName: "chatFunc",
    },
  },
  {
    id: 2,
    title: "delete",
    varient: "destructive",
    icon: <BiTrash className="text-caption" />,
    dialog: true,
    sectionConfig: {
      name: "contacts",
      funcName: "deleteFriendFunc",
    },
    dialogConfig: {
      title: "Delete Friend?",
      description:
        "Are you sure you want to remove this friend from your friends list? You won't be able to see your previous chat history again.",
      cancelBtn: "Cancel",
      okBtn: "Continue",
    },
  },
];
/* ----- Messages Chat Dropdwon Menu ------ */
export const messagesChatDropdownMenu: MyDropdownMenu[] = [
  {
    id: 1,
    title: "reply",
    varient: "default",
    icon: <BiShare className="text-caption" />,
    dialog: false,
    sectionConfig: {
      name: "messagesChat",
      funcName: "replyFunc",
    },
  },
  {
    id: 2,
    title: "copy",
    varient: "default",
    icon: <BiCopy className="text-caption" />,
    dialog: false,
    sectionConfig: {
      name: "messagesChat",
      funcName: "copyFunc",
    },
  },
  {
    id: 3,
    title: "download",
    varient: "default",
    icon: <BiDownload className="text-caption" />,
    dialog: false,
    sectionConfig: {
      name: "messagesChat",
      funcName: "downloadFunc",
    },
  },
  {
    id: 4,
    title: "delete",
    varient: "default",
    icon: <BiTrash className="text-caption" />,
    dialog: true,
    sectionConfig: {
      name: "messagesChat",
      funcName: "deleteFunc",
    },
    dialogConfig: {
      title: "Delete message?",
      description:
        "Are you sure you want to delete this message? It will disappear from the chat for you and the other person",
      cancelBtn: "Cancel",
      okBtn: "Delete",
    },
  },
];
/* ----- User Info ------ */
export const personalInfo: MyPersonalInfo[] = [
  { id: 1, title: "name", value: "username" },
  { id: 2, title: "email", value: "email" },
  { id: 3, title: "phone", value: "phone_number" },
];
export const personalInfoIcons: PersonalInfoIcons = {
  name: <BiUserCircle className="text-gray-400 text-heading3" />,
  email: <BiEnvelope className="text-gray-400 text-heading3" />,
  phone: <BiPhone className="text-gray-400 text-heading3" />,
};
/* ----- Update User Info ------ */
export const updateInfoFields: UpdateInfoFields[] = [
  {
    id: 1,
    type: "text",
    name: "username",
    label: "Username",
    placeholder: "Enter your name",
  },
  {
    id: 2,
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    id: 3,
    type: "text",
    name: "phone",
    label: "Phone",
    placeholder: "Enter your phone",
  },
];
/* ----- Add New Friend ------ */
export const addfriendsFields: AddFriendsFields[] = [
  {
    id: 1,
    type: "text",
    name: "friendName",
    label: "Friend Name",
    placeholder: "Enter friend name",
  },
  {
    id: 2,
    type: "text",
    name: "friendPhone",
    label: "Friend Phone",
    placeholder: "Enter friend phone",
  },
];
