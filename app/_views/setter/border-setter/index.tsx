import { useContext, useEffect } from "react";
import ColorSetter from "@/app/_components/color-picker";
import { GlobalStateContext } from "@/context/global-context";
import { FormProvider, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Border } from "@/types/custom-image";
import SliderInput from "@/app/_components/slider-input";
import { FImage } from "fabric/fabric-impl";

export const getObjectBorderType = ({ stroke, strokeWidth, strokeDashArray }: Pick<Border, "stroke" | "strokeWidth" | "strokeDashArray">) => {
  if (!stroke) {
    return "none";
  }
  if (strokeDashArray?.length) {
    let [d1, d2] = strokeDashArray;
    d1 = d1 / (strokeWidth / 2 > 1 ? strokeWidth / 2 : strokeWidth);
    d2 = d2 / (strokeWidth / 4 > 1 ? strokeWidth / 4 : strokeWidth);
    return [d1, d2].join(",");
  }
  return "line";
};

export const getStrokeDashArray = ({ type, strokeWidth }: Pick<Border, "type" | "strokeWidth">) => {
  if (!type) return null;
  if (type !== "line") {
    const dashArray: number[] = type.split(",").map((item) => +item);
    dashArray[0] = dashArray[0] * (strokeWidth / 2 > 1 ? strokeWidth / 2 : strokeWidth);
    dashArray[1] = dashArray[1] * (strokeWidth / 4 > 1 ? strokeWidth / 4 : strokeWidth);
    return dashArray;
  }
  return null;
};

export const BORDER_TYPES = [
  {
    key: "none",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M19.071 19.071c-3.905 3.905-10.237 3.905-14.142 0-3.905-3.905-3.905-10.237 0-14.142 3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142ZM5.482 17.457 17.457 5.482A8.5 8.5 0 0 0 5.482 17.457Zm1.06 1.06A8.501 8.501 0 0 0 18.519 6.544L6.543 18.518Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
  {
    key: "line",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x2="24" y1="50%" y2="50%" stroke="currentColor" stroke-width="2" shape-rendering="crispEdges"></line>
      </svg>
    ),
  },
  {
    key: "12,2",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="-1" x2="25" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="12 2" stroke-width="2" shape-rendering="crispEdges"></line>
      </svg>
    ),
  },
  {
    key: "6,2",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1" x2="23" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="6 2" stroke-width="2" shape-rendering="crispEdges"></line>
      </svg>
    ),
  },
  {
    key: "2,2",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1" x2="23" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" shape-rendering="crispEdges"></line>
      </svg>
    ),
  },
];

type BorderInputs = {
  border: Border;
};

export default function BorderSetter() {
  const { editor, object } = useContext(GlobalStateContext);

  const imageObject = object as FImage;
  const shapeObject = object as any;

  if (!object?.height || !object?.width) throw new Error("Object is not initialized");

  const maxBorderRadius = Math.ceil(Math.min(object?.height, object?.width) / 2);

  const methods = useForm<BorderInputs>({
    defaultValues: {
      border: { type: "none" },
    },
  });

  const fields = methods.watch();

  useEffect(() => {
    if (object?.type !== "f-image") {
      methods.setValue("border", {
        type: getObjectBorderType(shapeObject),
        stroke: shapeObject.stroke || "#000",
        borderRadius: shapeObject.rx || shapeObject.ry || (shapeObject.strokeLineJoin === "round" ? 100 : 0),
        strokeDashArray: [],
        strokeWidth: shapeObject.strokeWidth,
      });
    } else {
      const border = imageObject?.getBorder();

      methods.setValue("border", {
        ...border,
        type: getObjectBorderType(border),
        stroke: imageObject.stroke || "#000",
        strokeWidth: border.strokeWidth || 0,
        borderRadius: border.borderRadius || 0,
      });
    }
  }, [imageObject, shapeObject]);

  useEffect(() => {
    const { type, stroke, strokeWidth, borderRadius } = fields.border || {};

    switch (object?.type) {
      case "f-image":
        if (type === "none") {
          imageObject?.setBorder({
            stroke: "",
            borderRadius,
            strokeDashArray: [],
            strokeWidth: 0,
            type: type,
          });
        } else {
          imageObject?.setBorder({
            stroke,
            strokeWidth,
            borderRadius,
            strokeDashArray: getStrokeDashArray({ type, strokeWidth }) || [],
            type: type,
          });
        }
        break;
      default:
        if (type === "none") {
          shapeObject?.set({
            stroke: "#000",
            rx: borderRadius,
            ry: borderRadius,
            strokeDashArray: [],
            strokeWidth: 0,
          });
        } else {
          shapeObject?.set({
            stroke: stroke,
            rx: borderRadius,
            ry: borderRadius,
            strokeDashArray: getStrokeDashArray({ type, strokeWidth }) || [],
            strokeWidth: strokeWidth,
          });
        }
    }

    editor?.canvas?.requestRenderAll();
    editor?.fireCustomModifiedEvent();
  }, [fields]);

  return (
    <FormProvider {...methods}>
      <form className="space-y-6 text-xs">
        <div>
          <label htmlFor="border-type" className=" text-gray-300 font-light text-sm">
            Border type
          </label>
          <div className="flex border border-gray-500 rounded-lg overflow-hidden mt-2 [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-500  ">
            {BORDER_TYPES?.map((item) => {
              return (
                <div onClick={() => methods.setValue("border.type", item.key)} key={item.key} className={cn(" flex-1 items-center justify-center flex py-2 cursor-pointer", fields.border.type === item.key && "bg-gray-200 text-black")}>
                  {item.svg}
                </div>
              );
            })}
          </div>
        </div>
        <div className="">
          <label className=" text-gray-300 font-light text-sm">Border color</label>
          <ColorSetter onChange={(val: string) => methods.setValue("border.stroke", val)} value={fields.border.stroke} />
        </div>
        <div>
          <label className=" text-gray-300 font-light text-sm">Border width</label>
          <SliderInput min={0} max={100} value={+fields.border.strokeWidth} onChange={(val) => methods.setValue("border.strokeWidth", val || 0)} />
        </div>
        <div>
          <label htmlFor="border-radius" className=" text-gray-300 font-light text-sm">
            Border radius
          </label>
          <SliderInput min={0} max={maxBorderRadius} value={+fields.border.borderRadius} onChange={(val) => methods.setValue("border.borderRadius", val || 0)} />
        </div>
      </form>
    </FormProvider>
  );
}
