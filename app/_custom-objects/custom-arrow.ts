import { fabric } from "fabric";

const extend = fabric.util.object.extend;

export const createFArrowClass = () => {
  (fabric as any).FArrow = fabric.util.createClass(fabric.Line, {
    type: "f-arrow",

    borderColor: "#000",

    _render: function (ctx: any) {
      this.callSuper("_render", ctx);

      ctx.save();

      if (!this.oldArrowInfo) {
        this.oldArrowInfo = { left: -28, top: -15, bottom: 15, strokeWidth: this.strokeWidth };
      }
      var xDiff = this.x2 - this.x1;
      var yDiff = this.y2 - this.y1;
      var angle = Math.atan2(yDiff, xDiff);
      ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
      ctx.rotate(angle);

      const delta = this.strokeWidth - this.oldArrowInfo.strokeWidth;
      ctx.lineJoin = this.strokeLineJoin;
      ctx.lineCap = this.strokeLineCap;
      ctx.strokeStyle = this.stroke;
      ctx.beginPath();

      ctx.moveTo(0, 0);
      ctx.lineTo(this.oldArrowInfo.left - delta, this.oldArrowInfo.bottom + delta);
      ctx.lineTo(this.oldArrowInfo.left - delta, this.oldArrowInfo.top - delta);
      ctx.closePath();
      ctx.fillStyle = this.stroke;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    },

    setStrokeWidth(w: number) {
      this.set("strokeWidth", w);
    },

    setStrokeDashArray(dashArray: any[]) {
      this.set("strokeDashArray", dashArray);
    },

    setStrokeLineCap(isRound: boolean) {
      this.set("strokeLineCap", isRound ? "round" : "butt");
      this.set("strokeLineJoin", isRound ? "round" : "miter");
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

  (fabric.FArrow as any).fromObject = function (object: any, callback: (data: any) => void) {
    callback?.(new fabric.FArrow([object.x1, object.y1, object.x2, object.y2], object));
  };
};
