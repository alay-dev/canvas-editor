import { useContext } from "react";
import { GlobalStateContext } from "@/context/global-context";
import BorderSetter, { getObjectBorderType } from "../border-setter";
import FillSetter from "@/app/_components/fill";
import { FormProvider, useForm } from "react-hook-form";
import { transformFill2Colors, transfromObjectStrokeToStoke } from "@/lib/utils";
import CommonSetter from "../common-setter/common-setter";
import { fabric } from "fabric";
import { Fill } from "@/app/_components/fill";
import type { Shadow } from "@/app/_components/shadow";
import ShadowSetter from "@/app/_components/shadow";
import { Border } from "@/types/custom-image";

type ShapeInputs = {
  fill: Fill;
  opacity: number;
  isLocked: boolean;
  shadow: Shadow;
  border: Border;
};

export default function Shape() {
  const { object, editor } = useContext(GlobalStateContext);
  if (!object) throw new Error("Object is not initialized");

  const methods = useForm<ShapeInputs>({
    values: {
      fill: transformFill2Colors(object?.fill),
      isLocked: object?.lockMovementX || false,
      opacity: object?.opacity || 1,
      shadow:
        object?.shadow instanceof fabric.Shadow
          ? { offsetX: object?.shadow?.offsetX, offsetY: object?.shadow?.offsetY, blur: object?.shadow?.blur, color: object?.shadow?.color, affectStroke: object?.shadow?.affectStroke }
          : { offsetX: 0, offsetY: 0, blur: 0, color: object?.shadow || "#000", affectStroke: false },
      border: {
        type: "none",
        stroke: transfromObjectStrokeToStoke(object?.stroke),
        borderRadius: object.rx || 0,
        strokeWidth: object.strokeWidth || 0,
        strokeDashArray: [],
      },
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

  const handleChangeShadow = (val: Shadow) => {
    const shadow = new fabric.Shadow({ blur: val.blur, color: val.color, offsetX: val.offsetX, offsetY: val.offsetY, affectStroke: val.affectStroke });
    methods.setValue("shadow", val);
    object?.set("shadow", shadow);
    editor?.canvas?.requestRenderAll();
  };

  return (
    <FormProvider {...methods}>
      <CommonSetter />
      <div className="mb-4">
        <label className=" text-gray-300 font-light text-sm">Fill</label>
        <FillSetter onChange={handleValuesChange} fill={fields?.fill} />
      </div>
      <BorderSetter />
      <div className="mt-4 flex flex-col items-start">
        <label className=" text-gray-300 font-light text-sm">Shadow</label>
        <ShadowSetter onChange={handleChangeShadow} shadow={fields.shadow} />
      </div>
    </FormProvider>
  );
}
