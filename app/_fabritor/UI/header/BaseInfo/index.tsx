import { useState, useEffect, useContext } from "react";

import { GloablStateContext } from "@/context/global-context";
import { Input } from "@/components/ui/input";
import { Pen, Pen2 } from "solar-icon-set";

export default function BaseInfo() {
  const [desc, setDesc] = useState("New canvas");
  const [isEditing, setEditing] = useState(false);

  const { editor } = useContext(GloablStateContext);

  const handleChange = (v: string) => {
    const _v = v;
    setDesc(_v);
    if (!editor) return;
    const { sketch } = editor;
    // @ts-ignore custom desc
    sketch.set("canvas_name", _v);

    editor.fireCustomModifiedEvent();
  };

  useEffect(() => {
    if (!editor) return;
    const { sketch } = editor;
    console.log(sketch?.canvas_name, sketch, "CANVAS NAMe");

    if (sketch?.canvas_name) setDesc(sketch?.canvas_name);
  }, [editor?.sketch]);

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <Input
          value={desc}
          onChange={(e) => handleChange(e.target.value)}
          className="focus-visible:ring-0 w-64"
          onBlur={() => setEditing(false)}
        />
      ) : (
        <div className="flex items-center gap-2 ">
          <p className="text-sm text-gray-300"> {desc}</p>
          <Pen onClick={() => setEditing(true)} />
        </div>
      )}
    </div>
  );
}
