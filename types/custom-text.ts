export type TextStyle = {
  fontFamily: string;
  fontSize: number;
  fill: {
    type: string;
    color: string;
    gradient?: {
      colorStops: any;
      angle: number;
    };
  };
  textAlign: string;
  lineHeight: number;
  charSpacing: number;
  fontStyles: FontStyle;
  isLocked: boolean;
  opacity: number;
};

export type FontStyle = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  linethrough: boolean;
};
