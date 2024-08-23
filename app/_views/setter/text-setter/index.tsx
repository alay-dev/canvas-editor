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
import ShadowSetter, { Shadow } from "@/app/_components/shadow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fontSizes = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "14", "16", "20", "22", "24", "26", "30", "32", "34", "36", "38", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100", "110", "120"];

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
      fontWeight: customTextObject.fontWeight?.toString() || "400",
      shadow:
        object?.shadow instanceof fabric.Shadow
          ? { offsetX: object?.shadow?.offsetX, offsetY: object?.shadow?.offsetY, blur: object?.shadow?.blur, color: object?.shadow?.color, affectStroke: object?.shadow?.affectStroke }
          : { offsetX: 0, offsetY: 0, blur: 0, color: object?.shadow || "#000", affectStroke: false },
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

  const onFontSizeChange = (val: string) => {
    methods.setValue("fontSize", +val);
    customTextObject.set("fontSize", +val);
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

  const onFontWeightChange = (val: string) => {
    methods.setValue("fontWeight", val);
    customTextObject.set("fontWeight", val);
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

  const handleChangeShadow = (val: Shadow) => {
    const shadow = new fabric.Shadow({ blur: val.blur, color: val.color, offsetX: val.offsetX, offsetY: val.offsetY, affectStroke: val.affectStroke });
    methods.setValue("shadow", val);
    object?.set("shadow", shadow);
    editor?.canvas?.requestRenderAll();
  };

  return (
    <FormProvider {...methods}>
      <CommonSetter />
      <div className="mb-5 mt-6">
        <label htmlFor="font-size" className="font-light text-sm text-primary">
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

      <div className="mb-4 flex items-center gap-3">
        <FillSetter fill={fields.fill} onChange={onFillChange} />
        <Select value={fields?.fontSize?.toString()} onValueChange={onFontSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-20">
            {fontSizes?.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FontStyleSetter onChangeFontStyle={onChangeFontStyle} styles={fields?.fontStyles} />
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="text-more-option">
          <AccordionTrigger className="font-normal text-sm hover:no-underline text-gray-400">More options</AccordionTrigger>
          <AccordionContent>
            <div className="mb-8 mt-2 flex items-center gap-3">
              <Select value={fields?.fontWeight} onValueChange={onFontWeightChange}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">Thin</SelectItem>
                  <SelectItem value="400">Regular</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Bold</SelectItem>
                </SelectContent>
              </Select>
              <AlignSetter onChangeAlignment={onChangeAlignment} style={fields?.textAlign} />
            </div>

            <div className="mb-5 flex items-center">
              <label htmlFor="font-size" className="text-primary font-light text-sm w-28 flex-shrink-0">
                Letter spacing
              </label>
              <SliderInput onChange={onLetterSpacingChange} value={fields.charSpacing} min={1} max={400} />
            </div>
            <div className="mb-5 flex items-center gap-3">
              <label htmlFor="font-size" className="text-primary font-light text-sm w-28 flex-shrink-0">
                Line height
              </label>
              <SliderInput onChange={onLineSpacingChange} value={fields.lineHeight} min={0.1} max={10} step={0.1} />
            </div>
            <div className="mt-4 flex items-center gap-3 w-max ">
              <label className="text-primary font-light text-sm  w-28 flex-shrink-0">Shadow</label>
              <ShadowSetter onChange={handleChangeShadow} shadow={fields.shadow} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </FormProvider>
  );
}
