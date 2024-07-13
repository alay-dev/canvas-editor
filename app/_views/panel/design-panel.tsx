// @ts-nocheck

import { useEffect, useContext, useState } from "react";
import { GloablStateContext } from "@/context/global-context";
import { SKETCH_ID } from "@/utils/constants";
import { uuid } from "@/utils";
import { demoTemplate } from "@/demo";
import { Button } from "@/components/ui/button";

export type Layer = {
  object: fabric.Object;
  cover: string;
  group: boolean;
};

export default function Layer() {
  const {
    isReady,
    setReady,
    object: activeObject,
    setActiveObject,
    editor,
  } = useContext(GloablStateContext);
  const [layers, setLayers] = useState<Layer[]>([]);

  const getCanvasLayers = (objects: fabric.Object[]) => {
    const _layers: any = [];
    const length = objects.length;
    if (!length) {
      setLayers([]);
      return;
    }
    const activeObject = editor?.canvas.getActiveObject();
    for (let i = length - 1; i >= 0; i--) {
      let object = objects[i];
      if (object && object.id !== SKETCH_ID) {
        if (activeObject === object) {
          object.__cover = object.toDataURL({});
        } else {
          if (!object.__cover) {
            object.__cover = object.toDataURL({});
          }
        }

        _layers.push({
          cover: object.__cover,
          group: object.type === "group",
          object,
        });
      }
    }
    setLayers(_layers);
  };

  const loadDemo = async () => {
    if (!editor) return;
    setReady?.(false);
    await editor.loadFromJSON(JSON.parse(demoTemplate), true);
    editor.fhistory.reset();
    setReady?.(true);

    editor.fireCustomModifiedEvent();
  };

  const handleItemClick = (item: any) => {
    if (!editor) return;
    editor.canvas.discardActiveObject();
    editor.canvas.setActiveObject(item.object);
    editor.canvas.requestRenderAll();
  };

  useEffect(() => {
    let canvas: any;
    const initCanvasLayers = () => {
      getCanvasLayers(canvas.getObjects());
    };

    if (isReady) {
      setLayers([]);
      canvas = editor?.canvas;
      initCanvasLayers();

      canvas.on({
        "object:added": initCanvasLayers,
        "object:removed": initCanvasLayers,
        "object:modified": initCanvasLayers,
        "object:skewing": initCanvasLayers,
        "fabritor:object:modified": initCanvasLayers,
      });
    }

    return () => {
      if (canvas) {
        canvas.off({
          "object:added": initCanvasLayers,
          "object:removed": initCanvasLayers,
          "object:modified": initCanvasLayers,
          "object:skewing": initCanvasLayers,
          "fabritor:object:modified": initCanvasLayers,
        });
      }
    };
  }, [isReady]);

  return (
    <div className="p-4 w-full">
      {layers.length ? (
        <ul className="space-y-3">
          {layers?.map((item) => {
            return (
              <li
                onClick={() => handleItemClick(item)}
                className="bg-gray-800 rounded-lg p-4 border border-gray-600 transition  hover:border-gray-400 cursor-pointer"
                key={uuid()}
              >
                <img src={item.cover} className="h-10 " alt="" />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="p-4 flex flex-col items-center justify-center h-full">
          <h3 className="text-gray-500 ">Start your creativity.</h3>
          <div className="flex gap-2 items-center w-full my-4">
            <div className="h-px bg-gray-500 flex-1" />
            <p className="text-gray-400">OR</p>
            <div className="h-px bg-gray-500 flex-1" />
          </div>
          <Button onClick={loadDemo} className="w-full">
            Load a demo
          </Button>
        </div>
      )}
    </div>
  );
}
