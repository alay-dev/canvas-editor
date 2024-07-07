//@ts-nocheck

import { useContext, useEffect } from "react";
import { fabric } from "fabric";
import { Divider, Form } from "antd";
import ColorSetter from "../../ColorSetter";
import { GloablStateContext } from "@/context/global-context";
import TextShadow from "./TextShadow";
import TextPath from "./TextPath";
import TextPattern from "./TextPattern";
import {
  drawTextPath,
  getPathOffset,
  removeTextPath,
} from "@/app/_objects/textbox";
import { loadImageDom } from "@/app/_objects/image";
import { transformColors2Fill, transformFill2Colors } from "@/utils";
import SliderInputNumber from "@/app/_fabritor/components/SliderInputNumber";
import SliderInput from "@/app/_fabritor/components/slider-input";

const { Item: FormItem } = Form;

export default function TextFx() {
  const [form] = Form.useForm();
  const { object, editor } = useContext(GloablStateContext);

  const handleTextPattern = async (pattern) => {
    if (!object) return;
    if (!pattern.enable || !pattern.url) {
      if (object.fill instanceof fabric.Pattern) {
        object.set("fill", "#000000");
      }
      return Promise.resolve();
    }

    try {
      const img = await loadImageDom(pattern.url);
      object.set(
        "fill",
        new fabric.Pattern({
          source: img as HTMLImageElement,
          repeat: "repeat",
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleStroke = (_stroke) => {
    let stroke = transformColors2Fill(_stroke);
    if (typeof stroke !== "string") {
      stroke = new fabric.Gradient(stroke);
    }
    object.set("stroke", stroke);
  };

  const handleFxValueChange = async (values) => {
    if (!object || !editor) return;
    const keys = Object.keys(values);
    for (let key of keys) {
      const v = values[key];
      if (key === "shadow") {
        // @ts-ignore object shadow
        object.shadow = {
          color: v.color,
          blur: v.blur,
          offsetX: v.offset,
          offsetY: v.offset,
        };
      } else if (key === "path") {
        if (v.enable) {
          drawTextPath(object, v.offset);
        } else {
          removeTextPath(object);
        }
      } else if (key === "pattern") {
        await handleTextPattern(v);
      } else if (key === "stroke") {
        handleStroke(v);
      } else {
        object.set(key as keyof fabric.Object, v);
      }
    }
    editor.canvas.requestRenderAll();
    editor.fireCustomModifiedEvent();
  };

  const initObjectFx = () => {
    const fill = object.fill;
    form.setFieldsValue({
      stroke: transformFill2Colors(object.stroke),
      strokeWidth: object.strokeWidth || 0,
      textBackgroundColor: object.textBackgroundColor,
      shadow: {
        color: object.shadow?.color || object.stroke || "#000000",
        blur: object.shadow?.blur || 0,
        offset: object.shadow?.offsetX || 0,
      },
      path: {
        enable: !!object.path,
        offset: getPathOffset(object),
      },
      pattern: {
        enable: fill instanceof fabric.Pattern,
        url: fill?.source?.src,
      },
    });
  };

  useEffect(() => {
    if (object && object.type === "custom-text") {
      initObjectFx();
    }
  }, [object]);

  return (
    <form>
      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Color
        </label>
        <ColorSetter />
      </div>
      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Thickness
        </label>
        <SliderInput onChange={() => null} value={10} />
      </div>
      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Text shadow
        </label>
        <SliderInput onChange={() => null} value={10} />
      </div>
    </form>
  );

  // return (
  //   <Form form={form} onValuesChange={handleFxValueChange} colon={false}>
  //     <FormItem
  //       label={<span style={{ fontSize: 15, fontWeight: "bold" }}>Trace</span>}
  //     />
  //     <FormItem label="color" name="stroke">
  //       <ColorSetter />
  //     </FormItem>
  //     <FormItem label="Thickness" name="strokeWidth">
  //       <SliderInputNumber min={0} max={20} />
  //     </FormItem>

  //     <FormItem name="shadow" style={{ marginBottom: 0 }}>
  //       <TextShadow />
  //     </FormItem>

  //     {/* warning: text path conflict with gradient fill */}
  //     <FormItem name="path" style={{ marginBottom: 0 }}>
  //       <TextPath />
  //     </FormItem>

  //     <FormItem name="pattern">
  //       <TextPattern />
  //     </FormItem>
  //   </Form>
  // );
}
