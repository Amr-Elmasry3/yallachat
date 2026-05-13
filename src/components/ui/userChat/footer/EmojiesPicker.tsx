"use client";

// ************************ Ui Imports *************************
// => Icons
import { BiUpsideDown } from "react-icons/bi";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState, useContext } from "react";

// => Contexts
import { ThemeContext } from "@/contexts/ThemeContext";

// => Libraries
import EmojiPicker, { Theme } from "emoji-picker-react";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
interface EmojiesPickerProps {
  handlePickEmoji: (emojy: string) => void;
}

function EmojiesPicker({ handlePickEmoji }: EmojiesPickerProps) {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { mode } = useContext(ThemeContext);

  // => States & Refs
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // => Functions
  const handleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="emojies-picker relative">
      <BiUpsideDown
        className="text-subHeading text-light-text dark:text-dark-text rotate-180 cursor-pointer"
        onClick={handleIsOpen}
      />

      <EmojiPicker
        open={isOpen}
        theme={Theme[mode.toUpperCase() as keyof typeof Theme]}
        lazyLoadEmojis={true}
        className="absolute! bottom-10! max-xxs:-left-4! left-0! max-xxs:w-[320px]!"
        onEmojiClick={(emojiObject) => handlePickEmoji(emojiObject.emoji)}
      />
    </div>
  );
}

export default EmojiesPicker;
