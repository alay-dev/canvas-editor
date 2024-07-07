// @ts-nocheck
import { useContext, useEffect, useState } from "react";
import { fabric } from "fabric";

import { GloablStateContext } from "@/context/global-context";
import FontStyleSetter from "./font-style-setter";
import AlignSetter from "./alignment-setter";

import { loadFont, transformColors2Fill, transformFill2Colors } from "@/utils";
import { FormProvider, useForm } from "react-hook-form";
import { FontStyle, TextStyle } from "@/types/custom-text";
import { defaultFontSize } from "@/config";
import SliderInput from "@/app/_fabritor/components/slider-input";
import {
  FONT_PRESET_FAMILY_LIST,
  TEXTBOX_DEFAULT_CONFIG,
} from "@/utils/constants";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import CommonSetter from "../CommonSetter/common-setter";
import SolidColorSetter from "../ColorSetter/Solid";

export default function TextSetter() {
  const { object, editor } = useContext(GloablStateContext);
  const customTextObject = object as fabric.FText;
  const methods = useForm<TextStyle>();

  const fields = methods.watch();

  const handleFontStyles = (styles: FontStyle) => {
    customTextObject?.set({
      fontWeight: styles?.bold ? "bold" : "normal",
      fontStyle: styles?.italic ? "italic" : "normal",
      underline: !!styles.underline,
      linethrough: !!styles.linethrough,
    });
  };

  const handleFill = (_fill: any) => {
    if (!customTextObject) return;
    let fill = transformColors2Fill(_fill);
    if (typeof fill !== "string") {
      fill.gradientUnits = "pixels";
      const { coords } = fill;
      fill.coords = {
        x1: coords.x1 === 1 ? customTextObject.width : 0,
        y1: coords.y1 === 1 ? customTextObject.height : 0,
        x2: coords.x2 === 1 ? customTextObject.width : 0,
        y2: coords.y2 === 1 ? customTextObject.height : 0,
        r1: 0,
        r2:
          customTextObject?.width! > customTextObject?.height!
            ? customTextObject?.width! / 2
            : customTextObject.height,
      };
    }
    if (typeof fill !== "string") {
      fill = new fabric.Gradient(fill);
    }
    customTextObject.set({ fill });
  };

  useEffect(() => {
    handleValuesChange(fields);
  }, [fields]);

  const handleValuesChange = async (values: TextStyle) => {
    if (!customTextObject) return;
    const keys = Object.keys(values);
    if (!keys?.length) return;

    for (let key of keys) {
      if (key === "fontStyles") {
        handleFontStyles(values[key]);
      } else if (key === "fontFamily") {
        try {
          await loadFont(values[key]);
        } finally {
          customTextObject.set(key, values[key]);
        }
      } else if (key === "fill") {
        handleFill(values[key]);
      } else {
        const selectedText = customTextObject.getSelectedText();
        if (selectedText && key === "fill") {
          customTextObject.setSelectionStyles({ fill: values[key] });
        } else {
          customTextObject.set("styles", {});
          customTextObject.set(key, values[key]);
        }
      }

      if (key !== "fontSize" && key !== "lineHeight" && key !== "charSpacing") {
        editor?.fireCustomModifiedEvent();
      }
    }

    editor?.canvas?.requestRenderAll();
  };

  useEffect(() => {
    if (!customTextObject) return;

    methods.setValue("isLocked", customTextObject.lockMovementX || false);
    methods.setValue("charSpacing", customTextObject.charSpacing || 0);
    methods.setValue(
      "fontFamily",
      customTextObject.fontFamily || TEXTBOX_DEFAULT_CONFIG.fontFamily
    );
    methods.setValue("fontSize", customTextObject.fontSize || defaultFontSize);
    methods.setValue(
      "fill",
      transformFill2Colors(customTextObject.fill) as any
    );
    methods.setValue("textAlign", customTextObject.textAlign || "");
    methods.setValue("lineHeight", customTextObject.lineHeight || 1);
    methods.setValue("opacity", customTextObject?.opacity);
    methods.setValue("fontStyles", {
      bold: customTextObject.fontWeight === "bold",
      italic: customTextObject.fontStyle === "italic",
      underline: customTextObject.underline || false,
      linethrough: customTextObject.linethrough || false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customTextObject]);

  return (
    <FormProvider {...methods}>
      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Font family
        </label>
        <Select
          value={fields.fontFamily}
          onValueChange={(val) => methods.setValue("fontFamily", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_PRESET_FAMILY_LIST?.map((item) => {
              return (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Color
        </label>
        <SolidColorSetter
          value={fields.fill?.color}
          onChange={(val) => methods.setValue("fill.color", val)}
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Font size
        </label>
        <SliderInput
          onChange={(val) => methods.setValue("fontSize", val)}
          value={fields.fontSize}
          min={1}
          max={400}
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Alignment
        </label>
        <AlignSetter />
      </div>

      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Style
        </label>
        <FontStyleSetter />
      </div>
      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Letter spacing
        </label>
        <SliderInput
          onChange={(val) => methods.setValue("charSpacing", val)}
          value={fields.charSpacing}
          min={1}
          max={400}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="font-size"
          className=" text-gray-300 font-light text-sm"
        >
          Line spacing
        </label>
        <SliderInput
          onChange={(val) => methods.setValue("lineHeight", val)}
          value={fields.lineHeight}
          min={0.1}
          max={10}
          step={0.1}
        />
      </div>

      <CommonSetter />
    </FormProvider>
  );
}
