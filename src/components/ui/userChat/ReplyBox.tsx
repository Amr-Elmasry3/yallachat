"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import CloseIcon from "@/components/common/CloseIcon";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { formatTimeFromSeconds } from "@/utils/formatTimeFromSeconds";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { Message } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ReplyBoxProps {
  userId: string;
  replyInfo: Message;
  isIcon: boolean;
  handleReplyInfo?: (info: null) => void;
}

function ReplyBox({
  userId,
  replyInfo,
  isIcon,
  handleReplyInfo,
}: ReplyBoxProps) {
  return (
    <div className="bg-[#4eac6d1a] flex items-center gap-3 py-2.5 px-4 rounded-8 border-l-3 border-l-solid border-l-main overflow-hidden">
      {!replyInfo.is_deleted ? (
        <div className="">
          <span className="onwer-message block text-caption font-medium text-main">
            {userId === replyInfo.sender_id ? "You" : replyInfo.sender.username}
          </span>

          {replyInfo.content && (
            <p className="text-caption text-light-text dark:text-dark-text line-clamp-3">
              {replyInfo.content}
            </p>
          )}

          {replyInfo?.media_urls?.length ? (
            <div className="flex flex-col gap-1 mt-1">
              <span className="count-media text-caption text-light-description dark:text-dark-description">
                {replyInfo.media_urls.length}{" "}
                {replyInfo?.metadata?.[0]?.fileType} message
              </span>

              <ul className="flex items-center gap-1">
                {replyInfo?.metadata?.map((item) => {
                  return (
                    item.duration && (
                      <li
                        className="text-[10px] text-light-description dark:text-dark-description"
                        key={item.fileName}
                      >
                        (
                        {formatTimeFromSeconds(
                          Number(item?.duration?.toFixed(0)),
                        )}
                        )
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <span className="text-caption text-red">Deleted message</span>
      )}

      {isIcon && handleReplyInfo ? (
        <CloseIcon
          handleClose={() => {
            handleReplyInfo(null);
          }}
        />
      ) : null}
    </div>
  );
}

export default ReplyBox;
