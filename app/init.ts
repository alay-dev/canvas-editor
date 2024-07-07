//@ts-nocheck

"use client";

import { fabric } from "fabric";
import { message } from "antd";
import {
  calcCanvasZoomLevel,
  handleFLinePointsWhenMoving,
} from "@/utils/helper";
import initControl from "./_controller";

import { initObjectPrototype } from "@/app/_objects/init";
import { throttle } from "lodash";
import { loadFont } from "@/utils";
import {
  initAligningGuidelines,
  initCenteringGuidelines,
} from "@/app/_guide-lines";

import {
  SKETCH_ID,
  CANVAS_CUSTOM_PROPS,
  SCHEMA_VERSION,
} from "@/utils/constants";
import FabricHistory from "@/app/_extensions/history";
import AutoSave from "@/app/_extensions/autosave";
import { createGroup } from "./_objects/group";
import createCustomClass from "./_custom-objects";
import {
  HOVER_OBJECT_CORNER,
  HOVER_OBJECT_CONTROL,
  CAPTURE_SUBTARGET_WHEN_DBLCLICK,
  LOAD_JSON_IGNORE_LOAD_FONT,
} from "@/config";
import { toast } from "sonner";
import dynamic from "next/dynamic";

export default class Editor {
  public canvas: fabric.Canvas | null = null;
  private _options;
  private _template;
  public sketch: fabric.Rect | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _pan;
  public fhistory: FabricHistory | null = null;
  public autoSave: AutoSave | null = null;

  constructor(options: any) {
    const { template, ...rest } = options;
    this._options = rest;
    this._template = template;
    this._pan = {
      enable: false,
      isDragging: false,
      lastPosX: 0,
      lastPosY: 0,
    };
  }

  public async init() {
    this._initObject();
    this._initCanvas();
    this._initEvents();
    this._initSketch();
    this._initGuidelines();

    this.autoSave = new AutoSave(this);
    await this.autoSave.loadFromLocal();
    this.fhistory = new FabricHistory(this);
    this.autoSave.init();
  }

  private _initObject() {
    initObjectPrototype();
    createCustomClass();
    initControl();
  }

  private _initCanvas() {
    const { canvasEl, workspaceEl } = this._options;
    this.canvas = new fabric.Canvas(canvasEl, {
      selection: true,
      containerClass: "canvas-editor",
      enableRetinaScaling: true,
      fireRightClick: true,
      controlsAboveOverlay: true,
      width: workspaceEl.offsetWidth,
      height: workspaceEl.offsetHeight,
      backgroundColor: "#ddd",
      preserveObjectStacking: true,
      imageSmoothingEnabled: false,
      selectionColor: "rgba(46, 115, 252, 0.11)",
      selectionBorderColor: "rgba(98, 155, 255, 0.81)",
      selectionLineWidth: 1.5,
    });
  }

  private _initGuidelines() {
    initAligningGuidelines(this.canvas);
    initCenteringGuidelines(this.canvas);
  }

  private _initSketch() {
    // deafult size
    const { width = 1242, height = 1660 } = this._template || {};
    const sketch = new fabric.Rect({
      fill: "#ffffff",
      left: 0,
      top: 0,
      width,
      height,
      selectable: false,
      hasControls: false,
      hoverCursor: "default",
      id: SKETCH_ID,
      canvas_name: "New canvas",
    });

    this.canvas?.add(sketch);
    this.canvas?.requestRenderAll();
    this.sketch = sketch;

    this._initResizeObserver();
    this._adjustSketch2Canvas();
  }

  public setSketchSize(size: any) {
    this.sketch?.set(size);
    this._adjustSketch2Canvas();
  }

  private _initResizeObserver() {
    const { workspaceEl } = this._options;
    this._resizeObserver = new ResizeObserver(
      throttle(() => {
        this.canvas?.setWidth(workspaceEl.offsetWidth);
        this.canvas?.setHeight(workspaceEl.offsetHeight);
        this._adjustSketch2Canvas();
      }, 50)
    );
    this._resizeObserver.observe(workspaceEl);
  }

  private _adjustSketch2Canvas() {
    if (!this.canvas) return;

    const zoomLevel = calcCanvasZoomLevel(
      {
        width: this.canvas?.width || 0,
        height: this.canvas?.height || 0,
      },
      {
        width: this.sketch?.width || 0,
        height: this.sketch?.height || 0,
      }
    );

    const center = this.canvas?.getCenter();
    this.canvas?.zoomToPoint(
      new fabric.Point(center?.left || 0, center?.top || 0),
      zoomLevel - 0.04
    );

    // sketch
    const sketchCenter = this.sketch?.getCenterPoint();
    const viewportTransform = this.canvas?.viewportTransform;
    // @ts-ignore
    viewportTransform[4] =
      this.canvas.width / 2 - sketchCenter.x * viewportTransform[0];
    // @ts-ignore
    viewportTransform[5] =
      this.canvas.height / 2 - sketchCenter.y * viewportTransform[3];
    // @ts-ignore
    this.canvas.setViewportTransform(viewportTransform);
    this.canvas.requestRenderAll();

    this.sketch?.clone((cloned) => {
      this.canvas.clipPath = cloned;
      this.canvas.requestRenderAll();
    });
  }

