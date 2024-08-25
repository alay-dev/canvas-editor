import { useContext } from "react";
import FillSetter, { FillType } from "@/app/_components/fill";
import { GlobalStateContext } from "@/context/global-context";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SketchStyles } from "@/types/sketch";
import { fabric } from "fabric";
import { transformFill2Colors } from "@/lib/utils";

export default function SketchSetter() {
  const { editor } = useContext(GlobalStateContext);
  const { watch, setValue } = useForm<SketchStyles>({
    values: {
      size: [editor?.sketch?.width || 0, editor?.sketch?.height || 0],
      fill: transformFill2Colors(editor?.sketch?.fill),
    },
  });

  const fields = watch();

  const onChangeFill = (type: FillType, val: string) => {
    if (type == "solid") {
      setValue("fill", { type: "solid", color: val });
      editor?.sketch?.set("fill", val);
    } else if (type === "image") {
      setValue("fill", { type: "image", image: val });

      fabric.Image.fromURL(val, (img) => {
        const pattern = new fabric.Pattern({ source: img.getElement() as HTMLImageElement });
        editor?.sketch?.set("fill", pattern);
        editor?.canvas?.requestRenderAll();
        editor?.fireCustomModifiedEvent();
      });
    }

    editor?.fireCustomModifiedEvent();
    editor?.canvas?.requestRenderAll();
  };

  const onChangeSize = (val: string, type: string) => {
    if (type === "width") {
      editor?.setSketchSize({ width: +val, height: editor.sketch?.height });
      setValue("size", [+val, editor?.sketch?.height || 0]);
    } else {
      editor?.setSketchSize({ width: editor.sketch?.width, height: +val });
      setValue("size", [editor?.sketch?.width || 0, +val]);
    }
    editor?.canvas?.requestRenderAll();
  };

  return (
    <form>
      <div className="mb-5">
        <label htmlFor="font-size" className=" text-gray-300 font-light text-sm">
          Size
        </label>
        <div className="flex gap-3 items-center mt-2">
          <Input placeholder="Width" value={fields.size?.at(0)} onChange={(e) => onChangeSize(e.target.value, "width")} />
          <Input placeholder="Height" value={fields.size?.at(1)} onChange={(e) => onChangeSize(e.target.value, "height")} />
        </div>
      </div>
      <div className="mb-5">
        <label htmlFor="font-size" className=" text-gray-300 font-light text-sm">
          Fill
        </label>
        <FillSetter fill={fields.fill} onChange={onChangeFill} />
      </div>
    </form>
  );
}
