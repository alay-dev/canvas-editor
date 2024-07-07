import { useContext } from "react";
import { GloablStateContext } from "@/context/global-context";
import BorderSetter from "../BorderSetter";
import ColorSetter from "../ColorSetter/Solid";
import { FormProvider, useForm } from "react-hook-form";
import { transformColors2Fill, transformFill2Colors } from "@/utils";
import CommonSetter from "../CommonSetter/common-setter";

type ShapeInputs = {
  fill: {
    type: string;
    color: string;
  };
  opacity: number;
  isLocked: boolean;
};

export default function ShapeSetter() {
  const { object, editor } = useContext(GloablStateContext);
  const methods = useForm<ShapeInputs>({
    values: {
      fill: transformFill2Colors(object?.fill),
      isLocked: object?.lockMovementX || false,
      opacity: object?.opacity || 1,
    },
  });

  const fields = methods.watch();

  const handleValuesChange = (key: any, val: string) => {
    methods.setValue(key, val);
    let fill = transformColors2Fill(fields.fill);
    object?.set("fill", fill);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  return (
    <FormProvider {...methods}>
      <div className="mb-4">
        <label className=" text-gray-300 font-light text-sm">Fill color</label>
        <ColorSetter
          onChange={(val) => handleValuesChange("fill.color", val)}
          value={fields?.fill?.color || "#555"}
        />
      </div>

      <BorderSetter />
      <CommonSetter />
    </FormProvider>
  );
}
