import { FillType } from "@/app/_views/setter/shape-setter/shape";

export type TextStyle = {
  fontFamily: string;
  fontSize: number;
  fill: {
    type: FillType;
    color?: string;
    gradient?: {
      colorStops: any;
      angle: number;
    };
    image?: string;
  };
  textAlign: string;
  lineHeight: number;
  charSpacing: number;
  fontStyles: FontStyle;
};

export type FontStyle = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  linethrough: boolean;
};
