"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import Header from "./UI/header";
import Panel from "./UI/panel";
import Setter from "./UI/setter";
import Editor from "@/app/_fabritor/init";
import { GloablStateContext } from "@/context/global-context";
import ObjectRotateAngleTip from "./components/ObjectRotateAngleTip";
import Toolbar from "./components/toolbar";
import { Spinner } from "@/components/ui/spinner";

export default function Fabritor() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const workspaceEl = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeObject, setActiveObject] = useState<
    fabric.Object | null | undefined
  >(null);
  const [isReady, setReady] = useState(false);

  const clickHandler = (opt: any) => {
    // const { target } = opt;
    if (editor?.getIfPanEnable()) return;
  };

  const selectionHandler = (opt: fabric.IEvent<MouseEvent>) => {
    const { selected } = opt;
    if (selected && selected.length) {
      const selection = editor?.canvas?.getActiveObject();
      setActiveObject(selection);
    } else {
      // setActiveObject(sketch);
    }
  };

  const groupHandler = () => {
    const selection = editor?.canvas?.getActiveObject();
    setActiveObject(selection);
  };

  const initEvent = () => {
    if (!editor?.canvas) return;
    editor.canvas.on("selection:created", selectionHandler);
    editor.canvas.on("selection:updated", selectionHandler);
    editor.canvas.on("selection:cleared", selectionHandler);

    editor.canvas.on("mouse:down", clickHandler);

    editor.canvas.on("fabritor:group", groupHandler);
    editor.canvas.on("fabritor:ungroup", groupHandler);
  };

  const initEditor = async () => {
    const _editor = new Editor({
      canvasEl: canvasEl.current,
      workspaceEl: workspaceEl.current,
      sketchEventHandler: {
        groupHandler: () => {
          setActiveObject(editor?.canvas?.getActiveObject());
        },
      },
    });

    await _editor.init();

    setEditor(_editor);
    setReady(true);
    setActiveObject(_editor.sketch);
  };

  useEffect(() => {
    if (editor) {
      initEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    initEditor();

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GloablStateContext.Provider
      value={{
        object: activeObject,
        setActiveObject,
        isReady,
        setReady,
        editor,
      }}
    >
      <div className="h-full relative">
        {!isReady && (
          <div className="absolute top-1/2 left-1/2 z-20 backdrop-brightness-50 w-full h-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <Spinner />
          </div>
        )}

        <ObjectRotateAngleTip />
        <Header />
        <div className="h-screen w-full flex pt-14">
          <Panel />
          <div className="h-full bg-gray-200  flex-1 relative">
            <div
              id="canvas-editor"
              ref={workspaceEl}
              className=" w-full h-full relative"
            >
              <canvas ref={canvasEl} />
            </div>
          </div>

          <Setter />
        </div>
      </div>
    </GloablStateContext.Provider>
  );
}
