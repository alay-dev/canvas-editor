import { FillType } from "@/app/_components/fill";
import { Shadow } from "@/app/_components/shadow";

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
  fontWeight?: string;
  shadow: Shadow;
};

export type FontStyle = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  linethrough: boolean;
};
