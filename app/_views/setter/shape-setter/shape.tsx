import { useContext } from "react";
import { GlobalStateContext } from "@/context/global-context";
import BorderSetter from "../border-setter";
import FillSetter from "@/app/_components/fill";
import { FormProvider, useForm } from "react-hook-form";
import { transformColors2Fill, transformFill2Colors } from "@/lib/utils";
import CommonSetter from "../common-setter/common-setter";
import { fabric } from "fabric";
import { Fill } from "@/app/_components/fill";

type ShapeInputs = {
  fill: Fill;
  opacity: number;
  isLocked: boolean;
};

export default function Shape() {
  const { object, editor } = useContext(GlobalStateContext);
  const methods = useForm<ShapeInputs>({
    values: {
      fill: transformFill2Colors(object?.fill),
      isLocked: object?.lockMovementX || false,
      opacity: object?.opacity || 1,
    },
  });

  const fields = methods.watch();

  const handleValuesChange = (type: any, val: string) => {
    if (type === "solid") {
      methods.setValue("fill", { type: "solid", color: val });
      object?.set("fill", val);
    } else if (type === "image") {
      methods.setValue("fill", { type: "image", image: val });
      object?.set("fill", new fabric.Pattern({ source: val }));
    }

    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  return (
    <FormProvider {...methods}>
      <CommonSetter />
      <div className="mb-4">
        <label className=" text-gray-300 font-light text-sm">Fill</label>
        <FillSetter onChange={handleValuesChange} fill={fields?.fill} />
      </div>

      <BorderSetter />
    </FormProvider>
  );
}
