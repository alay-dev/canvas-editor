import { useContext, useEffect } from "react";
import { GlobalStateContext } from "@/context/global-context";
import ColorSetter from "../color-setter";
import { BORDER_TYPES, getObjectBorderType } from "../border-setter";
import { Form, useForm } from "react-hook-form";
import SliderInput from "@/app/_components/slider-input";

type LineInput = {
  stroke: string;
  type: string;
  strokeWidth: number;
  round: boolean;
};

export default function Line() {
  const { object, editor } = useContext(GlobalStateContext);
  // const [form] = Form.useForm({});
  const { setValue, watch } = useForm<LineInput>({
    values: {
      stroke: object?.stroke || "#000",
      type: getObjectBorderType({ stroke: object?.stroke || "#000", strokeDashArray: object?.strokeDashArray || [], strokeWidth: object?.strokeWidth || 1 }),
      strokeWidth: object?.strokeWidth || 1,
      round: object?.strokeLineCap === "round",
    },
  });

  const fields = watch();

  const handleChangeStrokeColor = (val: string) => {
    setValue("stroke", val);
    object?.set("stroke", val);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  const handleChangeStrokeWidth = (val: number) => {
    setValue("strokeWidth", val);
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
    <form>
      <ColorSetter onChange={handleChangeStrokeColor} value={fields.stroke} />

      {/* <SliderInputNumber
          min={1}
          max={50}
          onChangeComplete={() => {
            editor?.fireCustomModifiedEvent();
          }}
        /> */}
      <SliderInput min={1} max={100} onChange={handleChangeStrokeWidth} value={fields?.strokeWidth} />

      {/* <Switch /> */}
    </form>
  );
}
