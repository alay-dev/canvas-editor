import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type Props = {
  onChange: (data: number) => void;
  value: number;
  min?: number;
  max?: number;
  step?: number;
};

const SliderInput = ({ onChange, value, min, max = 10, step = 1 }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(val) => onChange(val?.at(0) || 0)}
      />
      <Input
        className="w-14 h-8"
        onChange={(e) => onChange(+e.target.value)}
        value={value}
      />
    </div>
  );
};

export default SliderInput;
