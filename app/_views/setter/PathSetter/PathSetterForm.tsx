// @ts-nocheck

import SolidColorSetter from "../ColorSetter/Solid";

import { useContext, useEffect } from "react";
import { GloablStateContext } from "@/context/global-context";
import { useFormContext } from "react-hook-form";
import { PaintInputs } from "../../panel/paint-panel";
import { fabric } from "fabric";
import SliderInput from "@/app/_components/slider-input";

type Props = {
  mode: "paint" | "update";
};

export default function PathSetterForm({ mode }: Props) {
  // const { value, onChange, shouldFireEvent, showPenTip, showFillConfig } =
  //   props;

  const { watch, setValue } = useFormContext<PaintInputs>();
  const { editor, object } = useContext(GloablStateContext);

  const fields = watch();

  // const fireEvent = () => {
  //   if (shouldFireEvent) {
  //     editor?.fireCustomModifiedEvent();
  //   }
  // };

  const handleValueChange = (key: any, value: any) => {
    setValue(key, value);

    if (mode === "paint") {
      if (!editor) return;
      switch (key) {
        case "color":
          editor.canvas.freeDrawingBrush.color = value;
          break;
        case "width":
          editor.canvas.freeDrawingBrush.width = value;
          break;
        case "shadow.offset":
        case "shadow.color":
        case "shadow.width":
          const shadow = editor.canvas.freeDrawingBrush.shadow;
          const originalShadowObject = shadow ? shadow.toObject() : {};
          const newShadowObject = {
            blur: fields.shadow.width || originalShadowObject.blur,
            offsetX: fields.shadow.offset || originalShadowObject.offsetX,
            offsetY: fields.shadow.offset || originalShadowObject.offsetY,
            affectStroke: true,
            color: fields.shadow.color || originalShadowObject.color,
          };

          console.log(newShadowObject, "SHADOW");
          editor.canvas.freeDrawingBrush.shadow = new fabric.Shadow(
            newShadowObject
          );
          break;
          deafult: null;
      }
    }

    if (mode === "update") {
      if (!object) return;

      switch (key) {
        case "color":
          object.set("stroke", value);
          break;
        case "width":
          object.set("strokeWidth", value);
          break;
        case "shadow.offset":
        case "shadow.color":
        case "shadow.width":
          const shadow = object.shadow;
          const originalShadowObject = shadow ? shadow.toObject() : {};
          const newShadowObject = {
            blur: fields.shadow.width || originalShadowObject.blur,
            offsetX: fields.shadow.offset || originalShadowObject.offsetX,
            offsetY: fields.shadow.offset || originalShadowObject.offsetY,
            affectStroke: true,
            color: fields.shadow.color || originalShadowObject.color,
          };

          object.set("shadow", new fabric.Shadow(newShadowObject));
          break;
          deafult: null;
      }
    }
    editor?.canvas.requestRenderAll();
    editor?.fireCustomModifiedEvent();
    // if (options.strokeLineCap) {
    //   editor.canvas.freeDrawingBrush.strokeLineCap = options.strokeLineCap;
    // }
  };

  return (
    <div className="w-full text-gray-300">
      <div className="mb-4">
        <label className="  font-light text-sm">Color</label>
        <SolidColorSetter
          value={fields?.color}
          onChange={(color) => handleValueChange("color", color)}
        />
      </div>
      <div className="mb-4 ">
        <label className=" font-light text-sm">Width</label>
        <SliderInput
          min={1}
          max={100}
          value={+fields?.width}
          onChange={(val) => handleValueChange("width", val || 0)}
        />
      </div>
      {/* {showFillConfig ? (
        <FormItem label="filling" name="fill">
          <SolidColorSetter onChange={fireEvent} />
        </FormItem>
      ) : null} */}
      <div className="mb-4 ">
        <label className=" font-light text-sm">Shadow color</label>
        <SolidColorSetter
          value={fields.shadow?.color}
          onChange={(color) => handleValueChange("shadow.color", color)}
        />
      </div>
      <div className="mb-4 ">
        <label className=" font-light text-sm">Shadow width</label>
        <SliderInput
          min={0}
          max={50}
          value={+fields.shadow?.width}
          onChange={(val) => handleValueChange("shadow.width", val)}
        />
      </div>

      <div className="mb-4 ">
        <label className=" font-light text-sm">Shadow offset</label>
        <SliderInput
          min={0}
          max={20}
          value={+fields.shadow?.offset}
          onChange={(val) => handleValueChange("shadow.offset", val)}
        />
      </div>
    </div>
  );
}