  private _initEvents() {
    this.canvas?.on("mouse:down", (opt) => {
      const evt = opt.e;
      if (this._pan.enable) {
        this._pan = {
          enable: true,
          isDragging: true,
          lastPosX: evt.clientX,
          lastPosY: evt.clientY,
        };
      }
    });
    this.canvas?.on("mouse:move", (opt) => {
      if (this._pan.enable && this._pan.isDragging) {
        const { e } = opt;
        const vpt = this.canvas?.viewportTransform;
        // @ts-ignore
        vpt[4] += e.clientX - this._pan.lastPosX;
        // @ts-ignore
        vpt[5] += e.clientY - this._pan.lastPosY;
        this.canvas?.requestRenderAll();
        this._pan.lastPosX = e.clientX;
        this._pan.lastPosY = e.clientY;
      }
    });
    this.canvas?.on("mouse:over", (opt) => {
      const { target } = opt;
      if (this._pan.enable) return;

      if (HOVER_OBJECT_CORNER) {
        const corner = target?.__corner;
        // if (corner) {
        //   handleMouseOverCorner(corner, opt.target);
        // }
      }

      if (HOVER_OBJECT_CONTROL) {
        if (
          target &&
          target.id !== SKETCH_ID &&
          target !== this.canvas?.getActiveObject()
        ) {
          // @ts-ignore
          target._renderControls(this.canvas.contextTop, {
            hasControls: false,
          });
        }
      }
    });
    this.canvas?.on("mouse:out", (opt) => {
      const { target } = opt;
      if (HOVER_OBJECT_CORNER) {
        if (target && target.id !== SKETCH_ID) {
          // handleMouseOutCorner(target);
          this.canvas?.requestRenderAll();
        }
      }
    });
    this.canvas?.on("mouse:up", (opt) => {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      if (this._pan.enable) {
        // @ts-ignore
        this.canvas.setViewportTransform(this.canvas.viewportTransform);
        this._pan.isDragging = false;
      }
    });
    this.canvas?.on("mouse:wheel", this._scrollSketch.bind(this));

    this.canvas?.on("mouse:dblclick", (opt) => {
      const { target, subTargets } = opt;
      const subTarget = subTargets?.[0];
      if (target?.type === "group" && subTarget) {
        if (subTarget.type === "custom-text") {
          this._editTextInGroup(target, subTarget);
        } else {
          if (CAPTURE_SUBTARGET_WHEN_DBLCLICK) {
            subTarget.set("hasControls", false);
            this.canvas?.discardActiveObject();
            this.canvas?.setActiveObject(subTarget);
            this.canvas?.requestRenderAll();
          }
        }
      }
    });

    this.canvas?.on("object:modified", (opt) => {
      const { target } = opt;
      if (!target || target.id === SKETCH_ID) return;
      const scaledWidth = target.getScaledWidth();
      const scaledHeight = target.getScaledHeight();
      if (target.type !== "f-line" && target.type !== "f-image") {
        if (target.type !== "custom-text") {
          target.setControlVisible("mt", scaledWidth >= 100);
          target.setControlVisible("mb", scaledWidth >= 100);
        }
        target.setControlVisible("ml", scaledHeight >= 40);
        target.setControlVisible("mr", scaledHeight >= 40);
        this.canvas?.requestRenderAll();
      }

      if (
        target.type === "f-line" ||
        target.type === "f-arrow" ||
        target.type === "f-tri-arrow"
      ) {
        // fabric Line doesnot change points when moving
        // but change left/top when change points ....
        handleFLinePointsWhenMoving(opt);
      }
    });
  }

  private _editTextInGroup(group, textbox) {
    let items = group.getObjects();

    textbox.on("editing:exited", () => {
      for (let i = 0; i < items.length; i++) {
        this.canvas?.remove(items[i]);
      }
      const grp = createGroup({
        items,
        canvas: this.canvas,
      });
      this.canvas?.renderAll();
      this.canvas?.setActiveObject(grp);
      this.canvas?.fire("fabritor:group", {
        target: this.canvas?.getActiveObject(),
      });

      textbox.off("editing:exited");
    });

    group._restoreObjectsState();
    this.canvas?.remove(group);
    this.canvas?.renderAll();
    for (let i = 0; i < items.length; i++) {
      items[i].selectable = false;
      items[i].set("hasControls", false);
      this.canvas?.add(items[i]);
    }
    this.canvas?.renderAll();

    this.canvas?.setActiveObject(textbox);
    textbox.enterEditing();
    textbox.selectAll();
  }

