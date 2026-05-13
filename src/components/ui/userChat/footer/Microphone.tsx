"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import PopupHover from "@/components/common/PopupHover";

// => Icons
import { BiMicrophone } from "react-icons/bi";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useVoiceRecorder } from "@/hooks/voice_record/useVoiceRecorder";
import { useWaveform } from "@/hooks/voice_record/useWaveform";

// => Libs & Utils
import { formatTimeFromSeconds } from "@/utils/formatTimeFromSeconds";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface MicrophoneProps {
  handleSendVoice: (
    voiceUrl: string,
    size: number,
    duration: number | undefined,
  ) => void;
}

function Microphone({ handleSendVoice }: MicrophoneProps) {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const {
    isRecording,
    seconds,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useVoiceRecorder({
    onSend: handleSendVoice,
  });

  const { canvasRef } = useWaveform(isRecording);

  return (
    <div className="microphone relative group flex items-center justify-center">
      <div
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={cancelRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className="relative z-10"
      >
        <BiMicrophone
          className={`text-2xl cursor-pointer ${
            isRecording
              ? "text-red-500 animate-pulse"
              : "text-light-text dark:text-dark-text"
          }`}
        />
      </div>

      {!isRecording && <PopupHover title="Record" direction="top" />}

      <div
        className={`absolute bottom-full mb-2 flex flex-col items-center gap-1 transition ${
          isRecording ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-xs text-red-500">
          🔴 {formatTimeFromSeconds(seconds)}
        </span>
        <canvas ref={canvasRef} width={50} height={30} />
      </div>
    </div>
  );
}

export default Microphone;
