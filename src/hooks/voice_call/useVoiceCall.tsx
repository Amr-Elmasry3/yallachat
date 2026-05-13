"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect, useState, useRef } from "react";

// => My Custom Hooks
import { useSendNotifications } from "../notifications/useSendNotifications";
import { useCallTimer } from "./useCallTimer";
import { useCallRinging } from "./useCallRinging";
import { useCallMedia } from "./useCallMedia";
import { useCallSignaling } from "./useCallSignaling";
import { useCallRecording } from "./useCallRecording";
import { useCallTimeout } from "./useCallTimeout";
import { useIncomingCaller } from "./useIncomingCaller";

// => Libs & Utils
import { getAppUrl } from "@/utils/getAppUrl";

// => Libraries
import Peer, { MediaConnection, DataConnection } from "peerjs";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import {
  CallStatus,
  SignalData,
  UseVoiceCallReturn,
} from "@/components/ui/userChat/headr/phone_call/types";
import { OutgoingCallData } from "@/components/ui/userChat/headr/phone_call/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseVoiceCallProps {
  peer: Peer | null;
  userId: string;
  outgoingData?: OutgoingCallData | null;
  onCallEnd?: () => void;
}

export function useVoiceCall({
  peer,
  userId,
  outgoingData,
  onCallEnd,
}: UseVoiceCallProps): UseVoiceCallReturn {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [isOpen, setIsOpen] = useState(false);
  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(
    null,
  );
  const [activeCall, setActiveCall] = useState<MediaConnection | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");

  const callStatusRef = useRef<CallStatus>("idle");
  const outgoingCallRef = useRef<MediaConnection | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const answerTimeRef = useRef<Date | null>(null);
  const amICallerRef = useRef<boolean>(false);
  const isTimeoutRef = useRef<boolean>(false);

  // => Use Hooks
  const { callTime, startTimer, stopTimer } = useCallTimer();
  const { startRingtone, stopRingtone } = useCallRinging();
  const { localStreamRef, remoteAudioRef, toggleMute, toggleSpeaker } =
    useCallMedia();
  const { saveCallRecord } = useCallRecording(
    userId,
    outgoingData?.friendId,
    outgoingData?.conversationId,
  );
  const {
    createDataConnection,
    setDataConnection,
    sendSignal,
    closeDataConnection,
  } = useCallSignaling(peer, outgoingData?.friendId);
  const { startTimeout, clearCallTimeout } = useCallTimeout();
  const { incomingCallerData, setCaller, resetCaller } = useIncomingCaller();

  const { sendNotificationsFetchFunc } = useSendNotifications();

  // => Functions
  const resetAll = () => {
    stopRingtone();
    stopTimer();
    clearCallTimeout();
    resetCaller(); // Clean caller data
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (remoteAudioRef.current) {
      remoteAudioRef.current.pause();
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current = null;
    }

    closeDataConnection();
    outgoingCallRef.current = null;
    setIncomingCall(null);
    setActiveCall(null);
    setIsOpen(false);
    setCallStatus("idle");
    callStatusRef.current = "idle";
    startTimeRef.current = null;
    answerTimeRef.current = null;
    amICallerRef.current = false;
    isTimeoutRef.current = false;

    if (onCallEnd) {
      onCallEnd();
    }
  };

  const sendCancelSignal = () => {
    sendSignal({ type: "CALL_CANCELED" });
  };

  const endCall = () => {
    stopRingtone();
    clearCallTimeout();

    // The Caller Cancelled Before Answering.
    if (
      callStatusRef.current === "ringing" &&
      outgoingCallRef.current &&
      startTimeRef.current &&
      !isTimeoutRef.current
    ) {
      saveCallRecord(
        {
          status: "canceled",
          startedAt: startTimeRef.current.toISOString(),
          endedAt: new Date().toISOString(),
        },
        amICallerRef.current,
      );
    }

    // Call Ended After Answering
    if (
      callStatusRef.current === "in-call" &&
      startTimeRef.current &&
      answerTimeRef.current
    ) {
      const endTime = new Date();
      const duration =
        (endTime.getTime() - answerTimeRef.current.getTime()) / 1000;

      if (amICallerRef.current) {
        saveCallRecord(
          {
            status: "ended",
            startedAt: startTimeRef.current.toISOString(),
            answeredAt: answerTimeRef.current.toISOString(),
            endedAt: endTime.toISOString(),
            duration,
          },

          amICallerRef.current,
        );
      } else {
        // The Receiver Ends The Call - Sends A Signal To The Caller
        if (
          sendSignal({ type: "CALL_ENDED", endedAt: endTime.toISOString() })
        ) {
          setTimeout(() => {
            if (activeCall) activeCall.close();
            resetAll();
          }, 100);
          return;
        }
      }
    }

    if (callStatusRef.current === "ringing" && outgoingCallRef.current) {
      sendCancelSignal();
    }

    if (activeCall) activeCall.close();
    resetAll();
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    stopRingtone();
    clearCallTimeout();
    sendSignal({ type: "CALL_REJECTED" });
    incomingCall.close();
    resetAll();
  };

  const answerCall = async () => {
    if (!incomingCall) return;
    stopRingtone();
    clearCallTimeout();
    answerTimeRef.current = new Date();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    incomingCall.answer(stream);

    incomingCall.on("stream", (remoteStream) => {
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play();
      remoteAudioRef.current = audio;
      setCallStatus("in-call");
      callStatusRef.current = "in-call";
      startTimer();
    });

    setActiveCall(incomingCall);
    setIncomingCall(null);
  };

  const startCall = async () => {
    if (!peer || !outgoingData) return;

    amICallerRef.current = true;
    startTimeRef.current = new Date();
    setIsOpen(true);
    setCallStatus("ringing");
    callStatusRef.current = "ringing";
    startRingtone();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    const call = peer.call(outgoingData?.friendId, stream);

    // If The Call Recipient Is Not Connected To The Internet
    const offlineTimeout = setTimeout(() => {
      if (!outgoingCallRef.current && !activeCall) {
        saveCallRecord(
          {
            status: "missed",
            startedAt:
              startTimeRef.current?.toISOString() || new Date().toISOString(),
            endedAt: new Date().toISOString(),
          },
          amICallerRef.current,
        );

        sendNotificationsFetchFunc({
          url: "api/send-notifications",
          friendId: outgoingData.friendId,
          values: {
            title: outgoingData.friendName,
            body: "Missed call...",
            clickUrl: `${getAppUrl()}/dashboard/calls`,
            senderAvatar: outgoingData.friendImage || "",
          },
        });

        resetAll();
      }
    }, 5000);

    // If The Call Recipient Is Connected To The Internet
    if (call) {
      clearTimeout(offlineTimeout);

      outgoingCallRef.current = call;
      setActiveCall(call);

      sendNotificationsFetchFunc({
        url: "api/send-notifications",
        friendId: outgoingData.friendId,
        values: {
          title: outgoingData.friendName,
          body: "Voice call...",
          clickUrl: `${getAppUrl()}/chats/${outgoingData.conversationId}`,
          senderAvatar: outgoingData.friendImage || "",
        },
      });

      // 30-Second Deadline - If The Other Party Does Not Respond
      startTimeout(() => {
        if (
          callStatusRef.current === "ringing" &&
          outgoingCallRef.current &&
          startTimeRef.current
        ) {
          isTimeoutRef.current = true;

          saveCallRecord(
            {
              status: "missed",
              startedAt: startTimeRef.current.toISOString(),
              endedAt: new Date().toISOString(),
            },
            amICallerRef.current,
          );

          endCall();
        }
      }, 30000);

      const dataConn = createDataConnection();

      if (dataConn) {
        dataConn.on("open", () => console.log("📡 Data connection opened"));

        dataConn.on("data", (data: unknown) => {
          const parsedData = data as SignalData;
          if (parsedData.type === "CALL_REJECTED") {
            if (startTimeRef.current) {
              saveCallRecord(
                {
                  status: "rejected",
                  startedAt: startTimeRef.current.toISOString(),
                  endedAt: new Date().toISOString(),
                },
                amICallerRef.current,
              );
            }

            resetAll();
          }

          if (parsedData.type === "CALL_CANCELED") {
            resetAll();
          }

          if (parsedData.type === "CALL_MISSED") {
            if (startTimeRef.current) {
              saveCallRecord(
                {
                  status: "missed",
                  startedAt: startTimeRef.current.toISOString(),
                  endedAt: new Date().toISOString(),
                },
                amICallerRef.current,
              );
            }

            resetAll();
          }

          if (parsedData.type === "CALL_ENDED") {
            if (
              startTimeRef.current &&
              answerTimeRef.current &&
              parsedData.endedAt
            ) {
              const endTime = new Date(parsedData.endedAt);

              const duration =
                (endTime.getTime() - answerTimeRef.current.getTime()) / 1000;

              saveCallRecord(
                {
                  status: "ended",
                  startedAt: startTimeRef.current.toISOString(),
                  answeredAt: answerTimeRef.current.toISOString(),
                  endedAt: endTime.toISOString(),
                  duration,
                },
                amICallerRef.current,
              );
            }
            resetAll();
          }
        });
      }

      call.on("close", () => resetAll());

      call.on("stream", (remoteStream) => {
        stopRingtone();
        // Recording The Caller's Response Time (To Calculate The Duration If They Ended The Call)
        if (!answerTimeRef.current) {
          answerTimeRef.current = new Date();
        }

        clearCallTimeout();
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play();
        remoteAudioRef.current = audio;
        setCallStatus("in-call");
        callStatusRef.current = "in-call";
        startTimer();
      });
    }
  };

  useEffect(() => {
    if (!peer) return;

    const handleDataConnection = (conn: DataConnection) => {
      setDataConnection(conn);
      conn.on("data", (data: unknown) => {
        const parsedData = data as SignalData;
        if (parsedData.type === "CALL_CANCELED") {
          resetAll();
        }
      });
    };

    const handleCall = async (call: MediaConnection) => {
      const callerId = call.peer;
      await setCaller(callerId); // Fetch And Store Data

      amICallerRef.current = false;
      startTimeRef.current = new Date();
      setIncomingCall(call);
      setIsOpen(true);
      setCallStatus("ringing");
      callStatusRef.current = "ringing";
      startRingtone();

      // 30-Second Deadline For The Future
      startTimeout(() => {
        if (
          callStatusRef.current === "ringing" &&
          incomingCall &&
          startTimeRef.current
        ) {
          sendSignal({ type: "CALL_MISSED" });
          rejectCall();
        }
      }, 30000);

      call.on("close", () => resetAll());
    };

    peer.on("call", handleCall);
    peer.on("connection", handleDataConnection);

    return () => {
      peer.off("call", handleCall);
      peer.off("connection", handleDataConnection);
      clearCallTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peer]);

  return {
    isOpen,
    callStatus,
    callTime,
    incomingCall,
    activeCall,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    remoteAudioRef,
    toggleMute,
    toggleSpeaker,
    localStreamRef,
    incomingCallerData,
  };
}
