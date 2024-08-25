//@ts-nocheck

import ColorPicker from "@/app/_components/color-picker";
import StrokePicker from "@/app/_components/fill";
import { useContext, useEffect } from "react";
import { GlobalStateContext } from "@/context/global-context";
import { useFormContext } from "react-hook-form";
import { PaintInputs } from "../../panel/paint-panel";
import { fabric } from "fabric";
import SliderInput from "@/app/_components/slider-input";
import { Separator } from "@/components/ui/separator";

type Props = {
  mode: "paint" | "update";
};

export default function PathSetterForm({ mode }: Props) {
  const { watch, setValue } = useFormContext<PaintInputs>();
  const { editor, object } = useContext(GlobalStateContext);
  const fields = watch();

  const handleValueChange = (key: any, value: any) => {
    if (!editor?.canvas) return;
    setValue(key, value);

    if (mode === "paint") {
      if (!editor) return;
      switch (key) {
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

          editor.canvas.freeDrawingBrush.shadow = new fabric.Shadow(newShadowObject);
          break;
          deafult: null;
      }
    }

    if (mode === "update") {
      if (!object) return;

      switch (key) {
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
  };

  const handleValuesChange = (type: any, val: string) => {
    if (!editor?.canvas) return;
    const shadow = editor.canvas.freeDrawingBrush.shadow;
    const originalShadowObject = shadow ? shadow.toObject() : {};
    const newShadowObject = {
      blur: fields.shadow.width || originalShadowObject.blur,
      offsetX: fields.shadow.offset || originalShadowObject.offsetX,
      offsetY: fields.shadow.offset || originalShadowObject.offsetY,
      affectStroke: true,
      color: fields.shadow.color || originalShadowObject.color,
    };

    if (type === "solid") {
      setValue("stroke", { type: "solid", color: val });
      const pencilBrush = new fabric.PencilBrush(editor?.canvas);
      pencilBrush.color = val;
      pencilBrush.width = fields?.width;
      editor.canvas.freeDrawingBrush.shadow = new fabric.Shadow(newShadowObject);
      editor.canvas.freeDrawingBrush = pencilBrush;
      editor.canvas.freeDrawingBrush.color = val;
    } else if (type === "image") {
      setValue("stroke", { type: "image", image: val });
      const img = new Image();
      img.src = val;
      const imagePatternBrush = new fabric.PatternBrush(editor?.canvas);
      imagePatternBrush.source = img;
      editor.canvas.freeDrawingBrush = imagePatternBrush;
      editor.canvas.freeDrawingBrush.width = fields?.width;
      editor.canvas.freeDrawingBrush.shadow = new fabric.Shadow(newShadowObject);
    }

    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  return (
    <div className="w-full text-gray-300">
      <div className="mb-4">
        <label className="font-light text-sm">Stroke</label>
        <div className="flex items-center gap-4">
          <StrokePicker side="bottom" fill={fields?.stroke} onChange={handleValuesChange} />

          <SliderInput min={1} max={100} value={+fields?.width} onChange={(val) => handleValueChange("width", val || 0)} />
        </div>{" "}
      </div>
      <Separator className="my-5" />
      <label className="font-light text-sm text-gray-400">Shadow</label>
      <div className="mb-4 flex items-center gap-3 mt-5">
        <label className="font-light text-sm w-20 flex-shrink-0">Color</label>
        <ColorPicker value={fields.shadow?.color} onChange={(color) => handleValueChange("shadow.color", color)} />
      </div>
      <div className="mb-4 flex items-center gap-3">
        <label className=" font-light text-sm w-20 flex-shrink-0">Width</label>
        <SliderInput min={0} max={50} value={+fields.shadow?.width} onChange={(val) => handleValueChange("shadow.width", val)} />
      </div>

      <div className="mb-4 flex items-center gap-3">
        <label className=" font-light text-sm w-20 flex-shrink-0">Offset</label>
        <SliderInput min={0} max={20} value={+fields.shadow?.offset} onChange={(val) => handleValueChange("shadow.offset", val)} />
      </div>
    </div>
  );
}
