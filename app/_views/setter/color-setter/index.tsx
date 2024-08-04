import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SketchPicker, BlockPicker, HuePicker } from "react-color";

type Props = {
  value: string;
  onChange: (data: string) => void;
};

export default function Color({ value, onChange }: Props) {
  return (
    <div className="w-max text-white cursor-pointer">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex  w-full py-2  rounded-xl items-center gap-2">
            <div className={cn(" w-6 h-6 rounded-sm")} style={{ backgroundColor: value }} />
            <p className="uppercase font-light text-xs">{value}</p>
          </div>
        </PopoverTrigger>
        <PopoverContent className="z-50 w-max p-0 border-0 rounded-xl ">
          <BlockPicker color={value} onChange={(val) => onChange(val.hex)} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
