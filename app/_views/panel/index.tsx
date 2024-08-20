import { ReactElement, useContext, useState } from "react";
import TextPanel from "./text-panel";
import ImagePanel from "./image-panel";
import PaintPanel from "./paint-panel";
import DesignPanel from "./design-panel";
import ShapePanel from "./shape-panel";
import { GlobalStateContext } from "@/context/global-context";
import { MENUITEM_WIDTH, PANEL_WIDTH } from "@/config";
import { Layers as LayerIcon, TextSquare as TextIcon, Gallery as PictureIcon, FullScreen as ShapeIcon, Pen as BrushIcon, CodeScan as ApplicationIcon, AltArrowLeft as LeftIcon, FullScreenSquare } from "solar-icon-set";
import { cn } from "@/lib/utils";
import IconPanel from "./icon-panel";

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
    label: "Icons",
    value: "icons",
    icon: <FullScreenSquare size={24} iconStyle="BoldDuotone" color="#fff" />,
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
  const { editor, isPanel, setPanel } = useContext(GlobalStateContext);
  const [selected, setSelected] = useState("text");

  const renderPanel = (value: string) => {
    switch (value) {
      case "design":
        return <DesignPanel />;
      case "text":
        return <TextPanel />;
      case "image":
        return <ImagePanel />;
      case "shape":
        return <ShapePanel />;
      case "paint":
        return <PaintPanel />;
      case "icons":
        return <IconPanel />;
      default:
        null;
    }
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
    setPanel(true);
  };

  const handleChangePanelVisibility = () => {
    setPanel(!isPanel);
    editor?._adjustSketch2Canvas();
  };

  return (
    <div className="flex">
      <aside className="flex bg-background relative">
        <ul style={{ width: MENUITEM_WIDTH }} className="h-full pt-4 border-r border-gray-600 space-y-2 flex-shrink-0">
          {OBJECT_TYPES.map((item) => {
            return (
              <li className={cn("py-3 cursor-pointer text-gray-300", selected === item.value && "bg-black/30")} onClick={() => handleTabChange(item.value)} key={item.value}>
                {renderLabel(item)}
              </li>
            );
          })}
        </ul>
        {!isPanel ? (
          <div onClick={handleChangePanelVisibility} className="absolute -right-4 top-1/2 z-40  -translate-y-1/2  cursor-pointer">
            <img src="/icons/panel-collapse.svg" alt="" className="w-5" />
            <LeftIcon className="absolute  top-1/2 -translate-y-1/2" color="#fff" />
          </div>
        ) : null}
      </aside>
      {isPanel ? (
        <div style={{ width: PANEL_WIDTH }} className="w-full bg-background relative">
          <div onClick={handleChangePanelVisibility} className="absolute -right-4 top-1/2 z-40 -translate-y-1/2  cursor-pointer">
            <img src="/icons/panel-collapse.svg" alt="" className="w-5" />
            <LeftIcon className="absolute  top-1/2 -translate-y-1/2" color="#fff" />
          </div>

          {renderPanel(selected)}
        </div>
      ) : null}
    </div>
  );
}
