import { useContext } from "react";
import ReplaceSetter from "./replace-setter";
import CommonBorderSetter from "../border-setter";
import CommonSetter from "../common-setter/common-setter";
import { FormProvider, useForm } from "react-hook-form";
import { GlobalStateContext } from "@/context/global-context";

export default function ImageSetter() {
  const { object } = useContext(GlobalStateContext);
  const methods = useForm({
    values: { isLocked: object?.lockMovementX, opacity: object?.opacity },
  });

  return (
    <FormProvider {...methods}>
      <CommonSetter />
      <ReplaceSetter />
      <CommonBorderSetter />
    </FormProvider>
  );
}
