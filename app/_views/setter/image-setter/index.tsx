import { useContext } from "react";
import ReplaceSetter from "./replace-setter";
import CommonBorderSetter from "../border-setter";
import CommonSetter from "../common-setter/common-setter";
import { FormProvider, useForm } from "react-hook-form";
import { GlobalStateContext } from "@/context/global-context";
import { Input } from "@/components/ui/input";
import SliderInput from "@/app/_components/slider-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { fabric } from "fabric";
import { CustomImage } from "@/app/_custom-objects/custom-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShadowSetter, { Shadow } from "@/app/_components/shadow";
import { Border } from "@/types/custom-image";
import { getObjectBorderType, transfromObjectStrokeToStroke } from "@/lib/utils";

const nonValueFilters = ["Grayscale", "Convolute", "Gamma", "Invert", "Black and white", "Sepia", "Vintage", "Kodachrome"];

const filterTypes = [
  { name: "None", img: "/images/filters/none.png" },
  { name: "Black and white", img: "/images/filters/black-and-white.png" },
  { name: "Sepia", img: "/images/filters/sepia.png" },
  { name: "Kodachrome", img: "/images/filters/kodachrome.png" },
  { name: "Vintage", img: "/images/filters/vintage.png" },
  { name: "Vibrance", img: "/images/filters/vibrance.png" },
  { name: "Blur", img: "/images/filters/blur.png" },
  { name: "Gamma", img: "/images/filters/gamma.png" },
  { name: "Invert", img: "/images/filters/invert.png" },
  { name: "Noise", img: "/images/filters/noise.png" },
  { name: "Pixelate", img: "/images/filters/pixelate.png" },
  { name: "Hue Rotation", img: "/images/filters/hue-rotation.png" },
  { name: "Grayscale", img: "/images/filters/grayscale.png" },
];

type ImageInputs = {
  isLocked: boolean;
  opacity: number;
  filter: { type: string; value: number };
  shadow: Shadow;
  border: Border;
};

