import { useContext } from "react";
import PathSetterForm from "./PathSetterForm";
import { GlobalStateContext } from "../../../../context/global-context";
import { FormProvider, useForm } from "react-hook-form";
import { PaintInputs } from "../../panel/paint-panel";
import CommonSetter from "../common-setter/common-setter";

export default function PathSetter() {
  const { object } = useContext(GlobalStateContext);
  const methods = useForm<PaintInputs>({
    values: {
      stroke: typeof object?.stroke === "string" ? { type: "solid", color: object?.stroke || "#000" } : { type: "image", image: object?.stroke?.source.currentSrc },
      width: object?.strokeWidth || 0,
      isLocked: object?.lockMovementX,
      shadow: { color: (object?.shadow as fabric.Shadow)?.color || "#000000", width: (object?.shadow as fabric.Shadow)?.blur || 0, offset: (object?.shadow as fabric.Shadow)?.offsetX || 0 },
    },
  });

  if (!object || object.type !== "path") return null;

  return (
    <FormProvider {...methods}>
      <CommonSetter />
      <div className="mt-6">
        <PathSetterForm mode="update" />
      </div>
    </FormProvider>
  );
}
