import { useContext, useState } from "react";
import ReplaceSetter from "./ReplaceSetter";
import BorderSetter from "./BorderSetter";
import CommonBorderSetter from "../BorderSetter/";

// import ClipSetter from "./Clip";
import MoreConfigWrapper from "../Form/MoreConfigWrapper";
import ImageFx from "./ImageFx";
import {
  AltArrowRight as RightIcon,
  StarShine as SpecialEffectIcon,
} from "solar-icon-set";
import CommonSetter from "../CommonSetter/common-setter";
import { FormProvider, useForm } from "react-hook-form";
import { GloablStateContext } from "@/context/global-context";

export default function ImageSetter() {
  const { object } = useContext(GloablStateContext);
  const [openFx, setOpenFx] = useState(false);
  const methods = useForm({
    values: {
      isLocked: object?.lockMovementX,
      opacity: object?.opacity,
    },
  });

  return (
    <FormProvider {...methods}>
      <ReplaceSetter />
      <CommonBorderSetter />
      <CommonSetter />
    </FormProvider>
  );
}
