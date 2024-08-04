import { GlobalStateContext } from "@/context/global-context";
import { cn } from "@/lib/utils";
import { useState, useContext, useEffect } from "react";

const RotateAngleToolTip = () => {
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const { editor } = useContext(GlobalStateContext);

  const rotateHandler = (opt: any) => {
    const { target, e } = opt;
    setPos({
      left: e.pageX + 16,
      top: e.pageY,
    });
    setContent(`${Math.round(target.angle)}°`);
    setOpen(true);
  };

  const mouseupHandler = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!editor?.canvas) return;
    if (editor) {
      editor.canvas.on("object:rotating", rotateHandler);
      editor.canvas.on("mouse:up", mouseupHandler);
    }
  }, [editor]);

  return (
    <div
      style={{
        left: pos.left,
        top: pos.top,
      }}
      className={cn("text-xs bg-black/85 text-white rounded-md px-2 py-1 fixed z-50", open ? "flex" : "hidden")}
    >
      {content}
    </div>
  );
};

export default RotateAngleToolTip;
