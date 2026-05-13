// *********************** Logic Imports ***********************
// => Libraries
import ReactPlayer from "react-player";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface VideoFilesProps {
  src: string;
}

function VideoFiles({ src }: VideoFilesProps) {
  return (
    <ReactPlayer src={src} controls className="rounded-8 w-full! h-full!" />
  );
}

export default VideoFiles;
