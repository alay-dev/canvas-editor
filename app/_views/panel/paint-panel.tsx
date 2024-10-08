import { useContext, useEffect, useState } from "react";
import { fabric } from "fabric";
import { DRAW_MODE_CURSOR, DRAG_ICON } from "@/public/icons";
import { GlobalStateContext } from "@/context/global-context";
import PathSetterForm from "@/app/_views/setter/PathSetter/PathSetterForm";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { loadImage } from "@/app/_objects/image";
import { uuid } from "@/lib/utils";
import { Fill } from "@/app/_components/fill";

const brushList = [
  {
    key: "p-1",
    svg: '<svg t="1701335273782" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="44143" width="32" height="32"><path d="M910.607 339.457c31.267-31.267 31.267-81.96 0-113.227l-113.21-113.193c-31.266-31.267-81.959-31.267-113.208 0l-28.315 28.298 226.436 226.42 28.297-28.298z m6.696 561.183H349.441L854.01 396.054l-226.434-226.42L89.81 707.4l0.231 0.231h-0.099v208.261c-0.051 0.537-0.082 1.082-0.082 1.634s0.031 1.096 0.082 1.635v14.491h11.778c1.587 0.494 3.275 0.76 5.026 0.76h810.557c9.317 0 16.887-7.552 16.887-16.886-0.001-9.335-7.57-16.886-16.887-16.886z" fill="#1296db" p-id="44144"></path></svg>',
    title: "pencil",
    options: {
      color: "#1296db",
      width: 4,
      strokeLineCap: "round",
    },
  },
  {
    key: "p-2",
    svg: '<svg t="1701335152027" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39748" width="32" height="32"><path d="M1002.644 893.774H142.004c-11.782 0-21.312 9.562-21.312 21.344v42.656c0 11.782 9.532 21.344 21.312 21.344h860.64c11.782 0 21.342-9.562 21.342-21.344v-42.656c0-11.782-9.56-21.344-21.342-21.344z" fill="#FF0000" p-id="39749"></path><path d="M368.282 731.496l-90.5-90.496c-8.344-8.344-21.842-8.344-30.156 0L6.256 882.34a21.42 21.42 0 0 0-5.968 18.528 21.298 21.298 0 0 0 11.532 15.656l120.654 60.344a21.552 21.552 0 0 0 9.532 2.25c5.532 0 11-2.156 15.094-6.25l211.184-211.184c4-4 6.25-9.438 6.25-15.094s-2.252-11.094-6.252-15.094z" fill="#FF0000" p-id="39750"></path><path d="M459.874 702.434l-150.84-150.84c-8.312-8.344-21.844-8.344-30.156 0l-181.028 180.996c-4 4-6.25 9.438-6.25 15.094s2.25 11.094 6.25 15.094l150.84 150.84a21.356 21.356 0 0 0 30.186 0l180.998-181.028c4-4 6.25-9.438 6.25-15.094s-2.25-11.062-6.25-15.062z" fill="#FF0000" p-id="39751"></path><path d="M947.866 184.288l-120.688-120.684c-12.094-12.062-28.156-18.718-45.25-18.718s-33.154 6.656-45.248 18.718L173.286 627a21.332 21.332 0 0 0 0 30.188l180.996 180.996c4 4 9.438 6.25 15.094 6.25s11.094-2.25 15.094-6.25l563.396-563.398c12.092-12.062 18.748-28.156 18.748-45.248 0-17.094-6.656-33.158-18.748-45.25z" fill="#FF0000" p-id="39752"></path><path d="M947.866 274.786c12.092-12.062 18.748-28.156 18.748-45.248 0-17.094-6.656-33.156-18.748-45.25l-120.688-120.684 90.5 90.53c12.094 12.062 18.75 28.156 18.75 45.25s-6.656 33.156-18.75 45.25L354.282 808.028c-4 4-9.406 6.25-15.062 6.25a21.36 21.36 0 0 1-15.094-6.25l30.156 30.156c4 4 9.438 6.25 15.094 6.25s11.094-2.25 15.094-6.25l563.396-563.398z" fill="#FF0000" opacity=".2" p-id="39753"></path></svg>',
    title: "marker",
    options: {
      color: "#FF0000",
      width: 36,
      strokeLineCap: "square",
    },
  },
];

