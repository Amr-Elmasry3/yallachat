import { Suspense } from "react";

// ************************ Ui Imports *************************
// => My Custom Components
import ContactsList from "./contacts_list/ContactsList";
import SearchBox from "@/components/common/SearchBox";
import ContactsListLoading from "@/components/loading/ContactsListLoading";
import ErrorState from "@/components/error_boundary/ErrorState";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { getData } from "@/lib/getData";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { FriendsApiData } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Variables
// --- To Make This Is Fetch => SSR ---
export const dynamic = "force-dynamic";

async function UserContacts() {
  // ******************* Inside The Component  *******************
  // => Functions
  const result = await getData<FriendsApiData>({ url: "api/friends" });

  if (!result?.success || !result) {
    return <ErrorState status={result?.status || 0} />;
  }

  return (
    <div className="user-contacts">
      <SearchBox placeholder="Search your contacts..." />

      <Suspense fallback={<ContactsListLoading />}>
        <ContactsList
          count={result.data?.count || 0}
          friendsList={result.data?.friends || []}
        />
      </Suspense>
    </div>
  );
}

export default UserContacts;
