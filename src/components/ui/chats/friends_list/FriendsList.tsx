"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import FriendsListUi from "./FriendsListUi";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState, useCallback, useContext, useEffect } from "react";

// => My Custom Hooks
import { useSearch } from "@/hooks/useSearch";
import { useFriendsSubscription } from "@/hooks/friends/useFriendsSubscription";
import { useUser } from "@/hooks/user/useUser";

// => Contexts
import { SearchBoxContext } from "@/contexts/SearchBoxContext";

// => Libs & Utils
import { formatTimeFromISO } from "@/utils/formatTimeFromISO";
import { formatDateFromISO } from "@/utils/formatDateFromISO";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { FriendsData, Friend, LastMessage } from "@/lib/types";

function FriendsList({ count, friendsList }: FriendsData) {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { searchValue } = useContext(SearchBoxContext);

  // => States & Refs
  const [userId, setUserId] = useState<string | null>(null);
  const [friendsData, setFriendsData] = useState<FriendsData>({
    count,
    friendsList,
  });

  // => Use Hooks
  const { userIdFetchFunc } = useUser();

  // --- Filter List By Search ---
  const { filteredList } = useSearch({
    searchValue,
    originalList: friendsData.friendsList,
  });

  // => Use Effects
  // --- Get User ID ---
  useEffect(() => {
    const getUserId = async () => {
      const user = await userIdFetchFunc("api/user/userId");

      if (user && user.id) {
        setUserId(user.id);
      }
    };
    getUserId();
  }, [userIdFetchFunc]);

  // => Functions
  // --- Handle Last Message Time Format ---
  const handleLastMessageTime = (createdAt: string): string | null => {
    return formatDateFromISO(createdAt) === formatDateFromISO("")
      ? formatTimeFromISO(createdAt)
      : formatDateFromISO(createdAt);
  };

  // --- SUBSCRIPTION CALLBACKS ---
  // Handle Status Update From Users Table
  const onStatusUpdate = useCallback(
    (friendId: string, status: string, lastSeen: string) => {
      setFriendsData((prev) => ({
        ...prev,
        friendsList: prev.friendsList.map((friend) =>
          friend.id === friendId
            ? {
                ...friend,
                status: status as "online" | "offline",
                last_seen: lastSeen,
              }
            : friend,
        ),
      }));
    },
    [],
  );

  // Handle New Message (INSERT)
  const onMessageInsert = useCallback(
    (message: LastMessage, currentUserId: string | null) => {
      const conversationId = message.conversation_id;

      setFriendsData((prev) => {
        const updatedFriends = prev.friendsList.map((friend) => {
          if (friend.conversationId !== conversationId) return friend;

          const updatedFriend = { ...friend };

          updatedFriend.lastMessage = {
            id: message.id,
            content: message.content,
            type: message.type,
            media_urls: message.media_urls || [],
            metadata: message.metadata || null,
            created_at: message.created_at,
            sender_id: message.sender_id,
            status: message.status,
            isFromMe: message.sender_id === currentUserId,
          } as Friend["lastMessage"];

          if (
            message.sender_id !== currentUserId &&
            message.status !== "seen"
          ) {
            updatedFriend.unreadCount = (updatedFriend.unreadCount || 0) + 1;
          }

          return updatedFriend;
        });

        return { ...prev, friendsList: updatedFriends };
      });
    },
    [],
  );

  // Handle Message Update (UPDATE)
  const onMessageUpdate = useCallback(
    (message: LastMessage, currentUserId: string | null) => {
      const conversationId = message.conversation_id;

      setFriendsData((prev) => {
        const updatedFriends = prev.friendsList.map((friend) => {
          if (friend.conversationId !== conversationId) return friend;

          const updatedFriend = { ...friend };

          // Case: Message deleted
          if (message.is_deleted === true) {
            if (friend.lastMessage?.id === message.id) {
              updatedFriend.lastMessage = {
                ...updatedFriend.lastMessage,
                content: "Deleted message",
                type: "text",
                media_urls: [],
                metadata: null,
                isFromMe: message.sender_id === currentUserId,
              } as Friend["lastMessage"];
            }

            if (
              message.sender_id !== currentUserId &&
              message.status !== "seen"
            ) {
              updatedFriend.unreadCount = Math.max(
                0,
                (updatedFriend.unreadCount || 0) - 1,
              );
            }
          }
          // Case: Message seen
          else if (
            message.status === "seen" &&
            message.sender_id !== currentUserId
          ) {
            updatedFriend.unreadCount = 0;

            if (friend.lastMessage?.id === message.id) {
              updatedFriend.lastMessage = {
                ...updatedFriend.lastMessage,
                status: message.status,
              } as Friend["lastMessage"];
            }
          }

          return updatedFriend;
        });

        return { ...prev, friendsList: updatedFriends };
      });
    },
    [],
  );

  // ================ CALCULATE IDS ================
  const friendIds = friendsData.friendsList.map((f) => f.id).join(",");
  const conversationIds = friendsData.friendsList
    .map((f) => f.conversationId)
    .filter((id): id is number => id !== null)
    .join(",");

  // --- SUBSCRIPTION HOOK ---
  useFriendsSubscription({
    friendIds,
    conversationIds,
    userId,
    enabled: friendsData.friendsList.length > 0,
    onStatusUpdate,
    onMessageInsert,
    onMessageUpdate,
  });

  return (
    <FriendsListUi
      count={filteredList.count}
      friendsData={filteredList}
      handleLastMessageTime={handleLastMessageTime}
    />
  );
}

export default FriendsList;
