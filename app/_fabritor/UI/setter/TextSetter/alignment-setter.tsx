import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { TextStyle } from "@/types/custom-text";

const TEXT_ALIGNMENT_LIST = [
  { icon: <AlignLeftOutlined />, value: "left" },
  { icon: <AlignCenterOutlined />, value: "center" },
  { icon: <AlignRightOutlined />, value: "right" },
];

export default function AlignSetter() {
  const { watch, setValue } = useFormContext<TextStyle>();

  const fields = watch();

  return (
    <div
      id="font-style"
      className="flex border border-gray-500 rounded-lg overflow-hidden mt-2 [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-500 "
    >
      {TEXT_ALIGNMENT_LIST.map((item) => {
        return (
          <div
            onClick={() => setValue("textAlign", item.value)}
            key={item.value}
            className={cn(
              "flex-1 items-center justify-center flex py-2 cursor-pointer px-4 text-white",
              fields.textAlign === item.value && "bg-gray-200 text-black"
            )}
          >
            {item.icon}
          </div>
        );
      })}
    </div>
  );
}