  public switchEnablePan() {
    if (!this.canvas) return;
    this._pan.enable = !this._pan.enable;
    this.canvas?.discardActiveObject();
    this.canvas.hoverCursor = this._pan.enable ? "grab" : "move";
    this.canvas?.getObjects().forEach((obj) => {
      if (obj.id !== SKETCH_ID) {
        obj.set("selectable", !this._pan.enable);
      }
    });
    this.canvas.selection = !this._pan.enable;
    this.canvas?.requestRenderAll();
    return this._pan.enable;
  }

  public getIfPanEnable() {
    return this._pan.enable;
  }

  public fireCustomModifiedEvent(data: any = null) {
    this.canvas?.fire("fabritor:object:modified", data);
  }

  private _scrollSketch(opt) {
    const delta = opt.e.deltaY;
    let zoom = this.canvas?.getZoom() || 1;
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    const center = this.canvas?.getCenter();
    this.canvas?.zoomToPoint({ x: center.left, y: center.top }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  }

  public destroy() {
    if (this.canvas) {
      this.canvas?.dispose();
      // @ts-ignore
      this.canvas = null;
    }
    if (this.fhistory) {
      this.fhistory.dispose();
    }
    if (this.autoSave) {
      this.autoSave.dispose();
    }
    const { workspaceEl } = this._options;
    if (this._resizeObserver) {
      this._resizeObserver.unobserve(workspaceEl);
      this._resizeObserver = null;
    }
  }

  public export2Img(options: any) {
    const transform = this.canvas?.viewportTransform;
    this.canvas?.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const { left, top, width, height } = this.sketch;
    const dataURL = this.canvas?.toDataURL({
      // multiplier: 2,
      left,
      top,
      width,
      height,
      format: "png",
      ...options,
    });
    // @ts-ignore
    this.canvas.setViewportTransform(transform);
    return dataURL;
  }

  public export2Svg() {
    const { left, top, width, height } = this.sketch;
    const svg = this.canvas?.toSVG({
      width,
      height,
      viewBox: {
        x: left,
        y: top,
        width,
        height,
      } as any,
    });

    if (!svg) {
      toast("Failed to export some svgs");
      return;
    }
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  public canvas2Json() {
    const json = this.canvas?.toJSON(CANVAS_CUSTOM_PROPS);

    return json;
  }

  public async loadFromJSON(json: string | JSON, errorToast = false) {
    if (!json) return false;
    if (typeof json === "string") {
      try {
        json = JSON.parse(json);
      } catch (e) {
        console.log(e);
        errorToast &&
          message.error("Failed to load local template, please try again.");
        return false;
      }
    }

    if (LOAD_JSON_IGNORE_LOAD_FONT) {
      const { objects } = json;
      for (let item of objects) {
        if (item.type === "f-text") {
          await loadFont(item.fontFamily);
        }
      }
    }

    const lastActiveObject = this.canvas?.getActiveObject();
    let nowActiveObject: any;

    // disabled auto save when load json
    this.autoSave?.setCanSave(false);

    return new Promise((resolve) => {
      this.canvas?.loadFromJSON(
        json,
        () => {
          this.canvas?.requestRenderAll();

          this.autoSave?.setCanSave(true);

          this.canvas?.fire("fabritor:load:json", {
            lastActiveObject: lastActiveObject,
          });

          resolve(true);
        },
        (o, obj) => {
          if (obj.id === SKETCH_ID) {
            this.sketch = obj;
            this.setSketchSize({ width: obj.width, height: obj.height });
          }
          // after undo/redo record last active object
          if (obj.id === lastActiveObject?.id) {
            nowActiveObject = obj;
          }
        }
      );
    });
  }

  public async clearCanvas() {
    const { width, height, canvas_name } = this.sketch;

    const originalJson = `{"version":"5.3.0","objects":[{"type":"rect","version":"5.3.0","originX":"left","originY":"top","left":0,"top":0,"width":${width},"height":${height},"fill":"#ffffff","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":true,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"stroke","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"id":"sketch-canvas","canvas_name":"${canvas_name}","selectable":false,"hasControls":false}],"clipPath":{"type":"rect","version":"5.3.0","originX":"left","originY":"top","left":0,"top":0,"width":${width},"height":${height},"fill":"#ffffff","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":true,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"stroke","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"selectable":true,"hasControls":true},"background":"#ddd"}`;
    await this.loadFromJSON(originalJson);
    this.fhistory?.reset();
  }
}
