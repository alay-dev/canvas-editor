import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type Props = {
  onChange: (data: number) => void;
  value: number;
};

export default function LetterSpacing({ onChange, value }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Slider
        min={1}
        max={400}
        value={[value]}
        onValueChange={(val) => onChange(val?.at(0) || 1)}
      />
      <Input
        className="w-14 h-8"
        onChange={(e) => onChange(+e.target.value)}
        value={value}
      />
    </div>
  );
}
