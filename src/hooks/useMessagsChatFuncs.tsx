"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useContext } from "react";

// => My Custom Hooks
import { useSonner } from "./useSonner";
import { useRemoveMessage } from "./messages/useRemoveMessage";

// => Contexts
import { ReplyInfoContext } from "@/contexts/ReplyInfoContext";
import { MediaCarouselContext } from "@/contexts/MediaCarouselContext";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { Message, UrlFile, FileData } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseMessagesChatFuncsReturn {
  dialoagMessagesChatFuncs: {
    deleteFunc: (orderType: string, payload?: Message) => void;
  };
  nonDialogMessagesChatFunc: {
    replyFunc: (payload?: Message) => void;
    copyFunc: (payload?: Message) => Promise<void>;
    downloadFunc: (payload?: Message) => void;
  };
}

export function useMessagesChatFuncs(): UseMessagesChatFuncsReturn {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { handleReplyInfo } = useContext(ReplyInfoContext);
  const { currentIndex } = useContext(MediaCarouselContext);

  // => Use Hooks
  const { showToast } = useSonner();
  const { removeMessageFetchFunc } = useRemoveMessage();

  // => Functions
  // [1] Reply Messages Chat (Text)
  const replyFunc = (payload?: Message): void => {
    if (!payload?.id) return;

    if (typeof currentIndex === "number") {
      const url = payload?.media_urls?.[currentIndex];
      const metadata = payload?.metadata?.[currentIndex];

      const newPayload = {
        ...payload,
        media_urls: [url as UrlFile],
        metadata: [metadata as FileData],
      };

      handleReplyInfo(newPayload);
    } else {
      handleReplyInfo(payload);
    }
  };

  // [2] Copy Messages Chat
  const copyFunc = async (payload?: Message): Promise<void> => {
    if (!payload?.content) return;

    try {
      await navigator.clipboard.writeText(payload?.content);

      showToast({
        type: "success",
        message: "Copied!",
      });
    } catch (error) {
      showToast({
        type: "error",
        message: error as string,
      });
    }
  };

  // [3] Download Messages Chat (Image, Video, Audio, Pdf)
  const downloadFunc = (payload?: Message): void => {
    if (!payload?.media_urls?.length) return;

    const downloadFile = (url: string) => {
      // This Is Step Because We Use Cloudinary To Upload Files
      const forcedUrl = url.replace("/upload/", "/upload/fl_attachment/");

      const link = document.createElement("a");

      link.href = forcedUrl;

      link.download = "file";

      link.click();
    };

    // For One Media => (From Carousel)
    if (typeof currentIndex === "number") {
      downloadFile(payload.media_urls[currentIndex] as string);
    }
    // For All Media => (From Chat Body)
    else {
      payload.media_urls.forEach((url, index) => {
        // We Use setTimeout Because The Browser Doesn`t Allow Multiple Downloads At The Same Time
        setTimeout(() => {
          downloadFile(url as string);
        }, index * 1200);
      });
    }
  };

  // [4] Delete Messages Chat
  const deleteFunc = (orderType: string, payload?: Message): void => {
    if (orderType === "ok") {
      // For One Media => (From Carousel)
      if (typeof currentIndex === "number") {
        removeMessageFetchFunc({
          url: `api/messages/${payload?.id}?imageIndex=${currentIndex}`,
        });
      }
      // For All Media => (From Chat Body)
      else {
        removeMessageFetchFunc({ url: `api/messages/${payload?.id}` });
      }
    }
  };

  // *********** Put All Profile Dropdwon Menu Functions  ***********
  // Functions Need Alert Dialog Before Work
  const dialoagMessagesChatFuncs = {
    deleteFunc,
  };

  // Functions Needn`t Alert Dialog Before Work
  const nonDialogMessagesChatFunc = {
    replyFunc,
    copyFunc,
    downloadFunc,
  };

  return { dialoagMessagesChatFuncs, nonDialogMessagesChatFunc };
}
