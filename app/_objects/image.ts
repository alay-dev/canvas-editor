import { fabric } from "fabric";
import { uuid } from "@/utils";
import { toast } from "sonner";

export const loadImageDom = async (url: string) => {
  return new Promise((resolve, reject) => {
    fabric.util.loadImage(
      url,
      (img) => {
        if (img) {
          return resolve(img);
        }

        toast("Failed to load the image", {
          description: "Oops. somethign went wrong. Please check the image.",
        });

        return reject();
      },
      null,
      "anonymous"
    );
  });
};

export const loadImage = async (imageSource: string) => {
  if (typeof imageSource === "string") {
    return new Promise<fabric.Image>((resolve, reject) => {
      fabric.Image.fromURL(
        imageSource,
        (img) => {
          if (!img) {
            toast("Failed to load the image", {
              description:
                "Oops. somethign went wrong. Please check the image.",
            });
            reject();
            return;
          }
          resolve(img);
        },
        {
          crossOrigin: "anonymous",
        }
      );
    });
  }
  return Promise.resolve(new fabric.Image(imageSource));
};

export const createClipRect = (object: fabric.Object, options = {}) => {
  const width = object.getScaledWidth();
  const height = object.getScaledHeight();
  return new fabric.Rect({
    left: -width / 2,
    top: -height / 2,
    width,
    height,
    ...options,
  });
};

export const createImage = async (options: {
  src: string;
  canvas: fabric.Canvas;
}) => {
  const { src, canvas, ...rest } = options || {};

  let img!: fabric.Image;
  try {
    img = await loadImage(src);
  } catch (e) {
    console.log(e);
  }

  if (!img) return;

  img.set({
    ...rest,
    paintFirst: "fill",
    id: uuid(),
  });

  canvas.viewportCenterObject(img);
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.requestRenderAll();

  return img;
};

export const createFImage = async (options: {
  src: string;
  canvas: fabric.Canvas;
}) => {
  const { src, canvas } = options || {};

  let img!: fabric.Image;
  try {
    img = await loadImage(src);
  } catch (e) {
    console.log(e);
  }

  if (!img) return;

  const cimg = new fabric.FImage(
    {
      image: img,
      id: uuid(),
    },
    false
  );

  canvas?.viewportCenterObject(cimg);
  canvas?.add(cimg);
  canvas?.setActiveObject(cimg);
  canvas?.requestRenderAll();
};
