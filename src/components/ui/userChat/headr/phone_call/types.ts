import Peer, { MediaConnection } from "peerjs";

import { ConversationId } from "@/lib/types";

export interface SignalData {
  type: "CALL_REJECTED" | "CALL_CANCELED" | "CALL_MISSED" | "CALL_ENDED";
  endedAt?: string;
}

export interface CallAction {
  id: number;
  title: "mute" | "speaker";
  icon: React.ReactNode;
  active: boolean;
}

export type CallStatus = "idle" | "ringing" | "in-call";

export type CallerData = {
  name: string | undefined;
  image: string | null | undefined;
};

export interface UseVoiceCallProps {
  peer: Peer | null;
  userId: string;
  outgoingData?: OutgoingCallData | null;
  onCallEnd?: () => void;
}

export type ToggleMute = (stream: MediaStream | null) => void;
export type ToggleSpeaker = (
  audioRef: React.RefObject<HTMLAudioElement | null>,
) => void;
export type LocalStreamRef = React.RefObject<MediaStream | null>;
export type RemoteAudioRef = React.RefObject<HTMLAudioElement | null>;

export interface UseVoiceCallReturn {
  // States
  isOpen: boolean;
  callStatus: CallStatus;
  callTime: number;
  incomingCall: MediaConnection | null;
  activeCall: MediaConnection | null;
  incomingCallerData: CallerData | null;

  // Functions
  startCall: () => Promise<void>;
  answerCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: ToggleMute;
  toggleSpeaker: ToggleSpeaker;

  // Refs
  localStreamRef: LocalStreamRef;
  remoteAudioRef: RemoteAudioRef;
}

export interface CallBody {
  callerId: string;
  receiverId: string;
  conversationId: ConversationId;
  status: "ended" | "rejected" | "canceled" | "missed";
  startedAt: string;
  answeredAt?: string;
  endedAt: string;
  duration?: number;
}

export interface OutgoingCallData {
  friendId: string;
  friendName: string;
  friendImage: string | null;
  conversationId: ConversationId;
}
