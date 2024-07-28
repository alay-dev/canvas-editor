import { useContext, useEffect } from "react";
import ColorSetter from "../color-setter";
import { GloablStateContext } from "@/context/global-context";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SketchStyles } from "@/types/sketch";

export default function SketchSetter() {
  const { watch, setValue } = useForm<SketchStyles>();
  const { editor } = useContext(GloablStateContext);

  const fields = watch();

  const onChangeColor = (val: string) => {
    setValue("fill", val);
    editor?.sketch?.set("fill", val);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  const onChangeSize = (val: string, type: string) => {
    if (type === "width") {
      editor?.setSketchSize({
        width: +val,
        height: editor.sketch?.height,
      });
      setValue("size", [+val, editor?.sketch?.height || 0]);
    } else {
      editor?.setSketchSize({
        width: editor.sketch?.width,
        height: +val,
      });
      setValue("size", [editor?.sketch?.width || 0, +val]);
    }
    editor?.canvas?.requestRenderAll();
  };

  useEffect(() => {
    if (!editor) return;
    const { sketch } = editor;
    setValue("size", [sketch?.width || 0, sketch?.height || 0]);
    setValue("fill", (sketch?.fill as string) || "#fff");
  }, [editor]);

  return (
    <form>
      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Size
        </label>
        <div className="flex gap-3 items-center mt-2">
          <Input
            placeholder="Width"
            value={fields.size?.at(0)}
            onChange={(e) => onChangeSize(e.target.value, "width")}
          />
          <Input
            placeholder="Height"
            value={fields.size?.at(1)}
            onChange={(e) => onChangeSize(e.target.value, "height")}
          />
        </div>
      </div>
      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Color
        </label>
        <ColorSetter
          value={fields.fill}
          onChange={(val) => onChangeColor(val)}
        />
      </div>
    </form>
  );
}
