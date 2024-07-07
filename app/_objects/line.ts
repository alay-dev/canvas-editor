import { fabric } from "fabric";
import { uuid } from "@/utils";

export const drawLine = (options: any) => {
  const { points, canvas, ...rest } = options;

  const line = new fabric.FLine(points || [0, 0, 300, 0], {
    strokeWidth: 4,
    stroke: "#BBDEFB",
    strokeLineJoin: "round",
    strokeLineCap: "round",
    borderColor: "#BBDEFB",
    id: uuid(),
    ...rest,
  });

  canvas.viewportCenterObject(line);
  line.set({
    x1: line.left,
    y1: line.top,
    x2: line.left ? line.left + 300 : 300,
    y2: line.top,
  });
  canvas.add(line);
  canvas.setActiveObject(line);
  canvas.requestRenderAll();
  return line;
};

export const drawArrowLine = (options: any) => {
  const { points, canvas, ...rest } = options;

  const arrow = new fabric.FArrow(points || [0, 0, 300, 0], {
    strokeWidth: 4,
    stroke: "#BBDEFB",
    fill: "#BBDEFB",
    strokeLineJoin: "round",
    strokeLineCap: "round",
    borderColor: "#BBDEFB",
    ...rest,
  });

  canvas.viewportCenterObject(arrow);
  arrow.set({
    x1: arrow.left,
    y1: arrow.top,
    x2: arrow.left ? arrow.left + 300 : 300,
    y2: arrow.top,
  });
  canvas.add(arrow);
  canvas.setActiveObject(arrow);
  canvas.requestRenderAll();
  return arrow;
};
