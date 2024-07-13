import { useContext, useEffect } from "react";
import { fabric } from "fabric";
import ColorSetter from "../ColorSetter/Solid";
import { GloablStateContext } from "@/context/global-context";
import { transformColors2Fill, transformFill2Colors } from "@/utils";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SketchStyles } from "@/types/sketch";

export default function SketchSetter() {
  const { watch, setValue } = useForm<SketchStyles>();
  const { editor } = useContext(GloablStateContext);

  const fields = watch();

  const handleFill = (_fill: Pick<SketchStyles, "fill">) => {
    if (!editor) return;
    const { sketch, canvas } = editor;
    let fill = transformColors2Fill(_fill);
    if (typeof fill !== "string") {
      fill = new fabric.Gradient(fill);
    }
    sketch?.set("fill", fill);
    canvas?.requestRenderAll();
  };

  const handleValuesChange = (values: SketchStyles) => {
    Object.keys(values).forEach((key) => {
      if (key === "size") {
        editor?.setSketchSize({
          width: values[key][0],
          height: values[key][1],
        });
      } else if (key === "fill") {
        handleFill(values[key] as any);
      }
    });
    editor?.fireCustomModifiedEvent();
  };

  useEffect(() => {
    handleValuesChange(fields);
  }, [fields]);

  useEffect(() => {
    if (!editor) return;
    const { sketch } = editor;
    setValue("size", [sketch?.width || 0, sketch?.height || 0]);
    setValue("fill", transformFill2Colors(sketch?.fill) as any);
    // setFieldsValue({
    //   size: [sketch.width, sketch.height],
    //   fill: transformFill2Colors(sketch.fill),
    // });
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
            onChange={(e) =>
              setValue("size", [+e.target.value, fields.size?.at(1) || 0])
            }
          />
          <Input
            placeholder="Height"
            value={fields.size?.at(1)}
            onChange={(e) =>
              setValue("size", [fields.size?.at(0) || 0, +e.target.value])
            }
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
          value={fields.fill?.color}
          onChange={(val) => setValue("fill.color", val)}
        />
      </div>
    </form>
  );
}
