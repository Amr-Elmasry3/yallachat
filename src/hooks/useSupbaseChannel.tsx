"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect } from "react";

// => Libs & Utils
import { supabaseClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { PostgresChangePayload } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
type ChannelEvent = "INSERT" | "UPDATE" | "DELETE" | "*";
interface EventConfig {
  event: ChannelEvent;
  schema: string;
  table: string;
  filter?: string;
  callback: (payload: PostgresChangePayload) => void;
}
interface UseSupabaseChannelProps {
  channelName: string;
  events: EventConfig[];
  enabled?: boolean;
}

export function useSupabaseChannel({
  channelName,
  events,
  enabled = true,
}: UseSupabaseChannelProps) {
  // ******************* Inside Hook  *******************
  // => Use Effects
  useEffect(() => {
    if (!enabled || !events.length) return;

    let channel: RealtimeChannel;

    const setupChannel = () => {
      channel = supabaseClient.channel(`${channelName}-${Date.now()}`);

      // Register All Event Listeners
      events.forEach(({ event, schema, table, filter, callback }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventConfig: any = {
          event,
          schema,
          table,
        };

        if (filter) {
          eventConfig.filter = filter;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        channel = channel.on("postgres_changes", eventConfig, callback as any);
      });

      // Subscribe to the channel
      channel.subscribe();
    };

    setupChannel();

    return () => {
      if (channel) {
        supabaseClient.removeChannel(channel);
      }
    };
    // Only Depend Dn ChannelName And Enabled
    // Don't Include Events Or Dependencies To Prevent Infinite Loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, enabled]);
}
