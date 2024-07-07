export type SketchStyles = {
  size: number[];
  fill: {
    type: string;
    color: string;
    gradient?: {
      colorStops: any;
      angle: number;
    };
  };
};
