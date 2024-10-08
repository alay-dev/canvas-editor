//@ts-nocheck

import { fabric } from "fabric";
import { OBJECT_DEFAULT_CONFIG } from "@/constants/canvas";
import { IMAGE_CLIPPATH_QUALITY } from "@/config";

export const initObjectPrototype = () => {
  if (IMAGE_CLIPPATH_QUALITY) {
    fabric.Image.prototype.needsItsOwnCache = () => false;
    fabric.perfLimitSizeTotal = 16777216; // allows for up to 4096x4096 cache
  }

  // Text global config
  Object.keys(OBJECT_DEFAULT_CONFIG).forEach((key) => {
    fabric.Object.prototype[key] = OBJECT_DEFAULT_CONFIG[key];
  });

  // Selection/Group global config
  const asConfig = {
    borderDashArray: [7, 10],
    borderScaleFactor: 3,
    padding: 10,
  };
  Object.keys(asConfig).forEach((key) => {
    fabric.ActiveSelection.prototype[key] = asConfig[key];
    fabric.Group.prototype[key] = asConfig[key];
  });

  fabric.Group.prototype.subTargetCheck = true;
};
