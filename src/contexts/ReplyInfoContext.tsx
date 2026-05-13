"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { createContext, useState } from "react";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { Message } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ReplyInfoProps {
  children: React.ReactNode;
}
type ReplyInfo = Message | null;
type Context = {
  replyInfo: ReplyInfo;
  handleReplyInfo: (info: ReplyInfo | null) => void;
};

// => Variables
export const ReplyInfoContext = createContext<Context>({
  replyInfo: null,
  handleReplyInfo: () => {},
});

export default function ReplyInfoProvider({ children }: ReplyInfoProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [replyInfo, setReplyInfo] = useState<ReplyInfo>(null);

  // => Functions
  const handleReplyInfo = (info: ReplyInfo): void => {
    setReplyInfo(info);
  };

  return (
    <ReplyInfoContext.Provider
      value={{ replyInfo, handleReplyInfo: handleReplyInfo }}
    >
      {children}
    </ReplyInfoContext.Provider>
  );
}
