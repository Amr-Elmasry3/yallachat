"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import Attached from "./Attached";
import EmojiesPicker from "./EmojiesPicker";
import TypeTextarea from "./TypeTextarea";
import Microphone from "./Microphone";
import SendButton from "./SendButton";
import ReplyBox from "../ReplyBox";

// => Icons
import { BsX } from "react-icons/bs";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useCallback, useState, useContext } from "react";

// => My Custom Hooks
import { useSend } from "@/hooks/chat/useSend";
import { useUploadFiles } from "@/hooks/useUploadFiles";
import { useSendNotifications } from "@/hooks/notifications/useSendNotifications";

// => Contexts
import { ReplyInfoContext } from "@/contexts/ReplyInfoContext";

// => Libs & Utils
import { getAppUrl } from "@/utils/getAppUrl";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { FileValues, UrlFile, FileData } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UserChatFooterProps {
  conversationId: number | null;
  userId: string;
  username: string;
  userImage: string | null;
  friendId: string;
}

function UserChatFooter({
  conversationId,
  userId,
  friendId,
  username,
  userImage,
}: UserChatFooterProps) {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { replyInfo, handleReplyInfo } = useContext(ReplyInfoContext);

  // => States & Refs
  const [messageValue, setMessageValue] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | []>([]);
  const [avaiableSend, setAvaiableSend] = useState<boolean>(false);

  // => Use Hooks
  const { isLoading, sendMessagsFetchFunc } = useSend();
  const { loading, uploadFilesFunc } = useUploadFiles();
  const { sendNotificationsFetchFunc } = useSendNotifications();

  // => Functions
  // --- Handle Button Ui ---
  const handleAvaiableSend = useCallback(
    (value: boolean) => {
      if (avaiableSend === value) return;

      setAvaiableSend(value);
    },
    [avaiableSend],
  );

  // --- Handle Message Value => (Text) ---
  const handleMessageValue = (value: string): void => {
    handleAvaiableSend(Boolean(value.trim() || selectedFiles.length > 0));

    setMessageValue(value);
  };

  // --- Handle Emojies => (Add Emojies To Text) ---
  const handlePickEmoji = (emoji: string): void => {
    handleAvaiableSend(
      Boolean((messageValue + emoji).trim() || selectedFiles.length > 0),
    );

    setMessageValue(messageValue + emoji);
  };

  // --- Handle Selected Files ---
  const handleSelectedFiles = (files: FileList | []): void => {
    setSelectedFiles(files);

    handleAvaiableSend(Boolean(messageValue.trim() || files.length > 0));
  };

  // --- Handle Attachments => (Images, Videos, Audios, Pdf) ---
  const handleSelectedFilesData = (atts: (FileValues | undefined)[]) => {
    const urls: UrlFile[] = atts.map((file) => file?.urlFile || "");
    const data: FileData[] = atts.map((file) => {
      return {
        fileType: file?.fileType || "",
        fileSize: file?.fileSize || 0,
        fileName: file?.fileName || "",
        duration: file?.duration || undefined,
      };
    });

    return { urls, data };
  };

  // --- Handle Close Attachments Alert ---
  const handleCloseSelectedFilesAlert = (): void => {
    // Reset Selected Files
    handleSelectedFiles([]);
  };

  // --- Handle Click Send Button ---
  const handleClickSend = async (): Promise<void> => {
    if (avaiableSend) {
      if (userId && conversationId) {
        const filesData = await uploadFilesFunc({ files: selectedFiles });

        const { urls, data } = handleSelectedFilesData(filesData);

        const values = {
          conversationId,
          senderId: userId,
          content: messageValue || null,
          replyToId: replyInfo?.id || null,
          type: urls.length ? "file" : "text",
          mediaUrls: urls,
          fileData: data,
        };

        // Send Message
        await sendMessagsFetchFunc({ url: "api/messages", values });

        // Send Notification
        await sendNotificationsFetchFunc({
          url: "api/send-notifications",
          friendId,
          values: {
            title: username,
            body: messageValue || `${urls.length} ${data[0].fileType}`,
            clickUrl: `${getAppUrl()}/dashboard/chats/${conversationId}`,
            senderAvatar: userImage || "",
          },
        });

        // Reset Message Value
        handleMessageValue("");

        // Reset Selected Files
        handleSelectedFiles([]);

        // Reset Reply Info
        handleReplyInfo(null);
      }
    }
  };

  // --- Handle Send Voice ---
  const handleSendVoice = async (
    voiceUrl: string,
    size: number,
    duration: number | undefined,
  ): Promise<void> => {
    if (userId && conversationId) {
      const values = {
        conversationId,
        senderId: userId,
        content: messageValue || null,
        replyToId: replyInfo?.id || null,
        type: "file",
        mediaUrls: [voiceUrl],
        fileData: [
          {
            fileType: "voice",
            fileSize: size,
            fileName: "audio-voice",
            isVoice: true,
            duration,
          },
        ],
      };

      // Send Voice Message
      await sendMessagsFetchFunc({ url: "api/messages", values });

      // Send Notification
      await sendNotificationsFetchFunc({
        url: "api/send-notifications",
        friendId,
        values: {
          title: username,
          body: "Voice message",
          clickUrl: `${getAppUrl()}/dashboard/chats/${conversationId}`,
          senderAvatar: userImage || "",
        },
      });

      // Reset Reply Id
      handleReplyInfo(null);
    }
  };

  return (
    <div className="user-chat-footer relative bg-[#ffffff0d] dark:bg-[#2e2e2e80] min-h-20 p-4 flex flex-col gap-1 border-t-2 dark:border-t border-t-solid border-t-[#eaeaf1] dark:border-t-gray">
      {replyInfo?.id ? (
        <div className="absolute z-20 top-0 left-0 -translate-y-full bg-white dark:bg-gray-dark w-full py-4 px-5.5 border-y border-y-solid border-y-gray-light dark:border-y-gray">
          <ReplyBox
            userId={userId}
            replyInfo={replyInfo}
            isIcon={true}
            handleReplyInfo={handleReplyInfo}
          />
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <Attached handleSelectedFiles={handleSelectedFiles} />

        <EmojiesPicker handlePickEmoji={handlePickEmoji} />

        <TypeTextarea
          value={messageValue}
          handleOnChange={handleMessageValue}
        />

        <Microphone handleSendVoice={handleSendVoice} />

        <SendButton
          avaiableSend={avaiableSend}
          isLoading={isLoading || loading}
          handleClick={handleClickSend}
        />
      </div>

      <div
        className={`w-full bg-dark-bg rounded-20 py-2 px-3 ${selectedFiles.length && selectedFiles.length ? "flex" : "hidden"} items-center gap-3`}
      >
        <p className="flex-1 text-caption text-dark-text">
          You have selected {selectedFiles.length} files
        </p>

        <BsX
          className="text-subHeading text-dark-text cursor-pointer"
          onClick={handleCloseSelectedFilesAlert}
        />
      </div>
    </div>
  );
}

export default UserChatFooter;
