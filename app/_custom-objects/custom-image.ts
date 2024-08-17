import { Border } from "@/types/custom-image";
import { fabric } from "fabric";

export type CustomImage = fabric.Object & {
  _createBorderRect(): fabric.Rect;
  _createClipPath(): fabric.Rect;
  setSrc(): void;
  getSrc(): string;
  setBorder(): void;
  getBorder(): any;
  applyFilter(): void;
  applyFilterValue(): void;
  getFilter(): any;
};

type ImageBorder = Pick<Border, "borderRadius" | "stroke" | "strokeWidth">;

type Options = {
  id: string;
  image: fabric.Image;
  imageBorder?: ImageBorder;
  stroke?: Pick<Border, "stroke">;
  strokeWidth?: Pick<Border, "strokeWidth">;
};

export const createFImageClass = () => {
  (fabric as any).FImage = fabric.util.createClass(fabric.Group, {
    type: "f-image",

    initialize(options: Options, alreayGrouped: boolean = false) {
      const { image, imageBorder = {}, ...rest } = options;
      image.set({
        originX: "center",
        originY: "center",
      });
      this.img = image;
      this.borderRect = this._createBorderRect(imageBorder);
      this.img.clipPath = this._createClipPath();
      this.callSuper("initialize", [this.img, this.borderRect], { borderDashArray: null, padding: 0, subTargetCheck: false, imageBorder, ...rest }, alreayGrouped);
    },

    _createBorderRect({ stroke, strokeWidth, borderRadius }: ImageBorder) {
      const width = this.img.getScaledWidth();
      const height = this.img.getScaledHeight();
      const options = { width, height, rx: borderRadius || 0, ry: borderRadius || 0, originX: "center", originY: "center", fill: "#00000000", paintFirst: "fill", stroke: "", strokeWidth: 0 };
      if (stroke) options.stroke = stroke;
      if (strokeWidth) options.strokeWidth = strokeWidth;
      return new fabric.Rect(options);
    },

    _createClipPath() {
      const width = this.img.width;
      const height = this.img.height;

      return new fabric.Rect({
        originX: "center",
        originY: "center",
        width,
        height,
        rx: this.borderRect.rx || 0,
        ry: this.borderRect.ry || 0,
      });
    },

    setSrc(src: string, callback: () => void) {
      this.img.setSrc(src, () => {
        const width = this.img.getScaledWidth();
        const height = this.img.getScaledHeight();
        this.img.setCoords();
        this.borderRect.set({ width, height, dirty: true });
        this.img.set({
          clipPath: this._createClipPath(),
          dirty: true,
        });
        this.addWithUpdate();
        callback && callback();
      });
    },

    getSrc() {
      return this.img.getSrc();
    },

    setBorder(b: Border) {
      this.borderRect.set({
        stroke: b.stroke || null,
        strokeWidth: b.strokeWidth || 1,
        rx: b.borderRadius || 0,
        ry: b.borderRadius || 0,
        strokeDashArray: b.strokeDashArray || null,
      });
      this.img.setCoords();
      this.img.set({
        clipPath: this._createClipPath(),
        dirty: true,
      });

      this.imageBorder = { ...b };
      this.addWithUpdate();
    },

    getBorder() {
      return this.imageBorder;
    },

    applyFilter(filter: any) {
      try {
        this.img.filters = filter ? [filter] : [];
        this.img.applyFilters();
      } catch (e) {
        console.log(e);
      }
    },

    applyFilterValue(prop: any, value: any) {
      const filter = this.getFilter();
      if (filter) {
        filter[prop] = value;
        this.img.filters = [filter];
        this.img.applyFilters();
      }
    },

    getFilter() {
      return this.img.filters[0];
    },

    toObject() {
      return fabric.util.object.extend(this.callSuper("toObject"), {
        _createBorderRect: this.get("_createBorderRect"),
        _createClipPath: this.get("_createClipPath"),
        setSrc: this.get("setSrc"),
        getSrc: this.get("getSrc"),
        setBorder: this.get("setBorder"),
        getBorder: this.get("getBorder"),
        applyFilter: this.get("applyFilter"),
        applyFilterValue: this.get("applyFilterValue"),
        getFilter: this.get("getFilter"),
      });
    },
  }) as any;

  (fabric.FImage as any).fromObject = (object: any, callback: (data: any) => void) => {
    const { objects, ...options } = object;

    const imgJson = { ...objects[0] };
    (fabric.Image as any).fromObject(imgJson, (img: fabric.Image) => {
      callback(new fabric.FImage({ image: img, ...options }, true));
    });
  };
};
