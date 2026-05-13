"use client";

// ************************ Ui Imports *************************
// => Icons
import { BiPlay, BiPause } from "react-icons/bi";
import { MdKeyboardVoice } from "react-icons/md";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useWaveSurfer } from "@/hooks/useWaveSurfer";

// => Libs & Utils
import { formatTimeFromSeconds } from "@/utils/formatTimeFromSeconds";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface AudioPlayerProps {
  src: string;
  duration: number | undefined;
}

function AudioPlayer({ src, duration }: AudioPlayerProps) {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { waveRef, isPlaying, currentTime, togglePlay } = useWaveSurfer({
    src,
  });

  // => Variables
  // Display Time = Current Time + Total Time
  const displayCurrentTime = currentTime
    ? formatTimeFromSeconds(Math.floor(currentTime))
    : "00:00";
  const displayTotalTime = duration
    ? formatTimeFromSeconds(Math.floor(duration))
    : "00:00";

  return (
    <div className="bg-gray-light dark:bg-[#333333] p-2 rounded-8 flex items-center gap-2 max-xxs:min-w-60 min-w-65">
      <div className="bg-main w-9 h-9 rounded-circle flex items-center justify-center">
        <MdKeyboardVoice className="text-[18px] text-light-text" />
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <div ref={waveRef} className="flex-1" />

          <button
            onClick={togglePlay}
            className="text-heading3 text-gray dark:text-gray-light"
          >
            {isPlaying ? <BiPause /> : <BiPlay />}
          </button>
        </div>

        {duration && (
          <p className="w-full text-end text-[11px] font-medium text-light-text dark:text-dark-text">
            <span className="text-[10px]">{displayCurrentTime}</span> /{" "}
            {displayTotalTime}
          </p>
        )}
      </div>
    </div>
  );
}

export default AudioPlayer;
