import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { defaultFontSize } from "@/config";

type Props = {
  onChange: (data: number) => void;
  value: number;
};

export default function FontSize({ onChange, value }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Slider
        value={[value]}
        min={1}
        max={400}
        onValueChange={(val) => onChange(val?.at(0) || defaultFontSize)}
      />
      <Input
        onChange={(e) => onChange(+e.target.value)}
        value={value}
        className="w-14 h-8"
      />
    </div>
  );
}
