"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import ContactsListUi from "./ContactsListUi";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState, useCallback, useContext } from "react";

// => My Custom Hooks
import { useSearch } from "@/hooks/useSearch";
import { useSupabaseChannel } from "@/hooks/useSupbaseChannel";

// => Contexts
import { SearchBoxContext } from "@/contexts/SearchBoxContext";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { FriendsData, Friend, PostgresChangePayload } from "@/lib/types";
import { MyDropdownMenu } from "@/Data";

// => Varaiables
import { contactsDropdwonMenu } from "@/Data";

function ContactsList({ count, friendsList }: FriendsData) {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { searchValue } = useContext(SearchBoxContext);

  // => States & Refs
  const [contactsList, setContactsList] = useState<FriendsData>({
    count,
    friendsList: friendsList.sort((a, b) =>
      (a.username || "").localeCompare(b.username || ""),
    ),
  });

  // => Use Hooks
  // --- Filter List By Search ---
  const { filteredList } = useSearch({
    searchValue,
    originalList: contactsList.friendsList,
  });

  // => Functions
  // --- Get First Letter From Username ---
  const getFirstLetter = (value: string): string => {
    return value.slice(0, 1);
  };

  // --- Check First Letters (Friend, Next Friend) ---
  const checkFirstCharacters = (userOne: string, userTwo: string): boolean => {
    const firstUser: string = getFirstLetter(userOne);
    const secondUser: string = getFirstLetter(userTwo);

    return firstUser === secondUser || firstUser === secondUser.toUpperCase();
  };

  // --- Set Payload In Contacts Dropdwon Menu ---
  const handleContactsPayload = (payload: Friend): MyDropdownMenu[] => {
    return contactsDropdwonMenu.map((item) => {
      return { ...item, payload: payload };
    });
  };

  // --- Handle Friend Deletion From Real-time Updates ---
  const handleFriendshipDelete = useCallback(
    (payload: PostgresChangePayload) => {
      const deletedFriend = contactsList.friendsList.find((friend) => {
        return friend.friendshipId === (payload.old.id as number);
      });

      if (deletedFriend) {
        const newContactsList = contactsList.friendsList.filter((friend) => {
          return friend.friendshipId !== payload.old.id;
        });

        setContactsList({
          count: newContactsList.length,
          friendsList: newContactsList,
        });
      }
    },
    [contactsList.friendsList],
  );

  // --- Setup Supabase Real-time Changes ---
  useSupabaseChannel({
    channelName: "friendships",
    events: [
      {
        event: "DELETE",
        schema: "public",
        table: "friendships",
        callback: handleFriendshipDelete,
      },
    ],
    enabled: contactsList.friendsList.length > 0,
  });

  return (
    <ContactsListUi
      count={filteredList.count}
      contactsList={filteredList}
      getFirstLetter={getFirstLetter}
      checkFirstCharacters={checkFirstCharacters}
      handleContactsPayload={handleContactsPayload}
    />
  );
}

export default ContactsList;
