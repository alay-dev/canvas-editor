import { Button } from "@/components/ui/button";
import { LockUnlocked as LockIcon, ListArrowUpMinimalistic as LayerUpIcon, ListArrowDownMinimalistic as LayerDownicon, TrashBinMinimalistic as DeleteIcon, Eye as OpacityIcon } from "solar-icon-set";
import SliderInput from "@/app/_components/slider-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useContext } from "react";
import { GlobalStateContext } from "@/context/global-context";
import { useForm, useFormContext } from "react-hook-form";
import { AlignHorizontalSpaceAroundIcon, AlignVerticalSpaceAroundIcon, ArrowDownFromLineIcon, ArrowLeftFromLineIcon, ArrowRightFromLineIcon, ArrowUpFromLineIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type CommonSetterInputs = {
  isLocked: boolean;
  opacity: number;
};

const CommonSetter = () => {
  const { object, editor } = useContext(GlobalStateContext);
  const { setValue, getValues, watch } = useForm<CommonSetterInputs>({
    values: {
      isLocked: object?.lockMovementX || object?.lockMovementY || false,
      opacity: object?.opacity || 1,
    },
  });

  const fields = watch();

  const handleLockObject = () => {
    const isLocked = fields.isLocked;
    object?.set("lockMovementX", !isLocked);
    object?.set("lockMovementY", !isLocked);
    object?.set("hasControls", isLocked);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();

    setValue("isLocked", !isLocked);
  };

  const handleChangeOpacity = (val: number) => {
    object?.set("opacity", val);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
    setValue("opacity", val);
  };

  const deleteActiveObject = () => {
    if (!object) return;
    editor?.canvas?.remove(object);
    editor?.canvas?.requestRenderAll();
  };

  const alignObject = (alignType: string) => {
    if (!editor || !object) return;
    switch (alignType) {
      case "center":
        editor.canvas?.viewportCenterObject(object);
        object.setCoords();
        break;
      case "left":
        object.set("left", 0);
        break;
      case "centerH":
        editor.canvas?.viewportCenterObjectH(object);
        object.setCoords();
        break;
      case "right":
        object.set("left", (editor?.sketch?.width as number) - (object?.width as number));
        break;
      case "top":
        object.set("top", 0);
        break;
      case "centerV":
        editor.canvas?.viewportCenterObjectV(object);
        object.setCoords();
        break;
      case "bottom":
        object.set("top", (editor?.sketch?.height as number) - (object?.height as number));
        break;
      default:
        break;
    }
    editor.canvas?.requestRenderAll();
    editor.fireCustomModifiedEvent();
  };

  return (
    <div className="bg-gray-800 p-2 rounded-lg border  border-gray-700">
      <div className="pb-1 flex items-center justify-between ">
        <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={() => alignObject("left")}>
          <ArrowLeftFromLineIcon size={16} color="#BDBDBD" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={() => alignObject("centerH")}>
          <AlignHorizontalSpaceAroundIcon size={16} color="#BDBDBD" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={() => alignObject("right")}>
          <ArrowRightFromLineIcon size={16} color="#BDBDBD" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={() => alignObject("bottom")}>
          <ArrowDownFromLineIcon size={16} color="#BDBDBD" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={() => alignObject("centerV")}>
          <AlignVerticalSpaceAroundIcon size={16} color="#BDBDBD" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={() => alignObject("top")}>
          <ArrowUpFromLineIcon size={16} color="#BDBDBD" />
        </Button>
      </div>
      <div className="border-t pt-1 border-gray-500  flex items-center justify-between ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={handleLockObject}>
                <LockIcon size={16} iconStyle={fields.isLocked ? "Bold" : "Linear"} color="#BDBDBD" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Lock item</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={() => object?.bringForward()}>
                <LayerUpIcon size={16} color="#BDBDBD" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Bring up</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={() => object?.sendBackwards()}>
                <LayerDownicon size={16} color="#BDBDBD" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Send back</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white">
                    <OpacityIcon size={16} color="#BDBDBD" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-background border-gray-500">
                  <SliderInput min={0} max={1} step={0.01} onChange={(val) => handleChangeOpacity(val)} value={fields.opacity} />
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent side="bottom">Opacity</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={deleteActiveObject}>
                <DeleteIcon size={16} color="#BDBDBD" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CommonSetter;
