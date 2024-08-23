import SliderInput from "@/app/_components/slider-input";
import ColorPicker from "@/app/_components/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type Shadow = Pick<fabric.Shadow, "blur" | "color" | "affectStroke" | "offsetX" | "offsetY">;

const ShadowSetter = ({ shadow, onChange }: { shadow: Shadow; onChange: (val: Shadow) => void }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex w-max  rounded-xl items-center gap-2">
          <div className={cn(" w-6 h-6 rounded-sm")} style={{ backgroundColor: shadow.color }} />
          <p className="font-light text-xs uppercase">{shadow.color}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-[20rem] p-4 rounded-xl mr-5" align="start">
        <div>
          <div className="mb-4 flex gap-4 items-center w-full">
            <label className=" text-gray-300 font-light text-sm w-12">X</label>
            <SliderInput max={100} value={shadow.offsetX || 0} onChange={(val) => onChange({ ...shadow, offsetX: val })} />
          </div>
          <div className="mb-4 flex gap-4 items-center">
            <label className=" text-gray-300 font-light text-sm w-12">Y</label>
            <SliderInput max={100} value={shadow.offsetY || 0} onChange={(val) => onChange({ ...shadow, offsetY: val })} />
          </div>
          <div className="mb-4 flex gap-4 items-center">
            <label className=" text-gray-300 font-light text-sm w-12">Blur</label>
            <SliderInput max={100} value={shadow.blur || 0} onChange={(val) => onChange({ ...shadow, blur: val })} />
          </div>
          <div className="flex gap-4 items-center">
            <label className=" text-gray-300 font-light text-sm w-12">Color</label>
            <ColorPicker value={shadow.color || "#000"} onChange={(val) => onChange({ ...shadow, color: val })} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShadowSetter;
