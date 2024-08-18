import { useContext, useEffect } from "react";
import { fabric } from "fabric";
import { GlobalStateContext } from "@/context/global-context";
import FontStyleSetter from "./font-style";
import AlignSetter from "./alignment";
import { transformFill2Colors, uuid } from "@/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { FontStyle, TextStyle } from "@/types/custom-text";
import { defaultFontSize } from "@/config";
import SliderInput from "@/app/_components/slider-input";
import { FONT_PRESET_FAMILY_LIST, TEXTBOX_DEFAULT_CONFIG } from "@/constants/canvas";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import CommonSetter from "../common-setter/common-setter";
import FillSetter from "@/app/_components/fill";
import { FillType } from "@/app/_components/fill";

export default function TextSetter() {
  const { object, editor } = useContext(GlobalStateContext);
  const customTextObject = object as fabric.FText;
  const methods = useForm<TextStyle>({
    values: {
      charSpacing: customTextObject.charSpacing || 0,
      fontFamily: customTextObject.fontFamily || TEXTBOX_DEFAULT_CONFIG.fontFamily,
      fontSize: customTextObject.fontSize || defaultFontSize,
      fill: transformFill2Colors(customTextObject.fill),
      textAlign: customTextObject.textAlign || "",
      lineHeight: customTextObject.lineHeight || 1,
      fontStyles: {
        bold: customTextObject.fontWeight === "bold",
        italic: customTextObject.fontStyle === "italic",
        underline: customTextObject.underline || false,
        linethrough: customTextObject.linethrough || false,
      },
    },
  });
  const fields = methods.watch();

  const setFontStyles = (styles: FontStyle) => {
    customTextObject?.set({
      fontWeight: styles?.bold ? "bold" : "normal",
      fontStyle: styles?.italic ? "italic" : "normal",
      underline: !!styles.underline,
      linethrough: !!styles.linethrough,
    });
  };

  const onFontSizeChange = (val: number) => {
    methods.setValue("fontSize", val);
    customTextObject.set("fontSize", val);
    editor?.canvas?.requestRenderAll();
  };

  const onFontFamilyChange = (val: string) => {
    methods.setValue("fontFamily", val);
    customTextObject.set("fontFamily", val);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  const onFillChange = (type: FillType, val: string) => {
    if (type === "solid") {
      methods.setValue("fill.color", val);
      customTextObject.set("fill", val);
    } else {
      methods.setValue("fill", { type: "image", image: val });
      customTextObject?.set("fill", new fabric.Pattern({ source: val }));
    }

    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  const onLetterSpacingChange = (val: number) => {
    methods.setValue("charSpacing", val);
    customTextObject.set("charSpacing", val);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  const onLineSpacingChange = (val: number) => {
    methods.setValue("lineHeight", val);
    customTextObject.set("lineHeight", val);
    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  };

  const onChangeFontStyle = (val: boolean, type: string) => {
    switch (type) {
      case "bold":
        methods.setValue("fontStyles.bold", val);
        break;
      case "italic":
        methods.setValue("fontStyles.italic", val);
        break;
      case "underline":
        methods.setValue("fontStyles.underline", val);
        break;
      case "linethrough":
        methods.setValue("fontStyles.linethrough", val);
        break;
      default:
        null;
    }

    if (fields?.fontStyles) setFontStyles(fields?.fontStyles);
    editor?.canvas?.requestRenderAll();
  };

  const onChangeAlignment = (val: string) => {
    methods.setValue("textAlign", val);
    customTextObject.set("textAlign", val);
    editor?.canvas?.requestRenderAll();
  };

  console.log(customTextObject.fill, "FILL");
  console.log("render");

  return (
    <FormProvider {...methods}>
      <CommonSetter />
      <div className="mb-5">
        <label htmlFor="font-size" className=" text-gray-400 font-light text-sm">
          Font family
        </label>
        <Select value={fields.fontFamily} onValueChange={onFontFamilyChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_PRESET_FAMILY_LIST?.map((item) => {
              return (
                <SelectItem key={item} value={item}>
                  <span style={{ fontFamily: item }} className="">
                    {item}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-5">
        <label htmlFor="font-size" className=" text-gray-400 font-light text-sm">
          Color
        </label>
        <FillSetter fill={fields.fill} onChange={onFillChange} />
      </div>

      <div className="mb-5">
        <label htmlFor="font-size" className=" text-gray-400 font-light text-sm">
          Font size
        </label>
        <SliderInput onChange={onFontSizeChange} value={fields.fontSize} min={1} max={400} />
      </div>

      <div className="mb-5">
        <label htmlFor="font-size" className=" text-gray-400 font-light text-sm">
          Alignment
        </label>
        <AlignSetter onChangeAlignment={onChangeAlignment} style={fields?.textAlign} />
      </div>

      <div className="mb-5">
        <label htmlFor="font-size" className=" text-gray-400 font-light text-sm">
          Style
        </label>
        <FontStyleSetter onChangeFontStyle={onChangeFontStyle} styles={fields?.fontStyles} />
      </div>
      <div className="mb-5">
        <label htmlFor="font-size" className=" text-gray-400 font-light text-sm">
          Letter spacing
        </label>
        <SliderInput onChange={onLetterSpacingChange} value={fields.charSpacing} min={1} max={400} />
      </div>
      <div className="mb-5">
        <label htmlFor="font-size" className=" text-gray-400 font-light text-sm">
          Line height
        </label>
        <SliderInput onChange={onLineSpacingChange} value={fields.lineHeight} min={0.1} max={10} step={0.1} />
      </div>
    </FormProvider>
  );
}