export default function ImageSetter() {
  const { object, editor } = useContext(GlobalStateContext);
  const customImage = object as CustomImage;
  const border = customImage?.getBorder();

  const methods = useForm<ImageInputs>({
    values: {
      isLocked: object?.lockMovementX || false,
      opacity: object?.opacity || 1,
      filter: { type: "None", value: 0 },
      shadow:
        object?.shadow instanceof fabric.Shadow
          ? { offsetX: object?.shadow?.offsetX, offsetY: object?.shadow?.offsetY, blur: object?.shadow?.blur, color: object?.shadow?.color, affectStroke: object?.shadow?.affectStroke }
          : { offsetX: 0, offsetY: 0, blur: 0, color: object?.shadow || "#000", affectStroke: false },
      border: {
        type: getObjectBorderType(border),
        stroke: transfromObjectStrokeToStroke(border?.stroke),
        borderRadius: border.borderRadius || 0,
        strokeWidth: border.strokeWidth || 0,
        strokeDashArray: border.strokeDashArray,
      },
    },
  });

  const fields = methods.watch();

  const onChangeFilter = (filterType: string, value?: number) => {
    let filter;
    switch (filterType) {
      case "Grayscale":
        filter = new fabric.Image.filters.Grayscale();
        methods.setValue("filter", { type: filterType, value: 0 });
        break;
      case "Convolute":
        filter = new fabric.Image.filters.Convolute({ matrix: [0, -3, 0, -3, 5, -3, 0, -3, 0] });
        methods.setValue("filter", { type: filterType, value: 0 });
        break;
      case "Pixelate":
        filter = new fabric.Image.filters.Pixelate({ blocksize: value || 8 });
        methods.setValue("filter", { type: filterType, value: value || 8 });
        break;
      case "Hue Rotation":
        filter = new fabric.Image.filters.HueRotation({ rotation: value || -0.5 });
        methods.setValue("filter", { type: filterType, value: value || -0.5 });
        break;
      case "Noise":
        filter = new fabric.Image.filters.Noise({ noise: value || 350 });
        methods.setValue("filter", { type: filterType, value: value || 350 });
        break;
      case "Gamma":
        filter = new fabric.Image.filters.Gamma({ gamma: [1, 0.5, 2.1] });
        methods.setValue("filter", { type: filterType, value: 0 });
        break;
      case "Invert":
        filter = new fabric.Image.filters.Invert();
        methods.setValue("filter", { type: filterType, value: 0 });
        break;
      case "Vibrance":
        filter = new fabric.Image.filters.Vibrance({ vibrance: value || 3 });
        methods.setValue("filter", { type: filterType, value: value || 3 });
        break;
      case "Black and white":
        filter = new fabric.Image.filters.ColorMatrix({ matrix: [1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 0, 0, 0, 1, 0] });
        methods.setValue("filter", { type: filterType, value: 0 });
        break;
      case "Blur":
        filter = new fabric.Image.filters.Blur({ blur: value || 0.2 });
        methods.setValue("filter", { type: filterType, value: value || 0.2 });
        break;
      case "Sepia":
        filter = new fabric.Image.filters.Sepia();
        methods.setValue("filter", { type: filterType, value: 0 });
        break;
      case "Kodachrome":
        filter = new fabric.Image.filters.ColorMatrix({ matrix: [1.12855, -0.39673, -0.03992, 0, 0.24991, -0.16404, 1.08352, -0.05498, 0, 0.09698, -0.16786, -0.56034, 1.60148, 0, 0.13972, 0, 0, 0, 1, 0] });
        methods.setValue("filter", { type: filterType, value: 0 });
        break;
      case "Vintage":
        filter = new fabric.Image.filters.ColorMatrix({ matrix: [0.62793, 0.32021, -0.03965, 0, 0.03784, 0.02578, 0.64411, 0.03259, 0, 0.02926, 0.0466, -0.08512, 0.52416, 0, 0.02023, 0, 0, 0, 1, 0] });
        methods.setValue("filter", { type: filterType, value: 0 });
        break;
      case "None":
        filter = null;
        // methods.setValue("filter", { type: filterType, value: 0 });
        break;
      default:
        null;
    }

    customImage.applyFilter(filter);
    editor?.canvas?.requestRenderAll();
  };

  const handleChangeShadow = (val: Shadow) => {
    const shadow = new fabric.Shadow({ blur: val.blur, color: val.color, offsetX: val.offsetX, offsetY: val.offsetY, affectStroke: val.affectStroke });
    methods.setValue("shadow", val);
    object?.set("shadow", shadow);
    editor?.canvas?.requestRenderAll();
  };

  return (
    <FormProvider {...methods}>
      <div className="mb-6">
        <CommonSetter />
      </div>
      <ReplaceSetter />
      <div className="mt-8">
        <CommonBorderSetter />
      </div>

      <Separator className="mt-10" />
      <div className="my-4 flex items-center">
        <label className="text-primary font-light text-sm w-28 flex-shrink-0">Shadow</label>
        <ShadowSetter onChange={handleChangeShadow} shadow={fields.shadow} />
      </div>
      <Separator />
      <div className="mt-10">
        <p className="text-gray-400 font-light text-sm">Filter</p>
        <div className="mt-2">
          <Popover>
            <PopoverTrigger className="flex items-center justify-between w-full mb-2">
              <p className="font-light w-28 flex-shrink-0 text-start text-primary text-sm">{fields.filter.type}</p>
              <span className="text-sm text-gray-500 hover:text-white hover:underline">Change</span>
            </PopoverTrigger>
            <PopoverContent side="left" className="z-50 w-[25rem] p-4 px-0 rounded-xl mr-5">
              <p className="text-gray-300 ml-2 font-normal px-4">Filters</p>
              <Separator />
              <ScrollArea className="px-4">
                <div className="grid grid-cols-2 gap-4 mt-4 max-h-[40vh]">
                  {filterTypes?.map((item) => (
                    <div onClick={() => onChangeFilter(item.name)} key={item.name} className="rounded-lg text-gray-400">
                      <img src={item.img} alt={item.name} className="rounded-md" />
                      <p className="text-sm text-center text-primary font-light">{item.name}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          {nonValueFilters?.includes(fields.filter.type) ? null : <SliderInput value={20} onChange={() => null} />}
        </div>
      </div>
    </FormProvider>
  );
}
