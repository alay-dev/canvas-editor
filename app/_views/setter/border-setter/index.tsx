import { useContext, useEffect } from "react";
import ColorSetter from "@/app/_components/color-picker";
import { GlobalStateContext } from "@/context/global-context";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
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
  const shapeObject = object;

  if (!shapeObject || !object?.height || !object?.width) throw new Error("Object is not initialized");
  const maxBorderRadius = Math.ceil(Math.min(object?.height, object?.width) / 2);
  const methods = useFormContext<BorderInputs>();
  const fields = methods.watch();

  console.log(fields);

  // useEffect(() => {
  //   if (object?.type !== "f-image") {
  //     methods.setValue("border", {
  //       type: getObjectBorderType(shapeObject),
  //       stroke: shapeObject.stroke || "#000",
  //       borderRadius: shapeObject.rx || shapeObject.ry || (shapeObject.strokeLineJoin === "round" ? 100 : 0),
  //       strokeDashArray: [],
  //       strokeWidth: shapeObject.strokeWidth,
  //     });
  //   } else {
  //     const border = imageObject?.getBorder();

  //     methods.setValue("border", {
  //       ...border,
  //       type: getObjectBorderType(border),
  //       stroke: imageObject.stroke || "#000",
  //       strokeWidth: border.strokeWidth || 0,
  //       borderRadius: border.borderRadius || 0,
  //     });
  //   }
  // }, [imageObject, shapeObject]);

  // useEffect(() => {
  //   const { type, stroke, strokeWidth, borderRadius } = fields.border || {};

  //   switch (object?.type) {
  //     case "f-image":
  //       if (type === "none") {
  //         imageObject?.setBorder({
  //           stroke: "",
  //           borderRadius,
  //           strokeDashArray: [],
  //           strokeWidth: 0,
  //           type: type,
  //         });
  //       } else {
  //         imageObject?.setBorder({
  //           stroke,
  //           strokeWidth,
  //           borderRadius,
  //           strokeDashArray: getStrokeDashArray({ type, strokeWidth }) || [],
  //           type: type,
  //         });
  //       }
  //       break;
  //     default:
  //       if (type === "none") {
  //         shapeObject?.set({
  //           stroke: "#000",
  //           rx: borderRadius,
  //           ry: borderRadius,
  //           strokeDashArray: [],
  //           strokeWidth: 0,
  //         });
  //       } else {
  //         shapeObject?.set({
  //           stroke: stroke,
  //           rx: borderRadius,
  //           ry: borderRadius,
  //           strokeDashArray: getStrokeDashArray({ type, strokeWidth }) || [],
  //           strokeWidth: strokeWidth,
  //         });
  //       }
  //   }

  //   editor?.canvas?.requestRenderAll();
  //   editor?.fireCustomModifiedEvent();
  // }, [fields]);

  const onChangeBorderColor = (val: string) => {
    const { type, strokeWidth, borderRadius } = fields.border || {};

    if (object.type === "f-image") {
      if (type === "none") {
        imageObject?.setBorder({ stroke: val, borderRadius, strokeDashArray: [], strokeWidth: 0, type: "line" });
      } else {
        imageObject?.setBorder({ stroke: val, strokeWidth, borderRadius, strokeDashArray: getStrokeDashArray({ type, strokeWidth }) || [], type: type });
      }
    } else {
      if (type === "none") {
        shapeObject?.set({ stroke: val, rx: borderRadius, ry: borderRadius, strokeDashArray: [], strokeWidth: 0, type: "line" });
      } else {
        shapeObject?.set({ stroke: val, rx: borderRadius, ry: borderRadius, strokeDashArray: getStrokeDashArray({ type, strokeWidth }) || [], strokeWidth: strokeWidth });
      }
    }

    methods.setValue("border.stroke.color", val);
    editor?.canvas?.requestRenderAll();
  };

  const onChangeBorderType = (val: string) => {
    const { stroke, strokeWidth, borderRadius } = fields.border || {};
    if (object.type === "f-image") {
      if (val === "none") {
        imageObject?.setBorder({ stroke: "", borderRadius, strokeDashArray: [], strokeWidth: 0, type: val });
      } else {
        imageObject?.setBorder({ stroke: stroke.color, strokeWidth, borderRadius, strokeDashArray: getStrokeDashArray({ type: val, strokeWidth }) || [], type: val });
      }
    } else {
      if (val === "none") {
        shapeObject?.set({ stroke: "", rx: borderRadius, ry: borderRadius, strokeDashArray: [], strokeWidth: 0 });
      } else {
        shapeObject?.set({ rx: borderRadius, ry: borderRadius, strokeDashArray: getStrokeDashArray({ type: val, strokeWidth }) || [], strokeWidth: strokeWidth });
      }
    }
    methods.setValue("border.type", val);
    editor?.canvas?.requestRenderAll();
  };

  const onChangeBorderWidth = (val: number) => {
    const { type, stroke, borderRadius } = fields.border || {};
    if (object.type === "f-image") {
      if (type === "none") {
        imageObject?.setBorder({ stroke: "", borderRadius, strokeDashArray: [], strokeWidth: 0, type: type });
      } else {
        imageObject?.setBorder({ stroke: stroke.color, strokeWidth: val, borderRadius, strokeDashArray: getStrokeDashArray({ type: type, strokeWidth: val }) || [], type: type });
      }
    } else {
      if (type === "none") {
        shapeObject?.set({ stroke: "", rx: borderRadius, ry: borderRadius, strokeDashArray: [], strokeWidth: 0 });
      } else {
        shapeObject?.set({ rx: borderRadius, ry: borderRadius, strokeDashArray: getStrokeDashArray({ type: type, strokeWidth: val }) || [], strokeWidth: val });
      }
    }
    methods.setValue("border.strokeWidth", val);
    editor?.canvas?.requestRenderAll();
  };

  const onChangeBorderRadius = (val: number) => {
    const { type, stroke, strokeWidth } = fields.border || {};
    if (object.type === "f-image") {
      imageObject?.setBorder({ stroke: stroke.color, strokeWidth, borderRadius: val, strokeDashArray: getStrokeDashArray({ type: type, strokeWidth }) || [], type: type });
    } else {
      shapeObject?.set({ rx: val, ry: val, strokeDashArray: getStrokeDashArray({ type: type, strokeWidth }) || [], strokeWidth: strokeWidth });
    }
    methods.setValue("border.borderRadius", val);
    editor?.canvas?.requestRenderAll();
  };

  return (
    <FormProvider {...methods}>
      <form>
        <label htmlFor="border-type" className="text-gray-400 font-light text-sm">
          Border
        </label>
        <div className="flex items-center gap-3 mt-4">
          <ColorSetter onChange={onChangeBorderColor} value={fields.border?.stroke?.color || "#000"} />
          <div className="flex flex-1 border border-gray-500 rounded-lg overflow-hidden  [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-500  ">
            {BORDER_TYPES?.map((item) => {
              return (
                <div onClick={() => onChangeBorderType(item.key)} key={item.key} className={cn(" flex-1 items-center justify-center flex py-2 cursor-pointer", fields.border?.type === item.key && "bg-gray-200 text-black")}>
                  {item.svg}
                </div>
              );
            })}
          </div>
        </div>

        <div className=" flex items-center mt-5">
          <label className="text-primary font-light text-sm w-28 flex-shrink-0">Border width</label>
          <SliderInput min={0} max={100} value={fields.border?.strokeWidth} onChange={onChangeBorderWidth} />
        </div>
        <div className="flex items-center mt-5">
          <label className="text-primary font-light text-sm w-28 flex-shrink-0">Border radius</label>
          <SliderInput min={0} max={maxBorderRadius} value={fields.border?.borderRadius} onChange={onChangeBorderRadius} />
        </div>
      </form>
    </FormProvider>
  );
}
