import { cn } from "@/lib/utils";
import { TextItalic, TextUnderline, TextBold, TextCross } from "solar-icon-set";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { FontStyle, TextStyle } from "@/types/custom-text";

const FONT_STYLES: { icon: JSX.Element; value: keyof FontStyle }[] = [
  {
    icon: <TextBold />,
    value: "bold",
  },
  {
    icon: <TextItalic />,
    value: "italic",
  },
  {
    icon: <TextUnderline />,
    value: "underline",
  },
  {
    icon: <TextCross />,
    value: "linethrough",
  },
];

export default function FontStylePanel() {
  const { watch, setValue } = useFormContext<TextStyle>();

  const fields = watch();

  return (
    <div
      id="font-style"
      className="flex border border-gray-500 rounded-lg overflow-hidden mt-2 [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-500 "
    >
      {FONT_STYLES.map((item) => {
        const isEnabled = fields?.fontStyles?.[item.value];
        return (
          <div
            onClick={() =>
              setValue("fontStyles", {
                ...fields.fontStyles,
                [item.value]: !isEnabled,
              })
            }
            key={item.value}
            className={cn(
              " flex-1 items-center justify-center flex py-2 cursor-pointer px-4 text-white",
              isEnabled && "bg-gray-200 text-black"
            )}
          >
            {item.icon}
          </div>
        );
      })}
    </div>
  );
}
