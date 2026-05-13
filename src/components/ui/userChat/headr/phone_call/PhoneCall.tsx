"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import OverlayBox from "@/components/layouts/OverlayBox";
import CallHeader from "./CallHeadr";
import CallActions from "./CallActions";
import CallFooter from "./CallFooter";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect, useRef } from "react";

// => My Custom Hooks
import { useVoiceCall } from "@/hooks/voice_call/useVoiceCall";

// => Libs & Utils
import Peer from "peerjs";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { OutgoingCallData } from "./types";

// Interfaces & Types
interface PhoneCallProps {
  peer: Peer | null;
  userId: string;
  outgoingData?: OutgoingCallData | null;
  onCallEnd?: () => void;
}

export default function PhoneCall({
  peer,
  userId,
  outgoingData,
  onCallEnd,
}: PhoneCallProps) {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const {
    isOpen,
    callStatus,
    callTime,
    incomingCall,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleSpeaker,
    localStreamRef,
    remoteAudioRef,
    incomingCallerData,
  } = useVoiceCall({
    peer,
    userId,
    outgoingData: outgoingData,
    onCallEnd,
  });

  // => States & Refs
  const startCallRef = useRef(startCall);

  // => Use Effects
  useEffect(() => {
    startCallRef.current = startCall;
  }, [startCall]);

  useEffect(() => {
    if (outgoingData) {
      startCallRef.current();
    }
  }, [outgoingData]);

  // => Variables
  const displayName =
    incomingCallerData?.name || outgoingData?.friendName || "";

  const displayImage =
    incomingCallerData?.image || outgoingData?.friendImage || null;

  return (
    <div className="phone-call">
      {isOpen && (
        <OverlayBox>
          <div className="w-80 bg-white dark:bg-gray-dark rounded-8 pt-6 flex flex-col items-center overflow-hidden">
            <CallHeader
              friendImage={displayImage}
              friendName={displayName}
              callStatus={callStatus}
              callTime={callTime}
            />

            <CallActions
              isOpen={isOpen}
              toggleMute={toggleMute}
              toggleSpeaker={toggleSpeaker}
              localStreamRef={localStreamRef}
              remoteAudioRef={remoteAudioRef}
            />

            <CallFooter
              friendName={displayName}
              showAnswerButton={!!incomingCall}
              onAnswer={answerCall}
              onEndOrReject={() => (incomingCall ? rejectCall() : endCall())}
            />
          </div>
        </OverlayBox>
      )}
    </div>
  );
}
