"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/shadcn/carousel";

// => My Custom Components
import CloseIcon from "@/components/common/CloseIcon";
import HandleMediaTypes from "./media_types/HandleMediaTypes";
import MyDropdown from "@/components/common/MyDropdown";
import OverlayBox from "@/components/layouts/OverlayBox";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState, useEffect, useContext } from "react";

// => Contexts
import { MediaCarouselContext } from "@/contexts/MediaCarouselContext";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { UrlFile, FileData } from "@/lib/types";
import { MyDropdownMenu } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface MediaCarouselProps {
  isCarousel: boolean;
  handleIsCarousel: () => void;
  mediaUrls: UrlFile[];
  filesData: FileData[];
  mediaMessageDropdwonMenu: MyDropdownMenu[];
}

function MediaCarousel({
  isCarousel,
  handleIsCarousel,
  mediaUrls,
  filesData,
  mediaMessageDropdwonMenu,
}: MediaCarouselProps) {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { handleCurrentIndex } = useContext(MediaCarouselContext);

  // => States & Refs
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count] = useState(mediaUrls.length);

  // => Use Effects
  useEffect(() => {
    if (mediaUrls.length === 0 || !api) {
      return;
    }

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap() + 1);

      if (isCarousel) {
        handleCurrentIndex(api.selectedScrollSnap());
      } else {
        handleCurrentIndex(null);
      }
    };

    updateCurrent();
    api.on("select", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
    };
  }, [api, mediaUrls.length, isCarousel, handleCurrentIndex]);

  return isCarousel ? (
    <OverlayBox>
      <div className="media-carousel w-full">
        <CloseIcon handleClose={handleIsCarousel} />

        <div className="flex flex-col gap-3 items-center justify-center p-12 h-full">
          <Carousel setApi={setApi} className="w-full max-w-xl">
            <CarouselContent>
              {mediaUrls.map((item, index) => {
                return (
                  <CarouselItem key={filesData[index].fileName}>
                    <HandleMediaTypes
                      mediaType={filesData[index].fileType}
                      src={item as string}
                      fileName={filesData[index].fileName}
                      fileSize={filesData[index].fileSize}
                      duration={filesData[index].duration}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious />

            <CarouselNext />

            {/* Dropdwon Menu For Each Item */}
            <div className="w-fit absolute -top-9 right-0 bg-white dark:bg-gray-dark rounded-8">
              <MyDropdown
                side="bottom"
                align="end"
                list={mediaMessageDropdwonMenu}
              />
            </div>
          </Carousel>

          <div className="py-2 text-center text-sm text-white">
            Slide {current} of {count}
          </div>
        </div>
      </div>
    </OverlayBox>
  ) : null;
}

export default MediaCarousel;
