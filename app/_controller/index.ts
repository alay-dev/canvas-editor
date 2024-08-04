"use client";

import { fabric } from "fabric";
import { initRectControl } from "./rect";
import { initLineControl } from "./fline";
import { initFTextControl } from "./ftext";

const renderSizeIcon = (ctx: any, left: number, top: number, styleOverride: any, fabricObject: any, TBorLR: string) => {
  const xSize = TBorLR === "TB" ? 20 : 6;
  const ySize = TBorLR === "TB" ? 6 : 20;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#bbbbbb";
  ctx.lineWidth = 2;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "#dddddd";
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.beginPath();
  ctx.roundRect(-xSize / 2, -ySize / 2, xSize, ySize, 10);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};

const renderLRIcon = (ctx: any, left: number, top: number, styleOverride: any, fabricObject: any) => {
  renderSizeIcon(ctx, left, top, styleOverride, fabricObject, "LR");
};

const renderTBIcon = (ctx: any, left: number, top: number, styleOverride: any, fabricObject: any) => {
  renderSizeIcon(ctx, left, top, styleOverride, fabricObject, "TB");
};

export const renderVertexIcon = (ctx: any, left: number, top: number, styleOverride: any, fabricObject: any) => {
  const size = 10;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#bbbbbb";
  ctx.lineWidth = 2;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "#dddddd";
  ctx.beginPath();
  ctx.arc(left, top, size / 2, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};

export const renderController = () => {
  // middle top
  const mtConfig = { x: 0, y: -0.5, offsetY: -1, render: renderTBIcon };
  fabric.Object.prototype.controls.mt.x = mtConfig.x;
  fabric.Object.prototype.controls.mt.y = mtConfig.y;
  fabric.Object.prototype.controls.mt.offsetY = mtConfig.offsetY;
  fabric.Object.prototype.controls.mt.render = mtConfig.render;

  // middle bottom
  const mbConfig = { x: 0, y: 0.5, offsetY: 1, render: renderTBIcon };
  fabric.Object.prototype.controls.mb.x = mbConfig.x;
  fabric.Object.prototype.controls.mb.y = mbConfig.y;
  fabric.Object.prototype.controls.mb.offsetY = mbConfig.offsetY;
  fabric.Object.prototype.controls.mb.render = mbConfig.render;

  // middle left
  const mlConfig = { x: -0.5, y: 0, offsetX: -1, render: renderLRIcon };
  fabric.Object.prototype.controls.ml.x = mlConfig.x;
  fabric.Object.prototype.controls.ml.y = mlConfig.y;
  fabric.Object.prototype.controls.ml.offsetX = mlConfig.offsetX;
  fabric.Object.prototype.controls.ml.render = mlConfig.render;

  // middle right
  const mrConfig = { x: 0.5, y: 0, offsetX: 1, render: renderLRIcon };
  fabric.Object.prototype.controls.mr.x = mrConfig.x;
  fabric.Object.prototype.controls.mr.y = mrConfig.y;
  fabric.Object.prototype.controls.mr.offsetX = mrConfig.offsetX;
  fabric.Object.prototype.controls.mr.render = mrConfig.render;

  // top left
  const tlConfig = { x: -0.5, y: -0.5, render: renderVertexIcon };
  fabric.Object.prototype.controls.tl.x = tlConfig.x;
  fabric.Object.prototype.controls.tl.y = tlConfig.y;
  fabric.Object.prototype.controls.tl.render = tlConfig.render;

  // top right
  const trConfig = { x: 0.5, y: -0.5, render: renderVertexIcon };
  fabric.Object.prototype.controls.tr.x = trConfig.x;
  fabric.Object.prototype.controls.tr.y = trConfig.y;
  fabric.Object.prototype.controls.tr.render = trConfig.render;

  // bottom left
  const blConfig = { x: -0.5, y: 0.5, render: renderVertexIcon };
  fabric.Object.prototype.controls.bl.x = blConfig.x;
  fabric.Object.prototype.controls.bl.y = blConfig.y;
  fabric.Object.prototype.controls.bl.render = blConfig.render;

  // bottom right
  const brConfig = { x: 0.5, y: 0.5, render: renderVertexIcon };
  fabric.Object.prototype.controls.br.x = brConfig.x;
  fabric.Object.prototype.controls.br.y = brConfig.y;
  fabric.Object.prototype.controls.br.render = brConfig.render;
};

export default function initControl() {
  renderController();
  initRectControl();
  initLineControl();
  initFTextControl();
}
