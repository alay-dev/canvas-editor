import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SketchPicker } from "react-color";

type Props = {
  value: string;
  onChange: (data: string) => void;
};

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <div className="w-max text-white cursor-pointer">
      <Popover>
        <PopoverTrigger asChild className="p-0 h-max m-0">
          <div className="flex  w-full py-2  rounded-xl items-center gap-2">
            <div className={cn(" w-6 h-6 rounded-sm")} style={{ backgroundColor: value }} />
            <p className="font-light text-xs uppercase">{value}</p>
          </div>
        </PopoverTrigger>
        <PopoverContent side="left" className="z-50 w-[20rem] p-4 border-0 rounded-xl bg-background mr-5" align="start">
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
