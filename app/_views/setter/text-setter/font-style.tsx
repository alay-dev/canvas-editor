import { cn } from "@/lib/utils";
import { TextItalic, TextUnderline, TextBold, TextCross } from "solar-icon-set";
import { FontStyle as FontStyleType } from "@/types/custom-text";

const FONT_STYLES: { icon: JSX.Element; value: keyof FontStyleType }[] = [
  // {
  //   icon: <TextBold />,
  //   value: "bold",
  // },
  {
    icon: <TextItalic size={13} />,
    value: "italic",
  },
  {
    icon: <TextUnderline size={13} />,
    value: "underline",
  },
  {
    icon: <TextCross size={13} />,
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
    <div className="flex border border-gray-500 rounded-lg overflow-hidden [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-500 flex-1 h-10">
      {FONT_STYLES.map((item) => {
        const isEnabled = styles?.[item.value];
        return (
          <div onClick={() => onChange(item.value)} key={item.value} className={cn("flex-1 items-center justify-center flex  cursor-pointer h-full text-white", isEnabled && "bg-gray-200 text-black")}>
            {item.icon}
          </div>
        );
      })}
    </div>
  );
}
