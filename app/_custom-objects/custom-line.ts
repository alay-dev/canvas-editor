import { fabric } from "fabric";

const extend = fabric.util.object.extend;

export const createFLineClass = () => {
  (fabric as any).FLine = fabric.util.createClass(fabric.Line, {
    type: "f-line",
    padding: 6,
    borderColor: "#00000000",

    setStrokeWidth(w: number) {
      this.set("strokeWidth", w);
    },

    setStrokeDashArray(dashArray: any[]) {
      this.set("strokeDashArray", dashArray);
    },

    setStrokeLineCap(isRound: string) {
      this.set("strokeLineCap", isRound ? "round" : "butt");
    },

    toObject(propertiesToInclude: any) {
      return extend(this.callSuper("toObject", propertiesToInclude), {
        x1: this.x1,
        y1: this.y1,
        x2: this.x2,
        y2: this.y2,
      });
    },
  }) as any;

  (fabric.FLine as any).fromObject = (object: any, callback: any) => {
    function _callback(instance: any) {
      delete instance.points;
      callback && callback(instance);
    }
    const options = { ...object };
    options.points = [object.x1, object.y1, object.x2, object.y2];
    fabric.Object._fromObject("FLine", options, _callback, "points");
  };
};
