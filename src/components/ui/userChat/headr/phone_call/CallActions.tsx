"use client";

// ************************ Ui Imports *************************
// => Icons
import { BiMicrophoneOff, BiVolumeFull } from "react-icons/bi";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect, useState } from "react";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import {
  CallAction,
  ToggleMute,
  ToggleSpeaker,
  LocalStreamRef,
  RemoteAudioRef,
} from "./types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface CallActionsProps {
  isOpen: boolean;
  toggleMute: ToggleMute;
  toggleSpeaker: ToggleSpeaker;
  localStreamRef: LocalStreamRef;
  remoteAudioRef: RemoteAudioRef;
}

// => Variables
const initialCallActions: CallAction[] = [
  {
    id: 1,
    title: "mute",
    icon: <BiMicrophoneOff />,
    active: false,
  },
  {
    id: 2,
    title: "speaker",
    icon: <BiVolumeFull />,
    active: false,
  },
];

function CallActions({
  isOpen,
  toggleMute,
  toggleSpeaker,
  localStreamRef,
  remoteAudioRef,
}: CallActionsProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [callActionsState, setCallActionsState] = useState(initialCallActions);

  // => Functions
  const handleCallActions = (id: number) => {
    setCallActionsState((prev) => {
      const newState = prev.map((item) => ({
        ...item,
        active: item.id === id ? !item.active : false,
      }));

      const currentItem = newState[id - 1];

      if (currentItem.title === "mute") {
        toggleMute(localStreamRef.current);
      } else if (currentItem.title === "speaker") {
        toggleSpeaker(remoteAudioRef);
      }

      return newState;
    });
  };

  // => Use Hooks
  useEffect(() => {
    if (isOpen) return;

    const resetActionsState = () => {
      setCallActionsState(initialCallActions);
    };

    resetActionsState();
  }, [isOpen]);

  return (
    <ul className="call-actions flex items-center gap-5 mt-3 mb-6">
      {callActionsState.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-2 items-center cursor-pointer"
          onClick={() => handleCallActions(item.id)}
        >
          <span
            className={`icon-box text-[18px] ${
              item.active
                ? "bg-main text-white"
                : "bg-gray-300 dark:bg-dark-bg text-light-text dark:text-dark-text"
            } w-10 h-10 rounded-circle flex items-center justify-center`}
          >
            {item.icon}
          </span>
          <span className="title text-[11px] font-medium text-light-text dark:text-dark-text uppercase">
            {item.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default CallActions;
