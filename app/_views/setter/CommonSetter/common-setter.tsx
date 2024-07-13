import { Button } from "@/components/ui/button";
import {
  LockUnlocked as LockIcon,
  ListArrowUpMinimalistic as LayerUpIcon,
  ListArrowDownMinimalistic as LayerDownicon,
  TrashBinMinimalistic as DeleteIcon,
  Eye as OpacityIcon,
} from "solar-icon-set";
import SliderInput from "@/app/_components/slider-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContext } from "react";
import { GloablStateContext } from "@/context/global-context";
import { useFormContext } from "react-hook-form";
import {
  AlignHorizontalSpaceAroundIcon,
  AlignVerticalSpaceAroundIcon,
  ArrowDownFromLineIcon,
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  ArrowUpFromLineIcon,
} from "lucide-react";

const CommonSetter = () => {
  const { object, editor } = useContext(GloablStateContext);
  const { setValue, watch } = useFormContext();

  const fields = watch();

  const handleLockObject = () => {
    object?.set("lockMovementX", !fields.isLocked);
    object?.set("lockMovementY", !fields.isLocked);
    object?.set("hasControls", fields.isLocked);

    setValue("isLocked", !fields.isLocked);

    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  const handleChangeOpacity = (val: number) => {
    object?.set("opacity", val);
    setValue("opacity", val);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  const deleteActiveObject = () => {
    if (!object) return;
    editor?.canvas?.remove(object);
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
        object.set(
          "left",
          (editor?.sketch?.width as number) - (object?.width as number)
        );
        break;
      case "top":
        object.set("top", 0);
        break;
      case "centerV":
        editor.canvas?.viewportCenterObjectV(object);
        object.setCoords();
        break;
      case "bottom":
        object.set(
          "top",
          (editor?.sketch?.height as number) - (object?.height as number)
        );
        break;
      default:
        break;
    }
    editor.canvas?.requestRenderAll();
    editor.fireCustomModifiedEvent();
  };

  return (
    <>
      <div className=" py-2 flex items-center justify-between ">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-gray-600 hover:text-white"
          onClick={() => alignObject("left")}
        >
          <ArrowLeftFromLineIcon size={16} color="#BDBDBD" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-gray-600 hover:text-white"
          onClick={() => alignObject("centerH")}
        >
          <AlignHorizontalSpaceAroundIcon size={16} color="#BDBDBD" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-gray-600 hover:text-white"
          onClick={() => alignObject("right")}
        >
          <ArrowRightFromLineIcon size={16} color="#BDBDBD" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-gray-600 hover:text-white"
          onClick={() => alignObject("bottom")}
        >
          <ArrowDownFromLineIcon size={16} color="#BDBDBD" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-gray-600 hover:text-white"
          onClick={() => alignObject("centerV")}
        >
          <AlignVerticalSpaceAroundIcon size={16} color="#BDBDBD" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-gray-600 hover:text-white"
          onClick={() => alignObject("top")}
        >
          <ArrowUpFromLineIcon size={16} color="#BDBDBD" />
        </Button>
      </div>
      <div className="border-t border-gray-500  py-2 flex items-center justify-between ">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-gray-600 hover:text-white"
          onClick={handleLockObject}
        >
          <LockIcon
            size={16}
            iconStyle={fields?.isLocked ? "Bold" : "Linear"}
            color="#BDBDBD"
          />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-gray-600 hover:text-white"
          onClick={() => object?.bringForward()}
        >
          <LayerUpIcon size={16} color="#BDBDBD" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-gray-600 hover:text-white"
          onClick={() => object?.sendBackwards()}
        >
          <LayerDownicon size={16} color="#BDBDBD" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-gray-600 hover:text-white"
            >
              <OpacityIcon size={16} color="#BDBDBD" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-background border-gray-500">
            <SliderInput
              min={0}
              max={1}
              step={0.01}
              onChange={(val) => handleChangeOpacity(val)}
              value={fields.opacity}
            />
          </PopoverContent>
        </Popover>

        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-gray-600 hover:text-white"
          onClick={deleteActiveObject}
        >
          <DeleteIcon size={16} color="#BDBDBD" />
        </Button>
      </div>
    </>
  );
};

export default CommonSetter;
