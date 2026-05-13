import { Suspense } from "react";

// ************************ Ui Imports *************************
// => My Custom Components
import ChatsHeading from "./ChatsHeading";
import SearchBox from "@/components/common/SearchBox";
import AddNewFriends from "@/components/modals/add-new-friends/AddNewFriends";
import FriendsList from "./friends_list/FriendsList";
import FriendsListLoading from "@/components/loading/FriendsListLoading";
import ErrorState from "@/components/error_boundary/ErrorState";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { getData } from "@/lib/getData";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { FriendsApiData } from "@/lib/types";

// => Varaiables
// To Make This Is Fetch => SSR
export const dynamic = "force-dynamic";

async function ChatFriends() {
  // ******************* Inside The Component  *******************
  // => Functions
  const result = await getData<FriendsApiData>({ url: "api/friends" });

  if (!result?.success || !result) {
    return <ErrorState status={result?.status || 0} />;
  }

  return (
    <div className="chat-friends mb-10">
      <SearchBox placeholder="Search your friend..." />

      <div className="mt-8">
        <ChatsHeading title="Friends" popup="new friend" typeModal="friends" />

        <Suspense fallback={<FriendsListLoading />}>
          <FriendsList
            count={result?.data?.count || 0}
            friendsList={result?.data?.friends || []}
          />
        </Suspense>
      </div>

      {/* Add New Friends Modal */}
      <AddNewFriends />
    </div>
  );
}

export default ChatFriends;
