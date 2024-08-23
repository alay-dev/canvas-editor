import { useContext, useEffect } from "react";
import { GlobalStateContext } from "@/context/global-context";
import ColorPicker from "@/app/_components/color-picker";
import { BORDER_TYPES, getObjectBorderType } from "../border-setter";
import { Form, useForm, FormProvider } from "react-hook-form";
import SliderInput from "@/app/_components/slider-input";
import CommonSetter from "../common-setter/common-setter";

type LineInput = {
  stroke: string;
  type: string;
  strokeWidth: number;
  round: boolean;
};

export default function Line() {
  const { object, editor } = useContext(GlobalStateContext);

  const methods = useForm<LineInput>({
    values: {
      stroke: typeof object?.stroke === "string" ? object.stroke : "#000",
      type: getObjectBorderType({ stroke: typeof object?.stroke === "string" ? object.stroke : "#000", strokeDashArray: object?.strokeDashArray || [], strokeWidth: object?.strokeWidth || 1 }),
      strokeWidth: object?.strokeWidth || 1,
      round: object?.strokeLineCap === "round",
    },
  });

  const fields = methods?.watch();

  const handleChangeStrokeColor = (val: string) => {
    methods?.setValue("stroke", val);
    object?.set("stroke", val);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  const handleChangeStrokeWidth = (val: number) => {
    methods?.setValue("strokeWidth", val);
    object?.set("strokeWidth", val);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  // const handleValuesChange = (values) => {
  //   const keys = Object.keys(values);
  //   if (!keys?.length) return;
  //   for (let key of keys) {
  //     switch (key) {
  //       case "stroke":
  //         object?.set("stroke", values[key]);
  //         editor?.fireCustomModifiedEvent();
  //         break;
  //       case "strokeWidth":
  //         object?.setStrokeWidth(values[key]);
  //         break;
  //       case "round":
  //         object?.set("strokeLineCap", values[key] ? "round" : "butt");
  //         editor?.fireCustomModifiedEvent();
  //         break;
  //       case "type":
  //         object?.set(
  //           "strokeDashArray",
  //           getStrokeDashArray({
  //             type: values[key],
  //             strokeWidth: object.strokeWidth,
  //           })
  //         );
  //         editor?.fireCustomModifiedEvent();
  //         break;
  //       default:
  //         break;
  //     }
  //   }

  //   object?.setCoords();

  //   editor?.canvas?.requestRenderAll();
  // };

  return (
    <FormProvider {...methods}>
      <CommonSetter />
      <ColorPicker onChange={handleChangeStrokeColor} value={fields.stroke} />

      {/* <SliderInputNumber
          min={1}
          max={50}
          onChangeComplete={() => {
            editor?.fireCustomModifiedEvent();
          }}
        /> */}
      <SliderInput min={1} max={100} onChange={handleChangeStrokeWidth} value={fields?.strokeWidth} />

      {/* <Switch /> */}
    </FormProvider>
  );
}
