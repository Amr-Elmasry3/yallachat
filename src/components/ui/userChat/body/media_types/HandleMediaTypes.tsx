// ************************ Ui Imports *************************
// => My Custom Components
import ImageFiles from "./ImageFiles";
import VideoFiles from "./VideoFiles";
import AnotherFilesType from "./AnotherFilesType";
import AudioPlayer from "./AudioPlayer";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface HandleMediaTypesProps {
  mediaType: string;
  src: string;
  fileName: string;
  fileSize: number;
  duration: number | undefined;
}

function HandleMediaTypes({
  mediaType,
  src,
  fileName,
  fileSize,
  duration,
}: HandleMediaTypesProps) {
  switch (mediaType) {
    // Case One => Url Type For Image
    case "image":
      return <ImageFiles src={src} alt={fileName} />;
    // Case Two => Url Type For Video
    case "video":
      return <VideoFiles src={src} />;

    // Case Three => Url Type For Audio
    case "audio":
    case "voice":
      return <AudioPlayer src={src} duration={duration} />;
    // Case Four => Url Doesn`t For (Image | Video | Audio)
    default:
      return <AnotherFilesType fileName={fileName} fileSize={fileSize} />;
  }
}

export default HandleMediaTypes;
