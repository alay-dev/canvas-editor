import { ReactElement, useContext, useState } from "react";

import TextPanel from "./text-panel";
import ImagePanel from "./image-panel";
import PaintPanel from "./paint-panel";
import DesignPanel from "./design-panel";
import ShapePanel from "./shape-panel";
import { GloablStateContext } from "@/context/global-context";

import { PANEL_WIDTH } from "@/config";
import {
  Layers as LayerIcon,
  TextSquare as TextIcon,
  Gallery as PictureIcon,
  FullScreen as ShapeIcon,
  Pen as BrushIcon,
  CodeScan as ApplicationIcon,
  AltArrowLeft as LeftIcon,
} from "solar-icon-set";

import { cn } from "@/lib/utils";

const OBJECT_TYPES: { label: string; value: string; icon: ReactElement }[] = [
  {
    label: "Layer",
    value: "design",
    icon: <LayerIcon size={24} iconStyle="BoldDuotone" color="#fff" />,
  },
  {
    label: "Text",
    value: "text",
    icon: <TextIcon size={24} iconStyle="BoldDuotone" color="#fff" />,
  },
  {
    label: "Picture",
    value: "image",
    icon: <PictureIcon size={22} iconStyle="BoldDuotone" color="#fff" />,
  },
  {
    label: "Shape",
    value: "shape",
    icon: <ShapeIcon size={22} iconStyle="BoldDuotone" color="#fff" />,
  },
  {
    label: "Brush",
    value: "paint",
    icon: <BrushIcon size={22} iconStyle="BoldDuotone" color="#fff" />,
  },
];

export default function Panel() {
  const { editor } = useContext(GloablStateContext);
  const [selected, setSelected] = useState("text");
  const [isPanelHidden, setPanelHidden] = useState(false);

  const renderPanel = (value: string) => {
    if (value === "design") {
      return <DesignPanel />;
    }
    if (value === "text") {
      return <TextPanel />;
    }
    if (value === "image") {
      return <ImagePanel />;
    }
    if (value === "shape") {
      return <ShapePanel />;
    }
    if (value === "paint") {
      return <PaintPanel />;
    }
    return null;
  };

  const renderLabel = (item: any) => {
    return (
      <div className="flex flex-col items-center">
        <div className="text-gray-500">{item.icon}</div>
        <span className="text-xs font-light">{item.label}</span>
      </div>
    );
  };

  const handleTabChange = (k: string) => {
    setSelected(k);
    if (editor?.canvas) {
      if (k === "paint") {
        editor.canvas.isDrawingMode = true;
      } else {
        editor.canvas.isDrawingMode = false;
      }
    }
    if (isPanelHidden) setPanelHidden(false);
  };

  return (
    <div className="flex ">
      <aside className=" flex bg-background">
        <ul className="w-20  h-full pt-4  border-r  border-gray-600 space-y-2  flex-shrink-0">
          {OBJECT_TYPES.map((item) => {
            return (
              <li
                className={cn(
                  "py-3 cursor-pointer text-gray-300",
                  selected === item.value && "bg-black/30"
                )}
                onClick={() => handleTabChange(item.value)}
                key={item.value}
              >
                {renderLabel(item)}
              </li>
            );
          })}
        </ul>
      </aside>
      {!isPanelHidden ? (
        <div
          style={{ width: PANEL_WIDTH }}
          className="w-full bg-background relative"
        >
          <div className="absolute -right-4 top-1/2 z-40 -translate-y-1/2  cursor-pointer">
            <img src="/icons/panel-collapse.svg" alt="" className="w-5" />
            <LeftIcon
              className="absolute  top-1/2 -translate-y-1/2"
              color="#fff"
            />
          </div>

          {renderPanel(selected)}
        </div>
      ) : null}
    </div>
  );
}
