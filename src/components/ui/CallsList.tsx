import { Suspense } from "react";

// ************************ Ui Imports *************************
// => My Custom Components
import PictureBadge from "../common/PictureBadge";
import CallsListLoading from "../loading/CallsListLoading";
import NotFoundData from "../common/NotFoundData";
import ErrorState from "../error_boundary/ErrorState";

// => Icons
import { BiSolidRightArrowAlt } from "react-icons/bi";
import { BiSolidPhoneCall } from "react-icons/bi";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { formatTimeFromSeconds } from "@/utils/formatTimeFromSeconds";
import { formatDateFromISO } from "@/utils/formatDateFromISO";
import { formatTimeFromISO } from "@/utils/formatTimeFromISO";
import { getData } from "@/lib/getData";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { CallsData } from "@/lib/types";

async function CallsList() {
  // ******************* Inside The Component  *******************
  // => Functions
  const result = await getData<CallsData>({ url: "api/calls" });

  if (!result?.success || !result) {
    return <ErrorState status={result?.status || 0} />;
  }

  return (
    <Suspense fallback={<CallsListLoading />}>
      {result.data?.calls && result.data?.calls.length ? (
        <div className="calls-list">
          <ul className="flex flex-col divide-y divide-gray-light dark:divide-gray">
            {result.data.calls.map((item) => {
              return (
                <li
                  key={item.id}
                  className="py-4 flex items-center gap-2 cursor-pointer"
                >
                  <div className="left flex-1 flex items-center gap-2">
                    <div className="relative flex items-center">
                      <PictureBadge
                        name={
                          item.caller_id === result.data?.userId
                            ? item.receiver?.username || ""
                            : item.caller?.username || ""
                        }
                        srcImg={
                          item.caller_id === result.data?.userId
                            ? item.receiver?.profile_image
                            : item.caller?.profile_image
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className=" text-light-text dark:text-dark-text capitalize">
                        {item.caller_id === result.data?.userId
                          ? item.receiver?.username
                          : item.caller?.username}
                      </span>

                      <div className="flex items-center gap-1">
                        <BiSolidRightArrowAlt
                          className={`${item.status === "ended" ? "text-success" : "text-danger"} ${item.caller_id === result.data?.userId ? "-rotate-45" : "rotate-135"}`}
                        />

                        <p className="text-smallCaption text-light-description dark:text-dark-description text-nowrap line-clamp-1">
                          {formatDateFromISO(item.started_at)}{" "}
                          {formatTimeFromISO(item.started_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="right flex items-center gap-2">
                    <span className="text-smallCaption text-light-text dark:text-dark-text">
                      {item.duration
                        ? formatTimeFromSeconds(item.duration)
                        : item.status}
                    </span>

                    <BiSolidPhoneCall className="min-w-fit text-subHeading text-dark-main" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <NotFoundData title="no calls" />
      )}
    </Suspense>
  );
}

export default CallsList;
