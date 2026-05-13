"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// => My Custom Hooks
import { useGetData } from "@/hooks/useGetData";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { Message, ConversationId, ConversationDetails } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseMessagesScrollProps {
  conversationId: ConversationId;
  messages: Message[];
  handleMessages: (update: (prev: Message[]) => Message[]) => void;
}
interface UseMessagesScrollReturn {
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  isLoading: boolean;
}

export function useMessagesScroll({
  conversationId,
  messages,
  handleMessages,
}: UseMessagesScrollProps): UseMessagesScrollReturn {
  // ******************* Inside Hook  *******************
  // => States & Refs
  const [isAtBottom, setIsAtBottom] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>(messages);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const preserveScrollRef = useRef(false);
  const previousScrollHeightRef = useRef(0);
  const previousScrollTopRef = useRef(0);
  const isAtBottomRef = useRef(true);

  // => Use Hooks
  const { getDataFetchFunc } = useGetData<ConversationDetails>();

  // => Functions
  // Function For Get Old Messages
  const loadOlderMessages = useCallback(
    async (beforeDate: string) => {
      try {
        const result = await getDataFetchFunc({
          url: `api/messages/old?conversationId=${conversationId}&before=${beforeDate}&limit=20`,
        });

        const oldMessage = result?.data.messages || [];

        handleMessages((prevMessages: Message[]) => [
          ...oldMessage,
          ...prevMessages,
        ]);

        hasMoreRef.current = result?.data.hasMore || false;
      } finally {
        isFetchingRef.current = false;
      }
    },
    [conversationId, getDataFetchFunc, handleMessages],
  );

  // => Use Effects
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const handleScrollToTop = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 48;
      isAtBottomRef.current = atBottom;
      setIsAtBottom(atBottom);
      const oldestMessage = messagesRef.current?.[0];

      if (
        !oldestMessage?.created_at ||
        el.scrollTop > 10 ||
        isFetchingRef.current ||
        el.scrollHeight <= el.clientHeight ||
        !hasMoreRef.current
      ) {
        return;
      }

      previousScrollHeightRef.current = el.scrollHeight;
      previousScrollTopRef.current = el.scrollTop;
      preserveScrollRef.current = true;
      isFetchingRef.current = true;

      loadOlderMessages(encodeURIComponent(oldestMessage.created_at));
    };

    el.addEventListener("scroll", handleScrollToTop);

    return () => {
      el.removeEventListener("scroll", handleScrollToTop);
    };
  }, [loadOlderMessages]);

  // Auto-Scroll To Bottom When Messages Change
  useLayoutEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    if (preserveScrollRef.current) {
      const scrollDiff = el.scrollHeight - previousScrollHeightRef.current;
      el.scrollTop = previousScrollTopRef.current + scrollDiff;
      preserveScrollRef.current = false;
      return;
    }

    if (isAtBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return {
    messagesContainerRef,
    isAtBottom,
    isLoading: isFetchingRef.current,
  };
}
