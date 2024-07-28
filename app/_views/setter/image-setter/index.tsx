import { useContext } from "react";
import ReplaceSetter from "./replace-setter";
import CommonBorderSetter from "../border-setter";
import CommonSetter from "../CommonSetter/common-setter";
import { FormProvider, useForm } from "react-hook-form";
import { GloablStateContext } from "@/context/global-context";

export default function ImageSetter() {
  const { object } = useContext(GloablStateContext);
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
