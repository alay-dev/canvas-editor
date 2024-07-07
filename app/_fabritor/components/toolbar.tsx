import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TOOLBAR_WIDTH } from "@/config";
import { GloablStateContext } from "@/context/global-context";
import { cn } from "@/lib/utils";
import { copyObject, pasteObject, removeObject } from "@/utils/helper";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { CopyPlusIcon, EllipsisIcon, Trash2Icon } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

const Toolbar = () => {
  const { editor } = useContext(GloablStateContext);
  const [toolbarPos, setToolbarPos] = useState({ left: 0, top: 0 });
  const [isToolbar, setToolbar] = useState(false);
  const [isMenu, setMenu] = useState(false);

  useEffect(() => {
    if (!editor) return;
    const target = editor?.canvas?._activeObject;

    editor.canvas?.on("mouse:down", () => {
      setToolbar(false);
    });

    editor.canvas?.on("mouse:up", () => {
      const targetRect = target?.getBoundingRect();

      const left =
        targetRect?.left! + targetRect?.width! / 2 - TOOLBAR_WIDTH / 2;
      const top = targetRect?.top! - 50;

      if (!target) {
        setMenu(false);
        setToolbar(false);
      } else {
        setToolbar(true);
        setToolbarPos({
          left: left,
          top: top,
        });
      }
    });
  }, [editor?.canvas?._activeObject, editor]);

  const handleDuplicate = async () => {
    if (!editor?.canvas || !editor?.canvas?._activeObject) return;
    await copyObject(editor?.canvas, editor?.canvas?._activeObject);
    await pasteObject(editor.canvas);
  };

  const handleDeleteObject = () => {
    if (!editor?.canvas || !editor?.canvas?._activeObject) return;
    removeObject(editor?.canvas?._activeObject, editor?.canvas);
    setToolbar(false);
    setMenu(false);
  };

  return (
    <div
      style={{
        left: toolbarPos.left,
        top: toolbarPos.top,
        width: TOOLBAR_WIDTH,
      }}
      className={cn(
        "absolute z-30 border  rounded-md bg-white text-black toolbar-shadow h-max",
        isToolbar ? "flex" : "hidden"
      )}
    >
      {" "}
      <Button onClick={handleDuplicate} variant={"ghost"} size="icon">
        <CopyPlusIcon size={20} />
      </Button>
      <Button onClick={handleDeleteObject} variant={"ghost"} size="icon">
        <Trash2Icon size={20} />
      </Button>
      <Button onClick={() => setMenu(true)} variant={"ghost"} size="icon">
        <EllipsisIcon size={20} />
      </Button>
      {/* <Popover open={isMenu && isToolbar}>
        <PopoverAnchor></PopoverAnchor>

        <PopoverContent side="right">jello</PopoverContent>
      </Popover> */}
    </div>
  );
};

export default Toolbar;
