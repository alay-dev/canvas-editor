import { lines } from "./line-type-list";
import { shapes } from "./shape-type-list";
import { drawArrowLine, drawLine } from "@/app/_objects/line";
import createRect from "@/app/_objects/rect";
import createShape from "@/app/_objects/shape";
import { useContext } from "react";
import { GloablStateContext } from "@/context/global-context";
import { createPathFromSvg } from "@/app/_objects/path";

export default function ShapePanel() {
  const { editor } = useContext(GloablStateContext);

  const addLine = (item: any) => {
    const { type, options = {} } = item;
    const canvas = editor?.canvas;
    switch (type) {
      case "f-line":
        drawLine({ ...options, canvas });
        break;
      case "f-arrow":
        drawArrowLine({ ...options, canvas });
        break;
      default:
        break;
    }
  };

  const addShape = (item: any) => {
    const { key, elem, options } = item;
    const canvas = editor?.canvas;
    switch (key) {
      case "rect":
      case "rect-r":
        createRect({ ...options, canvas });
        break;
      case "star":
      case "heart":
        createPathFromSvg({
          svgString: elem,
          canvas,
          sub_type: key,
          strokeWidth: 20,
        });
        break;
      default:
        createShape(item.shape, { ...options, canvas });
        break;
    }
  };

  return (
    <div className="p-4 w-full">
      <h2 className="text-gray-300 text-sm">Lines</h2>
      <div className="h-px bg-gray-500" />
      <div className="grid grid-cols-3 gap-4">
        {lines.map((item) => (
          <div
            key={item.key}
            onClick={() => {
              addLine(item);
            }}
            className="fabritor-panel-shape-item"
          >
            <img
              src={`data:image/svg+xml,${encodeURIComponent(item.svg)}`}
              alt=""
              style={{ width: 48, height: 48 }}
            />
          </div>
        ))}
      </div>
      <h2 className="text-gray-300 text-sm mt-3">Shape</h2>
      <div className="h-px bg-gray-500 " />
      <div className="grid grid-cols-3 gap-4 items-center justify-center mt-5 place-items-center">
        {shapes.map((item) => (
          <div
            key={item.key}
            onClick={() => {
              addShape(item);
            }}
            className="fabritor-panel-shape-item"
          >
            <img
              src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                item.elem
              )}`}
              style={{ width: 64, height: 64 }}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}
