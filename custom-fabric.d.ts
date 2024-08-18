import { fabric } from "fabric";
import { Border } from "./types/c-image";

declare module "fabric" {
  namespace fabric {
    interface FImage extends fabric.Object {
      _createBorderRect(data: ImageBorder): fabric.Rect;
      _createClipPath(): fabric.Rect;
      setSrc(src: string, callback: () => void): void;
      getSrc(): string;
      setBorder(b: Border): void;
      getBorder(): Border;
      applyFilter(): void;
      applyFilterValue(): void;
      getFilter(): any;
    }

    // interface Object extends fabric.Object {
    //   id?: string;
    //   __cover?: string;
    //   __corner?: string;
    // }

    interface IRectOptions extends fabric.IRectOptions {
      id?: string;
    }

    interface FText extends fabric.Textbox {}
    interface FLine extends fabric.Line {}
    interface FArrow extends fabric.Line {}

    const FArrow: {
      new (points: number[], options: any): FArrow;
    };

    const FLine: {
      new (points: number[], options: any): FArrow;
    };

    const FImage: {
      new (options: any, alreayGrouped?: boolean): FImage;
      fromURL: Function;
    };

    const FText: {
      new (text: string, options: any): FText;
    };

    const Object: {};
  }
}