export type PaintInputs = {
  stroke: Fill;
  width: number;
  isLocked?: boolean;
  shadow: {
    color: string;
    width: number;
    offset: number;
  };
};

export default function PaintPanel() {
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const { editor } = useContext(GlobalStateContext);

  const methods = useForm<PaintInputs>();

  // const handleBrushChange = (options) => {
  //   if (!editor) return;

  //   if (options.color) {
  //     editor.canvas.freeDrawingBrush.color = options.color;
  //   }
  //   if (options.width) {
  //     editor.canvas.freeDrawingBrush.width = options.width;
  //   }
  //   if (options.strokeLineCap) {
  //     editor.canvas.freeDrawingBrush.strokeLineCap = options.strokeLineCap;
  //   }
  //   if (options.shadow) {
  //     const shadow = editor.canvas.freeDrawingBrush.shadow;
  //     const originalShadowObject = shadow ? shadow.toObject() : {};
  //     const newShadowObject = {
  //       blur: options.shadow.width || originalShadowObject.blur,
  //       offsetX: options.shadow.offset || originalShadowObject.offsetX,
  //       offsetY: options.shadow.offset || originalShadowObject.offsetY,
  //       affectStroke: true,
  //       color: options.shadow.color || originalShadowObject.color,
  //     };
  //     editor.canvas.freeDrawingBrush.shadow = new fabric.Shadow(
  //       newShadowObject
  //     );
  //   }
  // };

  const stopFreeDrawMode = () => {
    if (!editor?.canvas) return;
    editor.canvas.isDrawingMode = !editor?.canvas?.isDrawingMode;
    setIsDrawingMode(!isDrawingMode);
  };

  const initBrush = () => {
    if (!editor?.canvas) return;
    if (editor) {
      editor.canvas.isDrawingMode = true;
      editor.canvas.freeDrawingCursor = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRAW_MODE_CURSOR)}") 4 12, crosshair`;
      const freeDrawingBrush = new fabric.PencilBrush(editor.canvas);
      editor.canvas.freeDrawingBrush = freeDrawingBrush;
      const { color, width } = brushList[0].options;
      freeDrawingBrush.color = color;
      freeDrawingBrush.width = width;
      freeDrawingBrush.shadow = new fabric.Shadow({ blur: 0, offsetX: 0, offsetY: 0, affectStroke: true, color: "#000000" });

      methods.setValue("stroke", { type: "solid", color: color });
      methods.setValue("width", width);
      methods.setValue("shadow", { color: "#000000", width: 0, offset: 0 });
    }

    return () => {
      if (editor?.canvas) {
        editor.canvas.isDrawingMode = false;
      }
    };
  };

  useEffect(() => {
    return initBrush();
  }, []);

  const src = "https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&h=130";

  const handleAddFrame = async () => {
    const img = new Image();
    img.src = src;

    fabric.Image.fromURL(src, (img) => {
      const rect = new fabric.Image(img.getElement(), { width: 500, height: 500 });
      const filter = new fabric.Image.filters.BlendColor({
        color: "#000",
        mode: "overlay",
      });

      rect?.filters?.push(filter);
      editor?.canvas?.add(rect);
      editor?.canvas?.requestRenderAll();
    });
  };

  return (
    <div className="p-4 w-full">
      <FormProvider {...methods}>
        <PathSetterForm mode="paint" />
        {/* <Button onClick={handleAddFrame}>Add frame</Button> */}
      </FormProvider>
    </div>
  );
}
