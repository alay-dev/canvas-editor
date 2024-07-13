import { cn } from "@/lib/utils";
import { TextItalic, TextUnderline, TextBold, TextCross } from "solar-icon-set";
import { FontStyle as FontStyleType } from "@/types/custom-text";

const FONT_STYLES: { icon: JSX.Element; value: keyof FontStyleType }[] = [
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

type Props = {
  onChangeFontStyle: (val: boolean, type: string) => void;
  styles: FontStyleType;
};

export default function FontStyle({ onChangeFontStyle, styles }: Props) {
  const onChange = (type: keyof FontStyleType) => {
    const isEnabled = styles?.[type];
    onChangeFontStyle(!isEnabled, type);
  };

  return (
    <div
      id="font-style"
      className="flex border border-gray-500 rounded-lg overflow-hidden mt-2 [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-500 "
    >
      {FONT_STYLES.map((item) => {
        const isEnabled = styles?.[item.value];
        return (
          <div
            onClick={() => onChange(item.value)}
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
