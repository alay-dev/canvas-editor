import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import FontFaceObserver from "fontfaceobserver";
import { v4 as uuidv4 } from "uuid";
import { FONT_PRESET_FAMILY_LIST } from "../constants/canvas";
import { fabric } from "fabric";
import { Fill } from "@/app/_components/fill";
import { Border } from "@/types/custom-image";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const loadFont = async (f: string) => {
  if (!f) return Promise.resolve();
  const item = FONT_PRESET_FAMILY_LIST.find((_item) => _item === f);
  if (!item) return Promise.resolve();
  const font = new FontFaceObserver(f);
  return font.load(null, 1000 * 100).catch((e) => {
    console.error(e);
  });
};

export const uuid = () => {
  return uuidv4();
};

export const downloadFile = (content: string, type: string, name: string) => {
  const link = document.createElement("a");
  link.href = content;
  link.download = `${name || uuid()}.${type}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

type Angles = 45 | 90 | 135 | 180 | 225 | 270 | 315 | 0;

const AngleCoordsMap: Record<Angles, string> = {
  45: JSON.stringify({ x1: 0, y1: 1, x2: 1, y2: 0 }),
  90: JSON.stringify({ x1: 0, y1: 0, x2: 1, y2: 0 }),
  135: JSON.stringify({ x1: 0, y1: 0, x2: 1, y2: 1 }),
  180: JSON.stringify({ x1: 0, y1: 0, x2: 0, y2: 1 }),
  225: JSON.stringify({ x1: 1, y1: 0, x2: 0, y2: 1 }),
  270: JSON.stringify({ x1: 1, y1: 0, x2: 0, y2: 0 }),
  315: JSON.stringify({ x1: 1, y1: 1, x2: 0, y2: 0 }),
  0: JSON.stringify({ x1: 0, y1: 1, x2: 0, y2: 0 }),
};

const transformAngle2Coords = (angle: number) => {
  const _angle = (angle % 360) as Angles;
  return JSON.parse(AngleCoordsMap[_angle] || AngleCoordsMap[90]);
};

// const transformCoords2Angel = (coords: any) => {
//   const keys = Object.keys(AngleCoordsMap);
//   for (let key of keys) {
//     let _coords = { ...coords };
//     _coords = {
//       x1: coords.x1 > 1 ? 1 : 0,
//       y1: coords.y1 > 1 ? 1 : 0,
//       x2: coords.x2 > 1 ? 1 : 0,
//       y2: coords.y2 > 1 ? 1 : 0,
//     };
//     if (JSON.stringify(_coords) === AngleCoordsMap[key]) {
//       return Number(key);
//     }
//   }
//   return 90;
// };

export const transfromObjectStrokeToStroke = (v: any): Fill => {
  if (v instanceof fabric.Pattern && typeof v.source !== "string") {
    return { type: "image", image: v.source.currentSrc };
  }

  return { type: "solid", color: v || "#000" };
};

export const transformFill2Colors = (v: any): Fill => {
  // if (!v || typeof v === "string" || v instanceof fabric.Pattern) {

  if (v instanceof fabric.Pattern && typeof v.source !== "string") {
    return { type: "image", image: v.source.currentSrc };
  }
  return { type: "solid", color: v || "#555" };
  // }
  // return {
  //   type: v.type,
  //   gradient: {
  //     colorStops: v.colorStops,
  //     angle: transformCoords2Angel(v.coords),
  //   },
  // };
};

export const transformColors2Fill = (v: any) => {
  let fill: any;
  switch (v?.type) {
    case "solid":
      fill = v.color;
      break;
    case "linear":
      fill = {
        type: "linear",
        gradientUnits: "percentage",
        coords: transformAngle2Coords(v.gradient.angle),
        colorStops: v.gradient.colorStops,
      };
      break;
    case "radial":
      fill = {
        type: "radial",
        gradientUnits: "percentage",
        coords: { x1: 0.5, y1: 0.5, x2: 0.5, y2: 0.5, r1: 0, r2: 1 },
        colorStops: v.gradient.colorStops,
      };
    default:
      break;
  }
  return fill;
};

const getType = (type: string) => {
  if (type.indexOf("text") === 0) {
    return "text";
  }
  if (type.indexOf("image/") === 0) {
    return "image";
  }
  return "";
};

export const readBlob = async (blob: Blob, blobType: string) => {
  const type = getType(blobType);
  if (!type) return Promise.resolve(null);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({ type, result: e.target?.result });
    };
    reader.onerror = (e) => {
      console.log(e);
      resolve(null);
    };
    if (type === "text") {
      reader.readAsText(blob);
    } else if (type === "image") {
      reader.readAsDataURL(blob);
    }
  });
};

export const getSystemClipboard = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const result = await readBlob(await clipboardItem.getType(type), type);
        if (result) {
          return result;
        }
      }
    }
    return null;
  } catch (err: any) {
    console.error(err.name, err.message);
    return null;
  }
};

export const base64ToBlob = async (base64Data: string) => {
  return fetch(base64Data).then((res) => {
    return res.blob();
  });
};

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
