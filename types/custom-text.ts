import { FillType } from "@/app/_components/fill";

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
