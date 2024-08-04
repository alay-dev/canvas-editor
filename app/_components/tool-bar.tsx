import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "@/context/global-context";
import { UndoLeftRound as UndoIcon, UndoRightRound as RedoIcon, Cursor as CursorIcon, Broom as ClearIcon } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Toolbar() {
  const { setActiveObject, editor } = useContext(GlobalStateContext);
  const [panEnable, setPanEnable] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const clearCanvas = async () => {
    await editor?.clearCanvas();
    if (editor?.sketch) setActiveObject?.(editor.sketch);
    editor?.fireCustomModifiedEvent();
  };

  const enablePan = () => {
    const enable = editor?.switchEnablePan() || false;
    setPanEnable(enable);
  };

  useEffect(() => {
    if (editor && editor?.fhistory) {
      setCanUndo(editor?.fhistory?.canUndo());
      setCanRedo(editor?.fhistory?.canRedo());
    }
  }, [editor]);

  return (
    <div className="flex  justify-center items-center">
      <Button
        // disabled={!canUndo}
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-gray-600 hover:text-white"
        onClick={() => editor?.fhistory?.undo()}
      >
        <UndoIcon color="#BDBDBD" />
      </Button>
      <Button
        // disabled={!canRedo}
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-gray-600 hover:text-white"
        onClick={() => editor?.fhistory?.redo()}
      >
        <RedoIcon color="#BDBDBD" />
      </Button>
      <div className="border-l h-full flex items-center border-gray-500 ml-2 pl-2">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-600 hover:text-white" onClick={enablePan}>
          <CursorIcon color="#BDBDBD" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-600 hover:text-white">
              <ClearIcon color="#BDBDBD" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="gap-0">
            <h2 className="text-white mb-1">Are yous sure you want to clear the canvas?</h2>
            <p className="text-gray-500 text-sm mb-6">Once canvas is cleared you cannot revert back your changes.</p>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-xs h-8">Cancel</AlertDialogCancel>
              <AlertDialogAction className="text-xs h-8" onClick={clearCanvas}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
