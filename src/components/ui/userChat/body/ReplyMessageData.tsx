"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import { Spinner } from "@/components/shadcn/spinner";

// => My Custom Components
import ReplyBox from "../ReplyBox";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect } from "react";

// => My Custom Hooks
import { useGetData } from "@/hooks/useGetData";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { Message } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ReplyMessageDataProps {
  userId: string;
  messageId: number;
}

function ReplyMessageData({ userId, messageId }: ReplyMessageDataProps) {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { isLoading, data, getDataFetchFunc, isError, statusNum } =
    useGetData<Message>();

  // => Use Effects
  useEffect(() => {
    if (!messageId) return;

    getDataFetchFunc({
      url: `api/messages/${messageId}`,
    });
  }, [messageId, getDataFetchFunc]);

  if (isError)
    return <span className="text-caption text-red">Error - {statusNum}</span>;

  if (isLoading) return <Spinner className="w-24 text-main" />;

  return (
    <>
      {data && (
        <div>
          <ReplyBox userId={userId} replyInfo={data} isIcon={false} />
        </div>
      )}
    </>
  );
}

export default ReplyMessageData;
