import { cn } from "@/lib/utils";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

const TEXT_ALIGNMENTS = [
  { icon: <AlignLeft />, value: "left" },
  { icon: <AlignCenter />, value: "center" },
  { icon: <AlignRight />, value: "right" },
];

type Props = {
  onChangeAlignment: (val: string) => void;
  style: string;
};

export default function Alignment({ onChangeAlignment, style }: Props) {
  const onChange = (type: string) => {
    onChangeAlignment(type);
  };

  return (
    <div id="font-style" className="flex border border-gray-500 rounded-lg overflow-hidden mt-2 [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-500 ">
      {TEXT_ALIGNMENTS.map((item) => {
        return (
          <div onClick={() => onChange(item.value)} key={item.value} className={cn("flex-1 items-center justify-center flex py-2 cursor-pointer px-4 text-white", style === item.value && "bg-gray-200 text-black")}>
            {item.icon}
          </div>
        );
      })}
    </div>
  );
}
