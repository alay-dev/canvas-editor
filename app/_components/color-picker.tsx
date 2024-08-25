import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SketchPicker } from "react-color";

type Props = {
  value: string;
  onChange: (data: string) => void;
  side?: "left" | "right" | "top" | "bottom";
};

export default function ColorPicker({ value, onChange, side = "bottom" }: Props) {
  return (
    <div className="w-max text-white cursor-pointer">
      <Popover>
        <PopoverTrigger asChild className="p-0 h-max m-0">
          <div>
            <div className={cn("w-9 h-9 rounded-sm border border-gray-500 ")} style={{ backgroundColor: value }} />
          </div>
        </PopoverTrigger>
        <PopoverContent side={side} className="z-50 w-[20rem] p-4 rounded-xl mr-5" align="start">
          <div className="flex items-center gap-2  relative">
            <SketchPicker
              styles={{
                default: {
                  picker: { width: "100%", border: "none", backgroundColor: "transparent", borderRadius: "0.2rem", overflow: "hidden", padding: 0 },
                  color: { display: "none" },
                },
              }}
              presetColors={[]}
              color={value}
              onChange={(val) => onChange(val.hex)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
