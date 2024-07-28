import { useState, useEffect, useContext } from "react";
import { GloablStateContext } from "@/context/global-context";
import { Input } from "@/components/ui/input";
import { Pen } from "solar-icon-set";
import { defaultCanvasName } from "@/constants/canvas";

export default function CanvasInfo() {
  const [canvasName, setCanvasName] = useState(defaultCanvasName);
  const [isEditing, setEditing] = useState(false);
  const { editor } = useContext(GloablStateContext);

  const handleChange = (name: string) => {
    setCanvasName(name);
    if (!editor) return;
    const { sketch } = editor;
    sketch?.set("canvas_name", name);
    editor.fireCustomModifiedEvent();
  };

  useEffect(() => {
    if (!editor) return;
    if (editor?.sketch?.canvas_name) setCanvasName(editor?.sketch?.canvas_name);
  }, [editor]);

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <Input value={canvasName} onChange={(e) => handleChange(e.target.value)} className="focus-visible:ring-0 w-64" onBlur={() => setEditing(false)} />
      ) : (
        <div className="flex items-center gap-2 ">
          <p className="text-sm text-gray-300">{canvasName}</p>
          <Pen onClick={() => setEditing(true)} />
        </div>
      )}
    </div>
  );
}
