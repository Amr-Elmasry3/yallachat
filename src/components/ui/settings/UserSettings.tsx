import { Suspense } from "react";

// ************************ Ui Imports *************************
// => My Custom Components
import EditInfo from "./EditInfo";
import PersonalInfo from "./PersonalInfo";
import EditInfoLoading from "@/components/loading/EditInfoLoading";
import PersonalInfoLoading from "@/components/loading/PersonalInfoLoading";
import ErrorState from "@/components/error_boundary/ErrorState";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { getData } from "@/lib/getData";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { UserInfo } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Variables
// --- To Make This Is Fetch => SSR ---
export const dynamic = "force-dynamic";

async function UserSettings() {
  // ******************* Inside The Component  *******************
  // => Functions
  const result = await getData<UserInfo>({ url: "api/user" });

  if (!result?.success || !result) {
    return <ErrorState status={result?.status || 0} />;
  }

  return (
    <div className="user-settings">
      <Suspense fallback={<EditInfoLoading />}>
        <EditInfo
          srcImg={result.data?.profile_image as string}
          name={result.data?.username as string}
          bio={result.data?.bio as string}
        />
      </Suspense>

      <Suspense fallback={<PersonalInfoLoading />}>
        <PersonalInfo data={result.data as UserInfo} />
      </Suspense>
    </div>
  );
}

export default UserSettings;
