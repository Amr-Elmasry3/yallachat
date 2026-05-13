"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import Link from "next/link";

// => My Custom Components
import PictureBadge from "@/components/common/PictureBadge";
import NotFoundData from "@/components/common/NotFoundData";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { FriendsData } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface FriendsListUiProps {
  count: number;
  friendsData: FriendsData;
  handleLastMessageTime: (createdAt: string) => string | null;
}

function FriendsListUi({
  count,
  friendsData,
  handleLastMessageTime,
}: FriendsListUiProps) {
  return (
    <ul className="friends-list flex flex-col mt-3 divide-y divide-gray-light dark:divide-gray max-h-90 overflow-scroll my-scrollbar">
      {count && friendsData.friendsList.length ? (
        friendsData.friendsList.map((friend) => {
          return (
            <li key={friend.id}>
              <Link
                href={`/dashboard/chats/${friend.conversationId}`}
                className="flex items-center gap-2 py-3.5"
              >
                {/* Friend Image & Status */}
                <div className="friend-img relative">
                  <PictureBadge
                    name={friend.username}
                    srcImg={friend.profile_image}
                  />
                  <span
                    className={`status absolute w-2 h-2 rounded-circle bottom-0.5 right-1 ${friend.status === "online" ? "black" : "hidden"} bg-green-600 outline-2 outline-solid outline-white`}
                  ></span>
                </div>

                {/* Friend Name & Last Message */}
                <div className="flex-1">
                  <span className="friend-name text-caption font-medium text-light-text dark:text-dark-text capitalize">
                    {friend.username}
                  </span>

                  {friend.lastMessage ? (
                    <p className="text-caption text-light-description dark:text-dark-description line-clamp-1">
                      <span className="text-smallCaption">
                        {friend.lastMessage?.isFromMe
                          ? "You"
                          : friend.username.split(" ")[0]}
                        :{" "}
                      </span>{" "}
                      {friend.lastMessage.content
                        ? friend.lastMessage.content
                        : friend.lastMessage.media_urls
                          ? friend.lastMessage.media_urls.length +
                            " " +
                            (friend.lastMessage.metadata?.[0].fileType ||
                              "file") +
                            " message"
                          : null}
                    </p>
                  ) : null}
                </div>

                {/* Last Message Time & Unread Messages Count */}
                <div className="flex flex-col items-center gap-1.5">
                  {friend.lastMessage ? (
                    <span className="last-message-time text-[11px] text-light-text font-medium dark:text-dark-description">
                      {handleLastMessageTime(friend.lastMessage.created_at)}
                    </span>
                  ) : null}

                  {friend.unreadCount ? (
                    <span className="unread-messages-count bg-main w-4 h-4 rounded-circle flex items-center justify-center text-[10px] text-white">
                      {friend.unreadCount}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })
      ) : (
        <NotFoundData title="no friends" />
      )}
    </ul>
  );
}

export default FriendsListUi;
