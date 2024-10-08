import { fabric } from "fabric";
import { uuid } from "@/lib/utils";

export const createGroup = (options: any) => {
  const { items, canvas, ...rest } = options;

  const group = new fabric.Group(items, { id: uuid(), ...rest });

  canvas.add(group);
  return group;
};
