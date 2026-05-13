"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import PictureBadge from "@/components/common/PictureBadge";
import MyDropdown from "@/components/common/MyDropdown";
import NotFoundData from "@/components/common/NotFoundData";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { FriendsData, Friend } from "@/lib/types";
import { MyDropdownMenu } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ContactsListUiProps {
  count: number;
  contactsList: FriendsData;
  getFirstLetter: (value: string) => string;
  checkFirstCharacters: (userOne: string, userTwo: string) => boolean;
  handleContactsPayload: (payload: Friend) => MyDropdownMenu[];
}

function ContactsListUi({
  count,
  contactsList,
  getFirstLetter,
  checkFirstCharacters,
  handleContactsPayload,
}: ContactsListUiProps) {
  return (
    <ul className="contacts-list mt-6 flex flex-col gap-7">
      {count && contactsList.count ? (
        contactsList.friendsList.map((friend, index) => {
          return (
            <li className="flex flex-col gap-4" key={friend.id}>
              {index === 0 ||
              !checkFirstCharacters(
                friend.username,
                contactsList.friendsList[index - 1].username,
              ) ? (
                <div className="head flex items-center gap-5">
                  <span className="text-caption font-semibold text-dark-main">
                    {getFirstLetter(friend.username)}
                  </span>

                  <span className="flex-1 h-0.5 bg-gray-light dark:bg-gray"></span>
                </div>
              ) : null}

              <div className="flex items-center gap-2">
                <PictureBadge name={friend.username} />

                <span className="name flex-1 text-caption text-light-text dark:text-dark-text capitalize">
                  {friend.username}
                </span>

                <MyDropdown
                  side="bottom"
                  align="end"
                  list={handleContactsPayload(friend)}
                />
              </div>
            </li>
          );
        })
      ) : (
        <NotFoundData title="no contacts" />
      )}
    </ul>
  );
}

export default ContactsListUi;
