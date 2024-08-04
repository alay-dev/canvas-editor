"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import Editor from "@/app/init";
import { GlobalStateContext } from "@/context/global-context";
import { Toaster } from "@/components/ui/sonner";
import Main from "./_layout/main";

export default function CanvasEditor() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const workspaceEl = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editor | undefined>(undefined);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [isReady, setReady] = useState(false);

  const clickHandler = (opt: any) => {
    // const { target } = opt;
    if (editor?.getIfPanEnable()) return;
  };

  const selectionHandler = (opt: fabric.IEvent<MouseEvent>) => {
    if (!editor?.canvas) return;
    const { selected } = opt;
    if (selected && selected.length) {
      const selection = editor?.canvas?.getActiveObject();
      setActiveObject(selection);
    } else {
      setActiveObject(editor?.sketch);
    }
  };

  const groupHandler = () => {
    if (!editor?.canvas) return;
    const selection = editor?.canvas?.getActiveObject();
    setActiveObject(selection);
  };

  const initEvent = () => {
    if (!editor?.canvas) return;
    editor.canvas.on("selection:created", selectionHandler);
    editor.canvas.on("selection:updated", selectionHandler);
    editor.canvas.on("selection:cleared", selectionHandler);
    editor.canvas.on("mouse:down", clickHandler);
    editor.canvas.on("editor:group", groupHandler);
    editor.canvas.on("editor:ungroup", groupHandler);
  };

  const initEditor = async () => {
    const _editor = new Editor({
      canvasEl: canvasEl.current,
      workspaceEl: workspaceEl.current,
      sketchEventHandler: {
        groupHandler: () => {
          setActiveObject(editor?.canvas?.getActiveObject() || null);
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
    <main>
      <GlobalStateContext.Provider value={{ object: activeObject, setActiveObject, isReady, setReady, editor }}>
        <Main isReady={isReady}>
          <div id="canvas-editor" ref={workspaceEl} className="flex-1 h-full relative">
            <canvas ref={canvasEl} />
          </div>
        </Main>
      </GlobalStateContext.Provider>
      <Toaster />
    </main>
  );
}
