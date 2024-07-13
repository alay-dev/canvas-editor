import { fabric } from "fabric";
import { useContext, useEffect, useState } from "react";
import PathSetterForm from "./PathSetterForm";
import { GloablStateContext } from "@/context/global-context";
import { transformFill2Colors, transformColors2Fill } from "@/utils";
import { FormProvider, useForm } from "react-hook-form";
import { PaintInputs } from "../../panel/paint-panel";
import CommonSetter from "../CommonSetter/common-setter";

export default function PathSetter() {
  const { object, editor } = useContext(GloablStateContext);
  const [value, setValue] = useState({});
  const methods = useForm<PaintInputs>({
    values: {
      color: object?.stroke || "#000",
      width: object?.strokeWidth || 0,
      isLocked: object?.lockMovementX,
      // fill: transformFill2Colors(object?.fill || "#ffffff"),
      shadow: {
        color: (object?.shadow as fabric.Shadow)?.color || "#000000",
        width: (object?.shadow as fabric.Shadow)?.blur || 0,
        offset: (object?.shadow as fabric.Shadow)?.offsetX || 0,
      },
    },
  });

  if (!object || object.type !== "path") return null;

  return (
    <FormProvider {...methods}>
      <PathSetterForm mode="update" />
      <CommonSetter />
    </FormProvider>
  );
}
